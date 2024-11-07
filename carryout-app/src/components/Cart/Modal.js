// Modal.js
import React from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <Scrollbars>
    <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes />
          </button>
        </div>
        <div className="overflow-y-auto ">{children}</div>
      </div>
    </div>
    </Scrollbars>
  );
};

export default Modal;
