import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-slate-900">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last Updated: April 21, 2026</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">1. Information We Collect</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          At Afkit, we collect information you provide directly to us when you make a purchase, create an account, or contact us. This includes your name, email address, phone number, and shipping address.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">2. How We Use Your Information</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 text-slate-600 space-y-2">
          <li>Process and fulfill your orders.</li>
          <li>Send you order confirmations and shipping updates via Email and WhatsApp.</li>
          <li>Provide customer support.</li>
          <li>Improve our website and services.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">3. Data Security</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">4. Data Deletion</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          You have the right to request the deletion of your personal data. To do so, please contact us at <span className="font-semibold text-slate-900">info@afkit.ng</span>. We will process your request within 30 days.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">5. Contact Us</h2>
        <p className="text-slate-600 leading-relaxed mb-4">
          If you have any questions about this Privacy Policy, please contact us at <span className="font-semibold text-slate-900">info@afkit.ng</span>.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
