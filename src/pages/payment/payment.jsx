import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  UserCircle,
  IndianRupee,
  FileText,
  Info,
  Download,
  Share2,
  Check,
  Smartphone,
  Wallet,
  CreditCard,
  ShoppingBag,
  Shield
} from 'lucide-react';

const Payment = () => {
  const [amount, setAmount] = useState('100');
  const [purpose, setPurpose] = useState('Payment');
  const [selectedPreset, setSelectedPreset] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

  const qrcodeContainerRef = useRef(null);
  const qrcodeInstanceRef = useRef(null);
  const upiId = 'kratos29@ptyes';

  const amountPresets = [10, 50, 100, 200, 500, 1000];

  // Load QRCode.js library dynamically
  useEffect(() => {
    // Check if library is already loaded
    if (window.QRCode) {
      setIsLibraryLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.async = true;

    script.onload = () => {
      setIsLibraryLoaded(true);
      // Generate initial QR code after library loads
      generateQRCode();
    };

    script.onerror = () => {
      console.error('Failed to load QRCode.js library');
      alert('Failed to load QR code generator. Please refresh the page.');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Generate UPI payment string
  const generateUPIString = (amt, purp = '') => {
    let upiString = `upi://pay?pa=${upiId}&pn=Kratos&am=${amt}&cu=INR`;
    if (purp && purp.trim() !== '') {
      upiString += `&tn=${encodeURIComponent(purp.trim())}`;
    }
    return upiString;
  };

  // Generate QR code using QRCode.js library
  const generateQRCode = () => {
    if (!isLibraryLoaded || !qrcodeContainerRef.current) return;

    // Clear previous QR code
    if (qrcodeInstanceRef.current) {
      qrcodeContainerRef.current.innerHTML = '';
      qrcodeInstanceRef.current = null;
    }

    if (!amount || parseFloat(amount) <= 0) {
      // Show placeholder
      qrcodeContainerRef.current.innerHTML = `
        <div style="text-align: center; padding: 48px 0; color: #9ca3af;">
          <svg style="width: 80px; height: 80px; margin-bottom: 15px; opacity: 0.5;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clip-rule="evenodd"></path>
            <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z"></path>
          </svg>
          <p style="font-weight: 500;">Enter amount to generate QR code</p>
        </div>
      `;
      return;
    }

    // Generate UPI payment string
    const upiString = generateUPIString(amount, purpose);

    // Create new QR code
    try {
      qrcodeInstanceRef.current = new window.QRCode(qrcodeContainerRef.current, {
        text: upiString,
        width: 200,
        height: 200,
        colorDark: "#1e40af",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Update QR code when amount or purpose changes
  useEffect(() => {
    if (isLibraryLoaded) {
      generateQRCode();
    }
  }, [amount, purpose, isLibraryLoaded]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setSelectedPreset(null);
  };

  const handlePresetClick = (presetAmount) => {
    setAmount(presetAmount.toString());
    setSelectedPreset(presetAmount);
  };

  const handlePurposeChange = (e) => {
    setPurpose(e.target.value);
  };

  const handleDownload = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount first');
      return;
    }

    setIsDownloading(true);

    if (qrcodeContainerRef.current) {
      const canvas = qrcodeContainerRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `upi-payment-₹${amount}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        alert('QR code not generated yet');
      }
    }

    setTimeout(() => setIsDownloading(false), 2000);
  };

  const handleShare = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount first');
      return;
    }

    setIsSharing(true);

    const shareData = {
      title: `UPI Payment Request - ₹${amount}`,
      text: purpose ?
        `Please pay ₹${amount} via UPI (${upiId}) for ${purpose}. Scan the QR code to pay.` :
        `Please pay ₹${amount} via UPI (${upiId}). Scan the QR code to pay.`
    };

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        if (qrcodeContainerRef.current) {
          const canvas = qrcodeContainerRef.current.querySelector('canvas');
          if (canvas) {
            canvas.toBlob(async (blob) => {
              const file = new File([blob], `upi-payment-₹${amount}.png`, { type: 'image/png' });

              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                  ...shareData,
                  files: [file]
                });
              } else {
                await navigator.share(shareData);
              }
            });
          } else {
            await navigator.share(shareData);
          }
        } else {
          await navigator.share(shareData);
        }
      } catch (err) {
        // console.error('Error sharing:', err);
        handleDownload();
      }
    } else {
      const textToCopy = `UPI Payment Details:\nAmount: ₹${amount}\nUPI ID: ${upiId}\nPurpose: ${purpose || 'Payment'}`;
      await navigator.clipboard.writeText(textToCopy);
      alert('Payment details copied to clipboard!');
    }

    setTimeout(() => setIsSharing(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-t-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <QrCode className="w-8 h-8" />
              UPI Payment QR Generator
            </h1>
            <p className="text-blue-100 mt-1">Generate dynamic QR codes for instant payments via any UPI app</p>
          </div>
          <div className="mt-4 md:mt-0 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
            <UserCircle className="w-6 h-6" />
            <span className="font-semibold">UPI ID: <span className="font-mono">{upiId}</span></span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left Panel: Input Section */}
          <div className="border-r-0 lg:border-r lg:pr-8 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-100">Enter Payment Details</h2>

            {/* Amount Input */}
            <div className="mb-8">
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-gray-500" />
                Amount (₹)
              </label>

              <div className="relative">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={handleAmountChange}
                  className="w-full py-4 px-5 text-lg font-semibold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</div>
              </div>

              {/* Amount Presets */}
              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-3">Quick select:</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {amountPresets.map((preset) => (
                    <div
                      key={preset}
                      className={`amount-preset rounded-lg py-3 text-center font-medium cursor-pointer transition-all duration-200 ${selectedPreset === preset
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-100 hover:bg-blue-100 border border-gray-300 hover:border-blue-400'
                        }`}
                      onClick={() => handlePresetClick(preset)}
                      data-amount={preset}
                    >
                      ₹{preset}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Purpose Input */}
            <div className="mb-8">
              <label htmlFor="purpose" className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                Payment Purpose (Optional)
              </label>
              <input
                type="text"
                id="purpose"
                value={purpose}
                onChange={handlePurposeChange}
                className="w-full py-4 px-5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="e.g., Order #12345, Product Purchase, Service Fee"
              />
            </div>

            {/* Information Note */}
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Note:</p>
                  <p className="text-blue-700 text-sm mt-1">The QR code will automatically update when you change the amount. Share the QR code or save it as an image to receive payments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: QR Code Section */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">Scan & Pay</h2>
              <p className="text-gray-600 text-center mb-8">Scan this QR code with any UPI app to complete your payment</p>

              {/* QR Container */}
              <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-lg mb-8">
                <div
                  id="qrcode"
                  ref={qrcodeContainerRef}
                  className="flex justify-center min-h-[220px] items-center"
                >
                  {/* QR code will be generated here by QRCode.js */}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700 font-semibold">UPI ID:</span>
                    <span className="font-mono font-bold text-gray-900">{upiId}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-700 font-semibold">Amount:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₹{amount ? parseFloat(amount).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  {purpose && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-semibold">Purpose:</span>
                      <span className="text-gray-900 font-medium">{purpose}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleDownload}
                  disabled={!amount || parseFloat(amount) <= 0 || isDownloading || !isLibraryLoaded}
                  className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isDownloading ? (
                    <>
                      <Check className="w-5 h-5" />
                      Downloaded!
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download QR Code
                    </>
                  )}
                </button>
                <button
                  onClick={handleShare}
                  disabled={!amount || parseFloat(amount) <= 0 || isSharing || !isLibraryLoaded}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSharing ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-5 h-5" />
                      Share
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Apps Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Supported UPI Apps</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {[
            { name: 'Google Pay', gradient: 'from-orange-500 to-yellow-500', icon: <Smartphone className="w-10 h-10 text-white" /> },
            { name: 'PhonePe', gradient: 'from-blue-600 to-blue-400', icon: <CreditCard className="w-10 h-10 text-white" /> },
            { name: 'Paytm', gradient: 'from-cyan-500 to-blue-500', icon: <Smartphone className="w-10 h-10 text-white" /> },
            { name: 'BHIM', gradient: 'from-indigo-600 to-indigo-400', icon: <Shield className="w-10 h-10 text-white" /> },
            { name: 'Amazon Pay', gradient: 'from-purple-600 to-pink-500', icon: <ShoppingBag className="w-10 h-10 text-white" /> },
            { name: 'Any UPI App', gradient: 'from-green-600 to-green-400', icon: <Wallet className="w-10 h-10 text-white" /> }
          ].map((app, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg mb-3`}>
                {app.icon}
              </div>
              <span className="text-gray-800 font-medium">{app.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* How to Use Section */}
      <div className="mt-16 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">How to Use</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { number: '1', title: 'Enter Amount', description: 'Type the payment amount in the input field or select from preset amounts.' },
            { number: '2', title: 'QR Code Generated', description: 'A dynamic QR code will be automatically created with your UPI ID and amount.' },
            { number: '3', title: 'Scan & Pay', description: 'Open any UPI app and scan the QR code to make payment instantly.' }
          ].map((step, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-4">
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center">
        <p className="text-gray-700 font-medium">Dynamic UPI Payment QR Code Generator | UPI ID: {upiId}</p>
        <p className="text-gray-500 text-sm mt-2">This tool generates valid UPI payment QR codes compatible with all UPI applications.</p>
      </div>
    </div>
  );
};

export default Payment;