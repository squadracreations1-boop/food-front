import React from 'react';
import './styles/PolicyPages.css';

const LegalPrivacy = () => {
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
                <h2>Privacy Policy</h2>
            </div>

            <div className="last-updated">
                <p><strong>Last Updated:</strong> {currentDate}</p>
            </div>

            <div className="policy-content">
                <section className="policy-section">
                    <p>
                        At <strong>Maitreyi Foods</strong>, your privacy is important to us. This Privacy Policy
                        outlines how we collect, use, and protect your personal information.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>1. Information We Collect</h2>

                    <h3>Personal Information</h3>
                    <ul className="policy-list">
                        <li>Name, email address, phone number</li>
                        <li>Shipping and billing address</li>
                        <li>Order and transaction details</li>
                        <li>Account preferences and settings</li>
                    </ul>

                    <h3>Automatically Collected Information</h3>
                    <ul className="policy-list">
                        <li>IP address, browser type, device details</li>
                        <li>Cookies and usage data to improve website performance and user experience</li>
                        <li>Pages visited, time spent on site, and navigation patterns</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>2. How We Use Your Information</h2>
                    <ul className="policy-list">
                        <li>To process and deliver your orders efficiently</li>
                        <li>To manage your account and customer support requests</li>
                        <li>To send order updates, service notifications, and promotional offers (optional)</li>
                        <li>To analyze website usage and enhance functionality</li>
                        <li>To comply with legal obligations and prevent fraud</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>3. Data Security</h2>
                    <p>
                        We follow industry-standard security practices to safeguard your personal data.
                    </p>
                    <p>
                        <strong>Your information is never sold, rented, or traded to third parties.</strong>
                    </p>
                    <p>
                        Data may be shared only with trusted partners (payment processors, delivery partners)
                        strictly for order fulfillment purposes.
                    </p>
                    <p>
                        We implement SSL encryption and secure servers to protect your data during transmission.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>4. Cookies</h2>
                    <p>
                        Our website uses cookies to personalize your experience and analyze traffic.
                    </p>
                    <p>
                        You may disable cookies in your browser settings; however, certain features may
                        not function properly.
                    </p>
                    <p>
                        We use both session cookies (temporary) and persistent cookies (remain on your
                        device) to enhance user experience.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>5. Your Rights</h2>
                    <p>
                        You may request access, correction, or deletion of your personal data at any time.
                    </p>
                    <p>
                        You can unsubscribe from marketing communications using the link provided in our emails.
                    </p>
                    <p>
                        You have the right to know what personal data we hold about you and how it's processed.
                    </p>
                    <p>
                        To exercise these rights, please contact us at support@maitreyifoods.com.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>6. Third-Party Links</h2>
                    <p>
                        Our website may contain links to external websites.
                    </p>
                    <p>
                        <strong>Maitreyi Foods is not responsible for the privacy practices or content
                            of third-party sites.</strong>
                    </p>
                    <p>
                        We encourage you to review the privacy policies of any external sites you visit.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>7. Children's Privacy</h2>
                    <p>
                        Our services are not directed to individuals under 18 years of age.
                    </p>
                    <p>
                        We do not knowingly collect personal information from children. If you become
                        aware that a child has provided us with personal information, please contact us.
                    </p>
                </section>

                <div className="contact-highlight">
                    <h3>Privacy Concerns</h3>
                    <p>For any privacy-related questions or requests:</p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <i>📧</i>
                            <span>privacy@maitreyifoods.com</span>
                        </div>
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
                        <strong>Note:</strong> This Privacy Policy may be updated periodically to reflect
                        changes in our practices or legal requirements. We will notify you of significant
                        changes through our website or email.
                    </p>
                </div>
            </div>

            <div className="policy-footer">
                <p><strong>Maitreyi Foods</strong> - Protecting your privacy while delivering authentic taste.</p>
            </div>
        </div>
    );
};

export default LegalPrivacy;