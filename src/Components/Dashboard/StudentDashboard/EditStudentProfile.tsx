import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';

const EditStudentProfile = () => {
  // Get student data from session storage
  const id = sessionStorage.getItem('activeStudentId');
  const stored = sessionStorage.getItem(`student_${id}`);
  const studentData = stored ? JSON.parse(stored) : null;
  const studentId = id; // Firestore document ID

  const [formData, setFormData] = useState({
    Name: studentData?.Name || '',
    ID: studentData?.ID || '',
    Email: studentData?.Email || '',
    Phone_Number: studentData?.PhoneNumber || '',
    Gender: studentData?.Gender || '',
    Role: studentData?.Role || 'Student',
    JoinDate: studentData?.JoinDate || '',
    Program: studentData?.Program || '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false);

  // Handle form field changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Update Firestore student Data
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevents URL issue
    if (!studentId) {
      toast.error('Student ID not found!');
      console.log(studentId);
      return;
    }

    setIsSubmitting(true);
    try {
      const studentRef = doc(db, 'Students', studentId); // Get the student document
      await updateDoc(studentRef, {
        Student_Name: formData.Name,
        Student_ID: formData.ID,
        Student_Email: formData.Email,
        Student_PhoneNumber: formData.Phone_Number,
        Student_Gender: formData.Gender,
        JoinDate: formData.JoinDate,
        Student_Program: formData.Program,
      });
      // Update session storage with new student data
      const studentKey = `student_${studentId}`;
      sessionStorage.setItem(
        studentKey,
        JSON.stringify({
          id: studentId,
          ID: formData.ID,
          Gender: formData.Gender,
          Program: formData.Program,
          Name: formData.Name,
          Email: formData.Email,
          Role: 'Student',
          JoinDate: formData.JoinDate,
          PhoneNumber: formData.Phone_Number,
        })
      );

      sessionStorage.setItem('activeStudentId', studentId);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Try again.');
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
        <h1 className="text-center font-medium text-lg">Edit Profile</h1>

        {/* Student Information */}
        <div className="flex flex-col w-full gap-4">
          <div className="text-base w-full flex gap-2 flex-col">
            <label>Name:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              name="Name"
              placeholder="Name"
              value={formData.Name}
              onChange={handleChange}
              required
            />
          </div>
          {/* ID Field */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label>ID:</label>
            <input
              className="rounded-sm px-2 w-full bg-slate-50 border-[1px] py-1 hover:border-dotted"
              type="text"
              placeholder="ID"
              name="ID"
              value={formData.ID}
              onChange={handleChange}
              required
            />
          </div>
          {/* Email Field */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label>Email:</label>
            <input
              className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="email"
              placeholder="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
            />
          </div>
          {/* Role Field */}
          <div className="text-base flex gap-2 w-full flex-col">
            <label>Role:</label>
            <input
              className="rounded-sm bg-slate-100 border-[1px] px-2 w-full py-1 hover:border-dotted"
              type="text"
              placeholder="Admin"
              name="Role"
              value={formData.Role}
              onChange={handleChange}
              disabled
              required
            />
          </div>
        </div>

        {/* Gender Selection */}
        <div className="w-full flex flex-col gap-2">
          <label className="text-base">Gender:</label>
          <div className="flex gap-4 text-base">
            <label htmlFor="Male" className="flex items-center gap-2">
              <input
                className="cursor-pointer"
                checked={formData.Gender === 'Male'}
                onChange={handleChange}
                type="checkbox"
                name="Gender"
                value="Male"
              />
              Male
            </label>
            <label htmlFor="Male" className="flex items-center gap-2">
              <input
                className="cursor-pointer"
                checked={formData.Gender === 'Female'}
                onChange={handleChange}
                type="checkbox"
                name="Gender"
                value="Female"
              />
              Female
            </label>
          </div>
        </div>
        {/* Phone Number Field */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label htmlFor="Phone Number">Phone Number:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
            value={formData.Phone_Number}
            onChange={handleChange}
            type="tel"
            placeholder="Phone Number"
            name="Phone_Number"
            required
          />
        </div>
        {/* Join Date Field */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label htmlFor="Join Data">Join Data:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
            value={formData.JoinDate}
            onChange={handleChange}
            type="text"
            placeholder="Phone Number"
            name="JoinDate"
            disabled
            required
          />
        </div>
        {/* Program Field */}
        <div className="text-base flex gap-2 w-full flex-col">
          <label htmlFor="Program">Program:</label>
          <input
            className="rounded-sm bg-slate-50 border-[1px] px-2 w-full py-1 hover:border-dotted"
            value={formData.Program}
            onChange={handleChange}
            type="text"
            placeholder="Program"
            name="Program"
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
            {isSubmitting ? 'Updating...' : 'Edit Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudentProfile;
