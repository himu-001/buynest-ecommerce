import React, { useState } from "react";
import { X, CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentModal = ({ booking, onPayment, onClose, isProcessing }) => {
  const [paymentFailed, setPaymentFailed] = useState(false);

  if (!booking) return null;

  const handlePayment = async (outcome) => {
    const success = await onPayment(outcome);

    if (outcome === "failure" || !success) {
      setPaymentFailed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-800 disabled:opacity-50"
        >
          <X size={22} />
        </button>

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <CreditCard size={30} className="text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Complete Your Payment
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your room booking has been created successfully.
          </p>
        </div>

        <div className="mb-6 rounded-xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">Total Amount</p>

          <h3 className="mt-1 text-3xl font-bold text-gray-800">
            ${booking.totalPrice?.toLocaleString("en-IN")}
          </h3>

          <p className="mt-2 text-xs text-gray-500">
            Booking ID: {booking._id}
          </p>
        </div>

        {paymentFailed && (
          <div className="mb-5 flex items-center gap-3 rounded-lg bg-red-50 p-4 text-red-700">
            <XCircle size={22} />

            <p className="text-sm">Payment failed. You can try again.</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handlePayment("success")}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle size={19} />
                Simulate Successful Payment
              </>
            )}
          </button>

          <button
            onClick={() => handlePayment("failure")}
            disabled={isProcessing}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <XCircle size={19} />
            Simulate Failed Payment
          </button>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-gray-500">
          This is a development-only payment simulation. No real money will be
          charged.
        </p>
      </div>
    </div>
  );
};

export default PaymentModal;
