import React from 'react';
import './styles/PolicyPages.css';

const Terms = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="policy-container">
            <div className="policy-header">
                <h1>Maitreyi Foods</h1>
                <p className="policy-subtitle">Taste the Tradition</p>
                <h2>Terms of Service</h2>
            </div>

            <div className="last-updated">
                <p><strong>Last Updated:</strong> {currentDate}</p>
            </div>

            <div className="policy-content">
                <section className="policy-section">
                    <p>
                        Welcome to <strong>Maitreyi Foods</strong>. By accessing or using our website
                        (www.maitreyifoods.com), you agree to be bound by the following Terms of Service.
                        Please read them carefully before using our services.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>1. Website Usage</h2>
                    <p>
                        You must be at least 18 years of age, or access the website under parental
                        or legal guardian supervision.
                    </p>
                    <p>
                        All content available on this website—including text, images, graphics, logos,
                        and branding—is the exclusive property of Maitreyi Foods and is protected under
                        applicable copyright and intellectual property laws.
                    </p>
                    <p>
                        Any unauthorized reproduction, modification, distribution, or commercial use of
                        our content is strictly prohibited.
                    </p>
                    <p>
                        You agree to provide accurate, current, and complete information when creating
                        an account or placing an order.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>2. Orders & Payments</h2>
                    <p>
                        All orders placed on the website are subject to product availability, pricing
                        accuracy, and order confirmation.
                    </p>
                    <p>
                        We reserve the right to cancel or refuse any order due to pricing errors,
                        suspected fraud, or operational constraints.
                    </p>
                    <p>
                        Payments are securely processed through trusted third-party payment gateways.
                        <strong> Maitreyi Foods does not store or have access to your card or payment details.</strong>
                    </p>
                </section>

                <section className="policy-section">
                    <h2>3. User Accounts</h2>
                    <p>
                        You are solely responsible for maintaining the confidentiality of your
                        login credentials.
                    </p>
                    <p>
                        Any activity performed using your account will be deemed as authorized by you.
                    </p>
                    <p>
                        Please notify us immediately if you suspect any unauthorized access or
                        security breach.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>4. Limitation of Liability</h2>
                    <p>
                        Maitreyi Foods shall not be liable for any indirect, incidental, special,
                        or consequential damages arising from the use or inability to use this website.
                    </p>
                    <p>
                        We do not guarantee uninterrupted, secure, or error-free access to our services.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>5. Modifications to Terms</h2>
                    <p>
                        We may revise these Terms of Service at any time without prior notice.
                    </p>
                    <p>
                        Continued use of the website after updates constitutes acceptance of the
                        revised terms.
                    </p>
                </section>

                <div className="contact-highlight">
                    <h3>Contact Us</h3>
                    <p>For questions regarding our Terms of Service:</p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <i>📧</i>
                            <span>support@maitreyifoods.com</span>
                        </div>
                        <div className="contact-item">
                            <i>📞</i>
                            <span>[Customer Support Number]</span>
                        </div>
                    </div>
                </div>

                <div className="note-box">
                    <p>
                        <strong>Note:</strong> These Terms of Service constitute the entire agreement
                        between you and Maitreyi Foods regarding your use of our website and services.
                    </p>
                </div>
            </div>

            <div className="policy-footer">
                <p><strong>Maitreyi Foods</strong> - Authentic Taste. Honest Ingredients. Delivered with Trust.</p>
            </div>
        </div>
    );
};

export default Terms;