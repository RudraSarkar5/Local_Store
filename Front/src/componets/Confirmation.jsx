import React from "react";

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className=" bg-red-600 p-8 shadow-md text-amber-400">
      <p className="py-5">{message}</p>
      <div className="flex gap-5 justify-center">
        <button
          className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={onConfirm}
        >
          Confirm
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
