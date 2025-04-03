import { useState } from 'react';
import { DatePicker } from 'antd';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';

const AddToList = () => {
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to manage form data
  const [formData, setFormData] = useState({
    Student_Name: '',
    Student_ID: '',
    Student_Program: '',
    Book_Title: '',
    Borrow_Date: '',
    Return_Date: '',
    Status: '',
  });

  // Handle form field changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format Borrow_Date to "DD/MM/YYYY"
      const Borrow_Date_Formatted = formData.Borrow_Date
        ? dayjs(formData.Borrow_Date).format('DD/MM/YYYY')
        : '';

      // Format Return_Date to "DD/MM/YYYY"
      const Return_Date_Formatted = formData.Return_Date
        ? dayjs(formData.Return_Date).format('DD/MM/YYYY')
        : '';

      const bookData = {
        ...formData,
        Borrow_Date: Borrow_Date_Formatted, // Store only the formatted date
        Return_Date: Return_Date_Formatted, // Store only the formatted date
      };

      await addDoc(collection(db, 'BorrowedBooks'), bookData);

      toast.success('Added successfully!');
      // Reset form after submission
      setFormData({
        Student_Name: '',
        Student_ID: '',
        Student_Program: '',
        Book_Title: '',
        Borrow_Date: '',
        Return_Date: '',
        Status: '',
      });
    } catch (error) {
      toast.error('Error adding to list. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* 🔥 Toast Container (Ensures toasts are displayed) */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-zinc-200 h-[695px] bg-white w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Borrowed Book</h1>
        <div className="flex flex-col gap-4 h-auto justify-between">
          {/* Student Information */}
          <div className="flex flex-col w-full gap-4">
            <div className="text-base w-full flex gap-2 flex-col">
              <label htmlFor="Student Name">Student Name:</label>
              <input
                onChange={handleChange}
                className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
                type="text"
                value={formData.Student_Name}
                placeholder="Student Name"
                name="Student_Name"
                required
              />
            </div>
            <div className="text-base flex gap-2 w-auto flex-col">
              <label htmlFor="Student ID">Student ID:</label>
              <input
                onChange={handleChange}
                className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
                type="text"
                placeholder="Student ID"
                value={formData.Student_ID}
                name="Student_ID"
                required
              />
            </div>
            <div className="text-base flex gap-2 w-auto flex-col">
              <label htmlFor="Program">Program:</label>
              <input
                onChange={handleChange}
                className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
                type="text"
                placeholder="Program"
                value={formData.Student_Program}
                name="Student_Program"
                required
              />
            </div>
            <div className="text-base flex gap-2 w-full flex-col">
              <label htmlFor="Book_Title">Book:</label>
              <input
                onChange={handleChange}
                className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
                type="text"
                placeholder="Book Title"
                value={formData.Book_Title}
                name="Book_Title"
                required
              />
            </div>
          </div>

          {/* Borrow & Return Dates */}
          <div className="flex flex-col gap-4 w-full">
            <div className="text-base flex gap-2 w-full flex-col">
              <label htmlFor="Borrow Date">Borrow Date:</label>
              <DatePicker
                className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted hover:border-zinc-200"
                value={
                  formData.Borrow_Date ? dayjs(formData.Borrow_Date) : null
                }
                onChange={(_date, dateString) =>
                  setFormData({
                    ...formData,
                    Borrow_Date: Array.isArray(dateString)
                      ? dateString[0]
                      : dateString,
                  })
                }
                required
              />
            </div>
            <div className="text-base w-full flex gap-2 flex-col">
              <label htmlFor="Return Date">Return Date:</label>
              <DatePicker
                className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted hover:border-zinc-200"
                value={
                  formData.Return_Date ? dayjs(formData.Return_Date) : null
                }
                onChange={(_date, dateString) =>
                  setFormData({
                    ...formData,
                    Return_Date: Array.isArray(dateString)
                      ? dateString[0]
                      : dateString,
                  })
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label htmlFor="Status">Status:</label>
          <input
            onChange={handleChange}
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            placeholder="Status"
            value={formData.Status}
            name="Status"
            required
          />
        </div>

        {/* ✅ Submit Button with Loading Spinner */}
        <div className="flex gap-2 mt-1 justify-start">
          <button
            type="submit"
            className="border-2 transition-colors duration-300 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
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
            {isSubmitting ? 'Please wait...' : 'Add to List'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddToList;
