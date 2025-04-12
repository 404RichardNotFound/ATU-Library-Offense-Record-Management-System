import { useState } from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import toast, { Toaster } from 'react-hot-toast';

const AddOffense = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    Student_Name: '',
    Student_ID: '',
    Student_Email: '',
    Student_Program: '',
    Offense_Type: '',
    Offense_Description: '',
    offenseDate: '',
    Penalty: '',
    Status: '',
  });

  // State to manage loading spinner during form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false);

  // Handle form field changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format JoinDate to "DD/MM/YYYY"
      const formattedDate = formData.offenseDate
        ? dayjs(formData.offenseDate).format('DD/MM/YYYY')
        : '';

      const offenseData = {
        ...formData,
        offenseDate: formattedDate, // Store only the formatted date
      };

      await addDoc(collection(db, 'OffenseList'), offenseData);

      toast.success('Offense added successfully!');
      setFormData({
        Student_Name: '',
        Student_ID: '',
        Student_Email: '',
        Student_Program: '',
        Offense_Type: '',
        Offense_Description: '',
        offenseDate: '',
        Penalty: '',
        Status: '',
      });
    } catch (error) {
      toast.error('Error adding offense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* Toast Container */}
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-neutral-300 bg-white h-[915px] w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Offense</h1>
        {/* Student Information */}
        <div className="flex flex-col w-full gap-4">
          <div className="text-base w-full flex gap-2 flex-col">
            <label htmlFor="Name">Name:</label>
            <input
              className="rounded-sm py-1 bg-slate-50 border-[1px] px-2 w-full hover:border-dotted"
              type="text"
              name="Student_Name"
              placeholder="Name"
              value={formData.Student_Name}
              onChange={handleChange}
              required
            />
          </div>
          {/* Student ID */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="ID">Student ID:</label>
            <input
              className="rounded-sm py-1 px-2 w-full bg-slate-50 hover:border-dotted border-[1px]"
              type="text"
              name="Student_ID"
              value={formData.Student_ID}
              onChange={handleChange}
              placeholder="Student ID"
              required
            />
          </div>
          {/* Email Input */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Email">Email:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="email"
              name="Student_Email"
              placeholder="Email"
              value={formData.Student_Email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Program Input */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Program">Program:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="Student_Program"
              value={formData.Student_Program}
              onChange={handleChange}
              placeholder="Program"
              required
            />
          </div>
        </div>
        {/* Offense Details */}
        <div className="flex flex-col gap-4 w-full">
          <div className="text-base flex gap-2 w-full flex-col">
            <label className="Offense Type">Offense Type:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              placeholder="Offense Type"
              name="Offense_Type"
              value={formData.Offense_Type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Offense Description">Offense Description:</label>
            <textarea
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full h-20 py-1 hover:border-dotted"
              value={formData.Offense_Description}
              onChange={handleChange}
              name="Offense_Description"
              placeholder="Offense Description .."
              required
            />
          </div>
          {/* Offense Date Picker */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label htmlFor="Offense Date">Offense Date:</label>
            <DatePicker
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted hover:border-zinc-200"
              value={formData.offenseDate ? dayjs(formData.offenseDate) : null}
              onChange={(_date, dateString) =>
                setFormData({
                  ...formData,
                  offenseDate: Array.isArray(dateString)
                    ? dateString[0]
                    : dateString,
                })
              }
              required
            />
          </div>
        </div>
        {/* Penalty & Status */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label htmlFor="Penalty">Penalty:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            placeholder="Penalty"
            name="Penalty"
            value={formData.Penalty}
            onChange={handleChange}
            required
          />
        </div>
        <div className="text-base flex w-full gap-4 flex-col">
          <label htmlFor="Status">Status:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            placeholder="Status"
            value={formData.Status}
            onChange={handleChange}
            name="Status"
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
            {isSubmitting ? 'Please wait...' : 'Add Offense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOffense;
