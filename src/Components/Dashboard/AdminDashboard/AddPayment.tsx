import * as React from 'react';
import { useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import toast, { Toaster } from 'react-hot-toast';

const AddPayment = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    Payment_ID: '',
    Student_Name: '',
    Student_ID: '',
    Student_Program: '',
    Amount: '',
    Reason: '',
    Status: '',
    Payment_Date: '',
  });

  // State for loading status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Function to generate a unique PaymentID
  const generatePaymentID = () => {
    return `PAY-${Date.now()}`; // Unique ID based on the current timestamp
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Ensure Payment_ID is generated before submission
    const newPaymentID = generatePaymentID();

    const paymentData = {
      ...formData,
      Payment_ID: newPaymentID, // Set Payment_ID here
      Payment_Date: formData.Payment_Date
        ? dayjs(formData.Payment_Date).format('DD/MM/YYYY')
        : '',
    };

    try {
      // Add payment to Firestore (PaymentList collection)
      await addDoc(collection(db, 'PaymentList'), paymentData);

      toast.success('Payment added successfully!');

      // Reset form
      setFormData({
        Payment_ID: generatePaymentID(),
        Student_Name: '',
        Student_ID: '',
        Student_Program: '',
        Amount: '',
        Reason: '',
        Status: '',
        Payment_Date: '',
      });
    } catch (error) {
      toast.error('Error adding payment. Please try again.');
      console.error('Firebase Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* 🔥 Toast Container */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-neutral-300 bg-white h-[700px] w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Payment</h1>

        {/* Student Information */}
        <div className="flex flex-col w-full gap-4">
          <div className="text-base w-full flex gap-2 flex-col">
            <label htmlFor="Student Name">Name:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="Student_Name"
              placeholder="Name"
              value={formData.Student_Name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Student ID">Student ID:</label>
            <input
              className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
              type="text"
              placeholder="Student ID"
              name="Student_ID"
              value={formData.Student_ID}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Student Program">Program:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              placeholder="Program"
              name="Student_Program"
              value={formData.Student_Program}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-4 w-full">
          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Amount">Amount:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="Amount"
              placeholder="Amount"
              value={formData.Amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Reasons">Reason:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="Reason"
              placeholder="Reason"
              value={formData.Reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Payment Date">Payment Date:</label>
            <DatePicker
              className="rounded-sm bg-slate-50 hover:border-zinc-200 border-[1px] px-2 w-full py-1 hover:border-dotted"
              value={
                formData.Payment_Date ? dayjs(formData.Payment_Date) : null
              }
              onChange={(_date, dateString) =>
                setFormData({
                  ...formData,
                  Payment_Date: Array.isArray(dateString)
                    ? dateString[0]
                    : dateString,
                })
              }
              required
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label htmlFor="Status">Status:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            name="Status"
            placeholder="Status"
            value={formData.Status}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button with Loading Spinner */}
        <div className="flex gap-2 mt-1 justify-start">
          <button
            type="submit"
            className="transition-colors duration-300 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
            disabled={isSubmitting} // Disable button while submitting
          >
            {/* Show spinner when submitting */}
            {isSubmitting && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            )}
            {/* Change button text when submitting */}
            {isSubmitting ? 'Adding Payment...' : 'Add Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;
