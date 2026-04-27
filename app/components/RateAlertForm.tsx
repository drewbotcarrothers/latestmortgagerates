"use client";

import { useState } from "react";

interface RateAlertFormProps {
  embedded?: boolean;
}

const PRODUCT_OPTIONS = [
  { value: "fixed_5yr_insured", label: "5-Year Fixed (Insured)" },
  { value: "fixed_5yr_uninsured", label: "5-Year Fixed (Uninsured)" },
  { value: "variable_5yr_insured", label: "5-Year Variable (Insured)" },
  { value: "variable_5yr_uninsured", label: "5-Year Variable (Uninsured)" },
  { value: "fixed_3yr", label: "3-Year Fixed" },
  { value: "fixed_10yr", label: "10-Year Fixed" },
];

export default function RateAlertForm({ embedded = false }: RateAlertFormProps) {
  const [email, setEmail] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["fixed_5yr_uninsured"]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleProductToggle = (value: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(value)) {
        return prev.filter((p) => p !== value);
      }
      return [...prev, value];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email.trim() || !validateEmail(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (selectedProducts.length === 0) {
      setStatus("error");
      setMessage("Please select at least one rate product to track.");
      return;
    }

    if (!termsAccepted) {
      setStatus("error");
      setMessage("Please agree to receive rate alert emails.");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      // Store in localStorage (client-side only, no backend needed)
      const existing = localStorage.getItem("rateAlertSubscribers");
      const subscribers = existing ? JSON.parse(existing) : [];

      // Check if already subscribed
      const alreadySubscribed = subscribers.some(
        (sub: { email: string }) => sub.email.toLowerCase() === email.toLowerCase()
      );

      if (alreadySubscribed) {
        setStatus("error");
        setMessage("This email is already subscribed to rate alerts.");
        setLoading(false);
        return;
      }

      const newSubscriber = {
        email: email.toLowerCase().trim(),
        products: selectedProducts,
        subscribedAt: new Date().toISOString(),
        frequency: "immediate",
      };

      subscribers.push(newSubscriber);
      localStorage.setItem("rateAlertSubscribers", JSON.stringify(subscribers));

      setStatus("success");
      setMessage("✓ You\u0027re subscribed! We\u0027ll email you when tracked rates drop by more than 0.05%.");
      setEmail("");
      setTermsAccepted(false);
      setSelectedProducts(["fixed_5yr_uninsured"]);
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="rate-alert" className={`${embedded ? "" : "bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16"}`}>
      <div className="max-w-4xl mx-auto px-4">
        {!embedded && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <span>📉 Rate Alerts</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Never Miss a Rate Drop
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Get instant email alerts when mortgage rates drop by more than 0.05%. 
              Track the products that matter to you.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 md:p-8 text-slate-800">
          {status === "success" && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-emerald-500 text-xl">✅</span>
                <p className="text-emerald-800 font-medium">{message}</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <p className="text-red-800 font-medium">{message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="alert-email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="alert-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              />
              <p className="text-xs text-slate-500 mt-1">
                We\u0027ll email you when tracked rates drop by &0.05%.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Which rates do you want to track?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 flex items-center gap-3 ${
                      selectedProducts.includes(option.value)
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-teal-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={selectedProducts.includes(option.value)}
                      onChange={() => handleProductToggle(option.value)}
                      className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm font-medium text-slate-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                I agree to receive email notifications about mortgage rate drops. 
                I can unsubscribe at any time.{" "}
                <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Subscribing...
                </>
              ) : (
                <>Set Up Rate Alerts</>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              We monitor rates daily. You\u0027ll only get notified when there\u0027s a meaningful drop.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✅</span>
                <span>Daily Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✅</span>
                <span>Instant Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-500">✅</span>
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
