import { useState } from 'react';
import { DatePicker } from 'antd'; // Import Ant Design DatePicker
import dayjs from 'dayjs'; // Import dayjs for date handling
import toast, { Toaster } from 'react-hot-toast'; // Import React Hot Toast

const AddOffense = () => {
  // State for offense date
  const [offenseDate, setOffenseDate] = useState(null);

  // ✅ Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent page reload

    // 📢 Show success toast
    toast.success('Offense has been recorded!', {
      duration: 3000,
      position: 'top-center',
    });

    // Reset form fields
    e.target.reset();
    setOffenseDate(null);
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* 🔥 Toast Container */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-2 border-zinc-200 bg-white h-auto w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Offense</h1>

        {/* Student Information */}
        <div className="flex flex-col w-full gap-4">
          <div className="text-base w-full flex gap-2 flex-col">
            <label>Name:</label>
            <input
              className="rounded-sm bg-slate-50 border-2 px-2 w-full"
              type="text"
              name="studentName"
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Student ID:</label>
            <input
              className="rounded-sm px-2 w-full bg-slate-50 border-2"
              type="text"
              name="studentID"
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Email:</label>
            <input
              className="rounded-sm bg-slate-50 border-2 px-2 w-full"
              type="email"
              name="email"
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Program:</label>
            <input
              className="rounded-sm bg-slate-50 border-2 px-2 w-full"
              type="text"
              name="program"
              required
            />
          </div>
        </div>

        {/* Offense Details */}
        <div className="flex flex-col gap-4 w-full">
          <div className="text-base flex gap-2 w-full flex-col">
            <label>Offense Type:</label>
            <input
              className="rounded-sm bg-slate-50 border-2 px-2 w-full"
              type="text"
              name="offenseType"
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Offense Description:</label>
            <textarea
              className="rounded-sm bg-slate-50 border-2 px-2 w-full h-20"
              name="description"
              required
            />
          </div>

          <div className="text-base flex gap-2 w-full flex-col">
            <label>Offense Date:</label>
            <DatePicker
              className="rounded-sm bg-slate-50 border-2 px-2 w-full"
              value={offenseDate ? dayjs(offenseDate) : null}
              onChange={(_date, dateString: any) => setOffenseDate(dateString)}
              required
            />
          </div>
        </div>

        {/* Penalty & Status */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label>Penalty:</label>
          <input
            className="rounded-sm bg-slate-50 border-2 px-2"
            type="text"
            name="penalty"
            required
          />
        </div>

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

export default AddOffense;
