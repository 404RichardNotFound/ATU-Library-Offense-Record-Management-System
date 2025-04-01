import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const AddStudent = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    name: '',
    studentID: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: 'Male',
    program: '',
  });

  // State to manage loading spinner during form submission
  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false);

  // Handle form field changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevents page reload on form submission
    setIsSubmitting(true); // Show spinner and disable button

    try {
      // Send form data to the backend API
      await axios.post('http://localhost/Backend/registration.php', formData);

      // Show success message
      toast.success('Student added successfully!', {
        duration: 3000,
        position: 'top-right',
      });

      // Reset form fields after successful submission
      setFormData({
        name: '',
        studentID: '',
        email: '',
        password: '',
        phoneNumber: '',
        gender: 'Male',
        program: '',
      });
    } catch (error) {
      // Show error message if submission fails
      toast.error('Error adding student. Please try again.');
    } finally {
      setIsSubmitting(false); // Hide spinner and enable button
    }
  };

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* Toast notifications for success and error messages */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-zinc-200 bg-white h-[675px] w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Student</h1>

        {/* Name Input */}
        <div className="text-base w-full flex gap-2 flex-col">
          <label>Name:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Student ID Input */}
        <div className="text-base flex gap-2 w-auto flex-col">
          <label>Student ID:</label>
          <input
            className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
            type="text"
            name="studentID"
            placeholder="Student ID"
            value={formData.studentID}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Input */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label>Email:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Input */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label>Password:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender Selection */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-base">Gender:</label>
          <div className="flex text-base gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
              />
              Male
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="text-base w-full flex gap-2 flex-col">
          <label>Phone Number:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="tel"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Programme Input */}
        <div className="text-base flex w-full gap-4 flex-col">
          <label>Program:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 py-1 hover:border-dotted"
            type="text"
            name="program"
            placeholder="Program"
            value={formData.program}
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
