import { useNavigate, Link } from "react-router-dom";
import { useDocumentTitle } from "@/lib/use-document-title";
import { useState } from "react";
import { SiteLayout, PageHero } from "@/components/SiteLayout";
import { useCart } from "@/lib/cart-context";
import API from "@/api/axios";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CartPage() {
  useDocumentTitle("Your Cart | GrowDoctor");
  const { items, subtotal, loading, isLoggedIn, updateItem, removeItem, refresh } = useCart();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to check out");
      navigate("/login");
      return;
    }
    if (items.length === 0) return;

    const { fullName, phone, line1, city, state, pincode } = address;
    if (!fullName || !phone || !line1 || !city || !state || !pincode) {
      toast.error("Please fill in your shipping/billing details");
      return;
    }

    setPlacingOrder(true);
    try {
      const createRes = await API.post("/orders/create", {
        items,
        shippingAddress: address,
        shippingFee: 0,
        tax: 0,
      });
      const { order, razorpayKeyId } = createRes.data;

      if (!window.Razorpay) {
        toast.error("Payment gateway failed to load. Please refresh and try again.");
        setPlacingOrder(false);
        return;
      }

      let prefillUser: { fullName?: string; email?: string; phone?: string } = {};
      try {
        prefillUser = JSON.parse(localStorage.getItem("growdoctor_user") || "{}");
      } catch {
        prefillUser = {};
      }

      const rzp = new window.Razorpay({
        key: razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "GrowDoctor",
        description: "Order payment",
        order_id: order.razorpayOrderId,
        // Explicitly surface UPI alongside cards/netbanking/wallets so it isn't
        // hidden behind Razorpay's "more options" fold.
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [{ method: "upi" }],
              },
              other: {
                name: "Other payment methods",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence: ["block.upi", "block.other"],
            preferences: { show_default_blocks: false },
          },
        },
        prefill: {
          name: prefillUser.fullName || address.fullName || undefined,
          email: prefillUser.email || undefined,
          contact: prefillUser.phone || address.phone || undefined,
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await API.post("/orders/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              toast.success("Payment successful! Order confirmed.");
              await refresh();
              navigate("/");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
        theme: { color: "#2E7D32" },
      });

      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not start checkout");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Cart"
        title="Your Cart"
        subtitle={isLoggedIn ? "Review your items and check out securely." : "Browsing as a guest — log in before checkout to save your cart."}
      />
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {loading && <p className="text-sm text-muted-foreground">Loading your cart…</p>}

          {!loading && items.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Link to="/services" className="mt-4 inline-block rounded-lg bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground hover:opacity-90">
                Browse Services
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant ?? ""}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                  >
                    <div>
                      <h3 className="font-semibold text-primary">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateItem(item.productId, Math.max(1, item.quantity - 1), item.variant)}
                        className="rounded-md border border-border p-1.5 hover:bg-muted"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.productId, item.quantity + 1, item.variant)}
                        className="rounded-md border border-border p-1.5 hover:bg-muted"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.variant)}
                        className="ml-2 rounded-md p-1.5 text-red-500 hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-primary">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                  <h3 className="font-semibold text-primary">Billing Details</h3>
                  <input
                    placeholder="Full name"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  />
                  <input
                    placeholder="Phone"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  />
                  <input
                    placeholder="Address"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="City"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="rounded-lg border border-border p-2 text-sm"
                    />
                    <input
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="rounded-lg border border-border p-2 text-sm"
                    />
                  </div>
                  <input
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className="w-full rounded-lg border border-border p-2 text-sm"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="w-full rounded-lg bg-secondary py-3 text-sm font-semibold text-secondary-foreground hover:opacity-90 disabled:opacity-60"
                >
                  {placingOrder ? "Processing…" : "Proceed to Payment"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
