import React, { useState } from 'react';
import './Donate.css';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import Confetti from 'react-confetti';

const donationOptions = [
  { amount: 500, impact: 'Help 1 student with educational materials.' },
  { amount: 1000, impact: 'Support 2 students for a month.' },
  { amount: 2000, impact: 'Provide tuition for 4 students.' },
  { amount: 3000, impact: 'Fund half-year education for 5 students.' },
  { amount: 5000, impact: 'Sponsor full-year education for 10 students.' }
];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [donor, setDonor] = useState({ name: '', email: '', phone: '' });
  const [showCardForm, setShowCardForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '', focus: '' });

  const handleDonorSubmit = (e) => {
    e.preventDefault();
    if (donor.name && donor.email && donor.phone && selectedAmount) {
      setShowCardForm(true);
    } else {
      alert('Please fill all fields and select a donation amount.');
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="donate-container">
      {!showCardForm && !submitted && (
        <div className="donate-section">
          <div className="donate-left">
            <h2>Select a Donation Amount</h2>
            {donationOptions.map((opt) => (
              <div
                key={opt.amount}
                className={`donation-option ${selectedAmount === opt.amount ? 'selected' : ''}`}
                onClick={() => setSelectedAmount(opt.amount)}
              >
                <h3>₹{opt.amount}</h3>
                <p>{opt.impact}</p>
              </div>
            ))}
          </div>

          <div className="donate-right">
            <h2>Donor Details</h2>
            <form onSubmit={handleDonorSubmit}>
              <label htmlFor="name">Name*</label>
              <input
                type="text"
                id="name"
                value={donor.name}
                onChange={(e) => setDonor({ ...donor, name: e.target.value })}
                required
              />
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                value={donor.email}
                onChange={(e) => setDonor({ ...donor, email: e.target.value })}
                required
              />
              <label htmlFor="phone">Phone*</label>
              <input
                type="tel"
                id="phone"
                value={donor.phone}
                onChange={(e) => setDonor({ ...donor, phone: e.target.value })}
                required
              />
              <label htmlFor="amount">Selected Amount</label>
              <input type="text" id="amount" value={`₹${selectedAmount || ''}`} readOnly />
              <button type="submit">Proceed to Payment</button>
            </form>
          </div>
        </div>
      )}

      {showCardForm && !submitted && (
        <div className="card-section">
          <h2>Enter Credit Card Details</h2>
          <Cards {...card} />
          <form className="card-form" onSubmit={handleCardSubmit}>
            <input
              type="tel"
              name="number"
              placeholder="Card Number"
              onChange={e => setCard({ ...card, number: e.target.value })}
              onFocus={e => setCard({ ...card, focus: 'number' })}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={e => setCard({ ...card, name: e.target.value })}
              onFocus={e => setCard({ ...card, focus: 'name' })}
              required
            />
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              onChange={e => setCard({ ...card, expiry: e.target.value })}
              onFocus={e => setCard({ ...card, focus: 'expiry' })}
              required
            />
            <input
              type="tel"
              name="cvc"
              placeholder="CVC"
              onChange={e => setCard({ ...card, cvc: e.target.value })}
              onFocus={e => setCard({ ...card, focus: 'cvc' })}
              required
            />
            <button type="submit">Donate Now</button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="certificate-section">
          <Confetti />
          <h2>🎉 Thank You, {donor.name}!</h2>
          <p>You have successfully donated <strong>₹{selectedAmount}</strong>.</p>
          <p>This contribution will help <strong>{donationOptions.find(o => o.amount === selectedAmount)?.impact}</strong></p>
          <div className="certificate">
            <h3>Certificate of Appreciation</h3>
            <p>Presented to <strong>{donor.name}</strong></p>
            <p>for your generous contribution of ₹{selectedAmount}</p>
            <p>Email: {donor.email}</p>
            <p>Phone: {donor.phone}</p>
            <p><em>We appreciate your support towards empowering students!</em></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donate;