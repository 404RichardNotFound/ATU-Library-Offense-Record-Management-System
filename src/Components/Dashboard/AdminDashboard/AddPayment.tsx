import * as React from 'react';
import { useState } from 'react';
import { DatePicker } from 'antd'; // Import Ant Design DatePicker
import dayjs from 'dayjs'; // Import dayjs for date handling
import toast, { Toaster } from 'react-hot-toast'; // Import React Hot Toast

const AddPayment = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    studentName: '',
    studentID: '',
    program: '',
    amount: '',
    reason: '',
    paymentDate: null as string | null, // ✅ Allow null or string
    status: '',
  });

  // ✅ New state for submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle Date Change
  const handleDateChange = (
    _date: dayjs.Dayjs | null,
    dateString: string | string[]
  ) => {
    const formattedDate = Array.isArray(dateString)
      ? dateString[0]
      : dateString;
    setFormData((prev) => ({ ...prev, paymentDate: formattedDate }));
  };

  // ✅ Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // ✅ Disable button

    // 📢 Simulate an API request (replace with actual API call)
    setTimeout(() => {
      toast.success('Payment has been recorded!', {
        duration: 3000,
        position: 'top-center',
      });

      // Reset form fields
      setFormData({
        studentName: '',
        studentID: '',
        program: '',
        amount: '',
        reason: '',
        paymentDate: null,
        status: '',
      });

      setIsSubmitting(false); // ✅ Re-enable button after submission
    }, 2000);
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* 🔥 Toast Container */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-zinc-200 bg-white h-[710px] w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Payment</h1>

        {/* Student Information */}
        <div className="flex flex-col w-full gap-4">
          <div className="text-base w-full flex gap-2 flex-col">
            <label>Name:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="studentName"
              placeholder="Name"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Student ID:</label>
            <input
              className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
              type="text"
              placeholder="Student ID"
              name="studentID"
              value={formData.studentID}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Program:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              placeholder="Program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-4 w-full">
          <div className="text-base flex gap-2 w-full flex-col">
            <label>Amount:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Reason:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="reason"
              placeholder="Reason"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Payment Date:</label>
            <DatePicker
              className="rounded-sm bg-slate-50 hover:border-zinc-200 border-[1px] px-2 w-full py-1 hover:border-dotted"
              value={formData.paymentDate ? dayjs(formData.paymentDate) : null}
              onChange={handleDateChange}
              required
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label>Status:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button with Loading Spinner */}
        <div className="flex gap-2 mt-1 justify-start">
          <button
            type="submit"
            className="border-2 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
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
            {isSubmitting ? 'Please wait...' : 'Add Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;
