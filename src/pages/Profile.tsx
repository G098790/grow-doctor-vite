import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { useAuth } from "@/lib/auth-context";
import API from "@/api/axios";
import { User, Mail, Phone, Briefcase, LogOut, Package } from "lucide-react";
import { useDocumentTitle } from "@/lib/use-document-title";
import "./styles.css";

type Order = {
  _id: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
};

export default function ProfilePage() {
  useDocumentTitle("My Profile | GrowDoctor");
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data?.orders ?? []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Account"
        title="My Profile"
        subtitle="Your account details and order history."
      />
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Profile card */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-2xl font-bold text-secondary-foreground">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-primary">{user.fullName}</h2>
                  {user.profession && (
                    <p className="text-sm text-muted-foreground">{user.profession}</p>
                  )}
                </div>

                <div className="mt-6 space-y-4 border-t border-border pt-6">
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-4 w-4 text-secondary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Full Name
                      </p>
                      <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-secondary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Email
                      </p>
                      <p className="text-sm font-medium text-foreground break-all">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-secondary" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium text-foreground">{user.phone}</p>
                    </div>
                  </div>

                  {user.profession && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="mt-0.5 h-4 w-4 text-secondary" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Profession
                        </p>
                        <p className="text-sm font-medium text-foreground">{user.profession}</p>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>

            {/* Order history */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Package className="h-5 w-5 text-secondary" /> Order History
                </h3>

                {loadingOrders && (
                  <p className="mt-4 text-sm text-muted-foreground">Loading your orders…</p>
                )}

                {!loadingOrders && orders.length === 0 && (
                  <div className="mt-6 rounded-xl border border-dashed border-border p-8 text-center">
                    <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
                    <Link
                      to="/services"
                      className="mt-3 inline-block rounded-lg bg-secondary px-4 py-2 text-xs font-semibold text-secondary-foreground hover:opacity-90"
                    >
                      Browse Services
                    </Link>
                  </div>
                )}

                {!loadingOrders && orders.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="rounded-xl border border-border p-4 text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-semibold text-primary">
                            {order.items.map((i) => i.name).join(", ")}
                          </span>
                          <span
                            className={
                              "rounded-full px-3 py-1 text-xs font-semibold " +
                              (order.paymentStatus === "paid"
                                ? "bg-green-100 text-green-700"
                                : order.paymentStatus === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700")
                            }
                          >
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-muted-foreground">
                          <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                          <span className="font-semibold text-primary">
                            ₹{order.totalAmount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
