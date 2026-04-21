import React from "react";

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Terms of Service</h1>
      <p className="text-sm text-slate-500 mb-8">Last Updated: April 21, 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Acceptance of Terms</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          By accessing or using the Afkit website (afkit.ng), you agree to be bound by these Terms of Service and all applicable laws and regulations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. Products and Pricing</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          All products listed on our website are subject to availability. We reserve the right to change prices and product details at any time without prior notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. Payments</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Payments are processed securely through our payment partners. For "Pay on Delivery" (Commitment) orders, a non-refundable commitment fee of ₦10,000 is required to secure the order.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Shipping and Delivery</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Delivery times are estimates and may vary based on your location. We are not responsible for delays caused by third-party logistics providers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Limitation of Liability</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          Afkit shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services or products.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">6. Governing Law</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">7. Contact Information</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          For any questions regarding these Terms, please contact us at <span className="font-semibold text-slate-900">info@afkit.ng</span>.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
