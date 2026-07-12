import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import logo from "@/assets/growdoctor-navbar-logo.jpeg";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/solutions", label: "Solutions" },
  { to: "/about", label: "About" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { items } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setOpen(false);
    navigate("/");
  };

  const firstName = user?.fullName?.split(" ")[0] || "Account";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Logo */}
      <Link
        to="/"
        className="flex items-center"
        onClick={() => setOpen(false)}
      >
        <img
        src={logo}
        alt="GrowDoctor Digital Solutions"
        className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                "rounded-md px-3 py-2 text-sm font-medium transition-colors " +
                (isActive
                  ? "text-secondary font-semibold"
                  : "text-foreground/80 hover:text-foreground")
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 lg:flex">

          <Link
            to="/cart"
            className="relative rounded-full p-2 text-foreground/80 hover:bg-muted"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-full border border-secondary px-5 py-2 text-sm font-semibold hover:bg-secondary hover:text-white transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full border border-secondary px-5 py-2 text-sm font-semibold hover:bg-secondary hover:text-white transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                {firstName}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            to="/contact"
            className="rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition hover:opacity-90"
          >
            Book Free Consultation
          </Link>

        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 lg:hidden"
          aria-label="Toggle Menu"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col px-4 py-3">

            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}

            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-center text-sm font-semibold hover:bg-muted"
            >
              <ShoppingCart className="h-4 w-4" /> Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-md border border-secondary px-5 py-3 text-center text-sm font-semibold hover:bg-secondary hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-md border border-secondary px-5 py-3 text-center text-sm font-semibold hover:bg-secondary hover:text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-md border border-border px-5 py-3 text-center text-sm font-semibold hover:bg-muted"
                >
                  <User className="h-4 w-4" /> My Profile ({firstName})
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 flex items-center justify-center gap-2 rounded-md border border-red-200 px-5 py-3 text-center text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            )}

            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-secondary px-5 py-3 text-center text-sm font-semibold text-secondary-foreground"
            >
              Book Free Consultation
            </Link>

          </nav>
        </div>
      )}
    </header>
  );
}