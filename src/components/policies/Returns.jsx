import React from 'react';
import './styles/PolicyPages.css';

const Returns = () => {
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
                <h2>Return & Refund Policy</h2>
            </div>

            <div className="last-updated">
                <p><strong>Last Updated:</strong> {currentDate}</p>
            </div>

            <div className="policy-content">
                <section className="policy-section">
                    <p>
                        At <strong>Maitreyi Foods</strong>, customer satisfaction is our priority.
                        If you are not completely satisfied with your purchase, we are here to assist you.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>1. Returns</h2>
                    <p>
                        Returns are accepted within <strong>7 days</strong> of delivery for:
                    </p>
                    <ul className="policy-list">
                        <li>Damaged or defective products</li>
                        <li>Incorrect products received</li>
                        <li>Spoiled or expired items (perishable goods)</li>
                    </ul>

                    <h3>Return Conditions:</h3>
                    <ul className="policy-list">
                        <li>Items must be unused and in original packaging</li>
                        <li>Original invoice must accompany the return</li>
                        <li>Products must be in resalable condition</li>
                    </ul>

                    <h3>Return Process:</h3>
                    <ol className="policy-list">
                        <li>Contact us at <strong>support@maitreyifoods.com</strong> within 7 days of delivery</li>
                        <li>Provide your order ID and reason for return</li>
                        <li>We will provide return instructions and authorization</li>
                        <li>Ship the item(s) back to us using the provided instructions</li>
                    </ol>
                </section>

                <section className="policy-section">
                    <h2>2. Refunds</h2>
                    <p>
                        Once the returned product is received and inspected, we will notify you of
                        approval or rejection via email.
                    </p>
                    <p>
                        <strong>Approved refunds</strong> will be processed to the original payment method
                        within <strong>5–10 business days</strong>.
                    </p>
                    <p>
                        <strong>Shipping charges are non-refundable</strong>, except in cases where
                        the error is on our part (wrong item shipped, damaged during transit).
                    </p>
                    <p>
                        For cash on delivery (COD) orders, refunds will be processed via bank transfer.
                    </p>
                </section>

                <section className="policy-section">
                    <h2>3. Exchanges</h2>
                    <p>
                        We currently do not offer direct exchanges. Customers may:
                    </p>
                    <ul className="policy-list">
                        <li>Return the item for a refund and place a new order for the required product</li>
                        <li>Contact us for special circumstances</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>4. Non-Returnable Items</h2>
                    <ul className="policy-list">
                        <li>Perishable food items (unless damaged or spoiled upon delivery)</li>
                        <li>Products without original packaging or seals broken</li>
                        <li>Items showing signs of use, tampering, or consumption</li>
                        <li>Personalized or made-to-order products</li>
                        <li>Items purchased during clearance sales (unless defective)</li>
                    </ul>
                </section>

                <section className="policy-section">
                    <h2>5. Damaged or Incorrect Items</h2>
                    <p>
                        If you receive a damaged or incorrect item:
                    </p>
                    <ul className="policy-list">
                        <li>Contact us within <strong>24 hours</strong> of delivery</li>
                        <li>Provide photos of the damaged/incorrect item and packaging</li>
                        <li>We will arrange for pickup and replacement/refund at no additional cost</li>
                    </ul>
                </section>

                <div className="contact-highlight">
                    <h3>Customer Support</h3>
                    <p>For returns, refunds, or any product concerns:</p>
                    <div className="contact-info">
                        <div className="contact-item">
                            <i>📧</i>
                            <span>support@maitreyifoods.com</span>
                        </div>
                        <div className="contact-item">
                            <i>📞</i>
                            <span>[Customer Support Number]</span>
                        </div>
                        <div className="contact-item">
                            <i>🕒</i>
                            <span>Business Hours: Monday – Saturday | 9:00 AM – 6:00 PM (IST)</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '15px', fontSize: '0.95rem', color: '#555' }}>
                        <strong>Response Time:</strong> We typically respond within 24 hours on business days.
                    </p>
                </div>

                <div className="note-box">
                    <p>
                        <strong>Important:</strong> This policy applies only to products purchased directly
                        from Maitreyi Foods website. Products purchased from third-party retailers are
                        subject to their respective return policies.
                    </p>
                </div>
            </div>

            <div className="policy-footer">
                <p><strong>Maitreyi Foods</strong> - Your satisfaction is our recipe for success.</p>
            </div>
        </div>
    );
};

export default Returns;