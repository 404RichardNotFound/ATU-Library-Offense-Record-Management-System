import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

const AddStudent = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    Student_Name: '',
    Student_ID: '',
    Student_Email: '',
    Student_Password: '',
    Student_PhoneNumber: '',
    Student_Gender: '',
    Student_Program: '',
    JoinDate: '',
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
      const formattedDate = formData.JoinDate
        ? dayjs(formData.JoinDate).format('DD/MM/YYYY')
        : '';

      const studentData = {
        ...formData,
        JoinDate: formattedDate, // Store only the formatted date
      };

      await addDoc(collection(db, 'Students'), studentData);

      toast.success('Student added successfully!');
      setFormData({
        Student_Name: '',
        Student_ID: '',
        Student_Email: '',
        Student_Password: '',
        Student_PhoneNumber: '',
        Student_Gender: '',
        Student_Program: '',
        JoinDate: '', // Reset JoinDate after submission
      });
    } catch (error) {
      toast.error('Error adding student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* Toast notifications for success and error messages */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-zinc-200 bg-white h-[750px] w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Student</h1>

        {/* Name Input */}
        <div className="text-base w-full flex gap-2 flex-col">
          <label htmlFor="Name">Name:</label>
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

        {/* Student ID Input */}
        <div className="text-base flex gap-2 w-auto flex-col">
          <label htmlFor="Student ID">Student ID:</label>
          <input
            className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
            type="text"
            name="Student_ID"
            placeholder="Student ID"
            value={formData.Student_ID}
            onChange={handleChange}
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

        {/* Password Input */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label htmlFor="Password">Password:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="password"
            placeholder="Password"
            name="Student_Password"
            value={formData.Student_Password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender Selection */}
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="Gender" className="text-base">
            Gender:
          </label>
          <div className="flex text-base gap-4">
            <label htmlFor="Male" className="flex items-center gap-2">
              <input
                className="cursor-pointer"
                type="checkbox"
                name="Student_Gender"
                value="Male"
                checked={formData.Student_Gender === 'Male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label htmlFor="Female" className="flex items-center gap-2">
              <input
                type="checkbox"
                className="cursor-pointer"
                name="Student_Gender"
                value="Female"
                checked={formData.Student_Gender === 'Female'}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="text-base w-full flex gap-2 flex-col">
          <label htmlFor="Phone Number">Phone Number:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="tel"
            placeholder="Phone Number"
            name="Student_PhoneNumber"
            value={formData.Student_PhoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        {/* Joined Date Input */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label htmlFor="Joined Date">Join Date:</label>
          <DatePicker
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted hover:border-zinc-200"
            value={formData.JoinDate ? dayjs(formData.JoinDate) : null}
            onChange={(_date, dateString) =>
              setFormData({
                ...formData,
                JoinDate: Array.isArray(dateString)
                  ? dateString[0]
                  : dateString,
              })
            }
            required
          />
        </div>
        {/* Programme Input */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label htmlFor="Program">Program:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            name="Student_Program"
            placeholder="Program"
            value={formData.Student_Program}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button with Loading Spinner */}
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
            {isSubmitting ? 'Please wait...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
