import { useState } from 'react';
import { DatePicker } from 'antd'; // Import Ant Design DatePicker
import dayjs from 'dayjs'; // Import dayjs for date handling
import toast, { Toaster } from 'react-hot-toast'; // Import React Hot Toast

const AddToList = () => {
  // State for storing BorrowDate and ReturnDate
  const [borrowDate, setBorrowDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  // ✅ Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent page reload

    // 📢 Show success toast using React Hot Toast
    toast.success('Book has been added!', {
      duration: 3000, // Toast disappears after 3 seconds
      position: 'top-center', // Toast appears at top right
    });

    // Reset form fields
    e.target.reset();
    setBorrowDate(null);
    setReturnDate(null);
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* 🔥 Toast Container (Ensures toasts are displayed) */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-2 border-zinc-200 bg-white h-auto w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Borrowed Book</h1>
        <div className="flex flex-col gap-4 h-auto justify-between">
          {/* Student Information */}
          <div className="flex flex-col w-full gap-4">
            <div className="text-base w-full flex gap-2 flex-col">
              <label>Name:</label>
              <input
                className="rounded-sm bg-slate-50 border-2 px-2 w-full"
                type="text"
                name="name"
                required
              />
            </div>
            <div className="text-base flex gap-2 w-auto flex-col">
              <label>Student ID:</label>
              <input
                className="rounded-sm px-2 w-full bg-slate-50 border-2"
                type="text"
                name="studentID"
                required
              />
            </div>
            <div className="text-base flex gap-2 w-full flex-col">
              <label>Book:</label>
              <input
                className="rounded-sm bg-slate-50 border-2 px-2 w-full"
                type="text"
                name="book"
                required
              />
            </div>
          </div>

          {/* Borrow & Return Dates */}
          <div className="flex flex-col gap-4 w-full">
            <div className="text-base flex gap-2 w-full flex-col">
              <label>Borrow Date:</label>
              <DatePicker
                className="rounded-sm bg-slate-50 border-2 px-2 w-full"
                value={borrowDate ? dayjs(borrowDate) : null}
                onChange={(_date, dateString: any) => setBorrowDate(dateString)}
                required
              />
            </div>
            <div className="text-base w-full flex gap-2 flex-col">
              <label>Return Date:</label>
              <DatePicker
                className="rounded-sm bg-slate-50 border-2 px-2 w-full"
                value={returnDate ? dayjs(returnDate) : null}
                onChange={(_date, dateString: any) => setReturnDate(dateString)}
                required
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label>Status:</label>
          <input
            className="rounded-sm bg-slate-50 border-2 px-2"
            type="text"
            name="status"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 justify-start">
          <button
            type="submit"
            className="border-2 items-center flex gap-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddToList;
