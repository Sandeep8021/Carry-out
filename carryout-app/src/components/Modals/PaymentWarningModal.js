import React from 'react';
import Modal from './Modal'; // Assuming you have a Modal component

const PaymentWarningModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Payment Option Required">
    <div className="p-4">
      <p className="text-lg mb-2">
        Please select a payment option to proceed with your order.
      </p>
      <p className="text-gray-600">
        Choose from one of the available payment methods to complete your purchase.
      </p>
      <div className="mt-4">
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
);
