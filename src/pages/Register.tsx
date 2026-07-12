import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, User, Mail, Phone, Briefcase, Lock, CheckCircle2 } from "lucide-react";
import logo from "@/assets/grow.jpeg";
import hero from "@/assets/doc.jpg";
import API from "../api/axios";
import { useAuth } from "@/lib/auth-context";
import { useDocumentTitle } from "@/lib/use-document-title";

type Field = {
  name: string;
  email: string;
  phone: string;
  profession: string;
  password: string;
  confirm: string;
  terms: boolean;
};

type Errors = Partial<Record<keyof Field, string>>;

const PROFESSIONS = [
  "Doctor",
  "Clinic Owner",
  "Hospital",
  "Medical Student",
  "Healthcare Professional",
];

function validate(fields: Field): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Full name is required.";
  if (!fields.email.trim()) errors.email = "Email is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
    errors.email = "Enter a valid email address.";
  if (!fields.phone.trim()) errors.phone = "Phone number is required.";
  if (!fields.password) errors.password = "Password is required.";
  else if (fields.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (!fields.confirm) errors.confirm = "Please confirm your password.";
  else if (fields.confirm !== fields.password)
    errors.confirm = "Passwords do not match.";
  if (!fields.terms) errors.terms = "You must accept the terms to continue.";
  return errors;
}

function InputWrapper({
  label,
  icon,
  error,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  useDocumentTitle("Register | GrowDoctor");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fields, setFields] = useState<Field>({
    name: "",
    email: "",
    phone: "",
    profession: PROFESSIONS[0],
    password: "",
    confirm: "",
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (key: keyof Field) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setFields((prev) => ({
        ...prev,
        [key]: e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value,
      }));

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const errs = validate(fields);
  setErrors(errs);
  setSubmitError("");

  if (Object.keys(errs).length > 0) return;

  setSubmitting(true);
  try {
    const res = await API.post("/auth/register", {
      fullName: fields.name,
      email: fields.email,
      phone: fields.phone,
      profession: fields.profession,
      password: fields.password,
    });

    if (res.data.token) {
      login(res.data.user, res.data.token);
    }

    setSubmitted(true);

  } catch (err: any) {
    console.error(err);
    setSubmitError(err.response?.data?.message || "Registration failed. Please try again.");
  } finally {
    setSubmitting(false);
  }
};
  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100";

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-sm rounded-3xl bg-white p-10 shadow-2xl text-center space-y-4">
          <CheckCircle2 className="mx-auto text-green-500" size={56} />
          <h2 className="text-2xl font-bold text-gray-900">Account created!</h2>
          <p className="text-gray-500 text-sm">
            Welcome to GrowDoctor. You're all set and signed in.
          </p>
          <Link
            to="/profile"
            className="mt-4 inline-block w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition"
          >
            Go to My Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-green-600 to-emerald-700 flex-col justify-between p-12">

        {/* Logo badge */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg">
            <img src={logo} alt="GrowDoctor logo" className="h-12 w-12 object-contain" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">GrowDoctor</span>
        </div>

        {/* Hero copy */}
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold text-white leading-tight">
            Better care<br />starts here.
          </h1>
          <p className="text-green-100 text-lg max-w-sm">
            Join thousands of healthcare professionals using GrowDoctor for
            digital appointments, AI-powered tools, and patient management.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {["AI diagnostics", "e-Prescriptions", "Telemedicine", "Analytics"].map((f) => (
              <span
                key={f}
                className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-8">
          <img
            src={hero}
            alt="Healthcare professionals"
            className="w-full rounded-2xl object-cover shadow-xl"
            style={{ maxHeight: "360px" }}
          />
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-lg">

          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 shadow">
              <img src={logo} alt="GrowDoctor" className="h-10 w-10 object-contain" />
            </div>
            <span className="text-base font-bold text-gray-800">GrowDoctor</span>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl lg:p-10">

            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Create account</h2>
              <p className="mt-1 text-sm text-gray-500">
                Already have one?{" "}
                <Link to="/login" className="font-semibold text-green-700 hover:underline">
                  Log in
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {submitError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 flex items-center gap-1">
                  <span>⚠</span> {submitError}
                </p>
              )}

              {/* Full Name */}
              <InputWrapper label="Full name" icon={<User size={16} />} error={errors.name}>
                <input
                  type="text"
                  placeholder="Dr. Arjun Mehta"
                  value={fields.name}
                  onChange={set("name")}
                  className={inputBase}
                />
              </InputWrapper>

              {/* Email */}
              <InputWrapper label="Email address" icon={<Mail size={16} />} error={errors.email}>
                <input
                  type="email"
                  placeholder="arjun@clinic.com"
                  value={fields.email}
                  onChange={set("email")}
                  className={inputBase}
                />
              </InputWrapper>

              {/* Phone */}
              <InputWrapper label="Phone number" icon={<Phone size={16} />} error={errors.phone}>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={fields.phone}
                  onChange={set("phone")}
                  className={inputBase}
                />
              </InputWrapper>

              {/* Profession */}
              <InputWrapper label="Profession" icon={<Briefcase size={16} />}>
                <select
                  value={fields.profession}
                  onChange={set("profession")}
                  className={inputBase}
                >
                  {PROFESSIONS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </InputWrapper>

              {/* Password row */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Password */}
                <InputWrapper label="Password" icon={<Lock size={16} />} error={errors.password}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={fields.password}
                    onChange={set("password")}
                    className={`${inputBase} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </InputWrapper>

                {/* Confirm */}
                <InputWrapper label="Confirm password" icon={<Lock size={16} />} error={errors.confirm}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={fields.confirm}
                    onChange={set("confirm")}
                    className={`${inputBase} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </InputWrapper>

              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={fields.terms}
                    onChange={set("terms")}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-green-600"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="font-medium text-green-700 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="font-medium text-green-700 hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500">⚠ {errors.terms}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create account"}
              </button>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}