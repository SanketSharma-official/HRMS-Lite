import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function AttendanceConfirmationModal({ isOpen, onClose, onConfirm, date, status }) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(dontShowAgain);
  };

  const isFuture = new Date(date) > new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900 bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-md w-full">
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Marking {isFuture ? 'Future' : 'Past'} Attendance
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">
                  You are about to mark attendance for <strong>{date}</strong> as <span className="font-semibold">{status}</span>.
                </p>
                <p className="text-sm text-gray-500">
                  This date is not today. Are you sure you want to proceed?
                </p>
              </div>
              
              <div className="mt-4 flex items-center">
                <input
                  id="dont-show"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                <label htmlFor="dont-show" className="ml-2 block text-sm text-gray-900">
                  Don't show this warning again
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}