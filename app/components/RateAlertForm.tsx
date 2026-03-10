"use client";

import { useState } from "react";

interface RateAlertFormProps {
  embedded?: boolean;
}

export default function RateAlertForm({ embedded = false }: RateAlertFormProps) {
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Submit to PHP backend on Hostinger
      const response = await fetch("/subscribe.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, frequency }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEmail("");
      } else {
        setError(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const frequencyOptions = [
    { value: "daily", label: "Daily", description: "Best rates every morning" },
    { value: "weekly", label: "Weekly", description: "Sunday summary of the week" },
    { value: "monthly", label: "Monthly", description: "Monthly market trends" },
  ];

  return (
    <div className={`${embedded ? "" : "bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16"}`}>
      <div className="max-w-4xl mx-auto px-4">
        {!embedded && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get the Best Mortgage Rates in Your Inbox
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Stay ahead of the market with curated rate summaries delivered to your inbox. 
              Compare rates from Canada&apos;s top lenders without the hassle.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-6 md:p-8 text-slate-800">
          {message && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {message}
              </span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </span>
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
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                How often would you like updates?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {frequencyOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                      frequency === option.value
                        ? "border-teal-500 bg-teal-50"
                        : "border-slate-200 hover:border-teal-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={frequency === option.value}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{option.label}</span>
                      <span className="text-sm text-slate-500">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
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
                <>Subscribe to Rate Alerts</>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              By subscribing, you agree to receive mortgage rate emails. 
              Unsubscribe anytime. We respect your privacy.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>98% Open Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30+ Lenders Tracked</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Unsubscribe Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
