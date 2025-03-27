import { useState } from 'react';
import userPhoto from '../../../assets/woman-photo.jpg';
import { Tag } from 'antd';
import toast, { Toaster } from 'react-hot-toast'; // Import React Hot Toast

const MyProfile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  // ✅ Handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevent page reload
    setIsSubmitting(true); // Set loading state

    setTimeout(() => {
      // 📢 Show success toast
      toast.success('Profile Updated!', {
        duration: 3000,
        position: 'top-center',
      });

      // Reset form fields
      e.target.reset();
      setIsSubmitting(false); // Reset loading state
    }, 2000); // Simulate async operation (e.g., API call)
  };

  return (
    <div className="flex flex-col max-lg:flex-col p-1 bg-zinc-100 h-full w-full gap-4">
      {/* Admin Profile */}
      <div className="flex max-sm:flex-col max-sm:items-center overflow-hidden border-2 max-lg:w-full p-3 gap-4 w-full bg-white rounded-md">
        <img
          src={userPhoto}
          className="w-24 h-24 rounded-full object-cover"
          alt=""
        />
        <div className="flex max-sm:text-center gap-1 max-md:gap-[2px] flex-col overflow-hidden">
          <p className="text-xl font-medium">Jessica Davidson</p>
          <p className="text-base">Accra Technical University</p>
          <p className="text-base">Jessicadavid789@gmail.com</p>
          <p className="text-base">0548225869</p>
          <div>
            <Tag className="w-14 mt-1 text-center" color="blue">
              Admin
            </Tag>
          </div>
        </div>
      </div>

      {/* 🔥 Toast Container */}
      <Toaster />

      {/* Edit Profile */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex h-[370px] flex-col rounded-md bg-white p-3 max-md:h-[370px] border-2"
      >
        <div className="flex flex-col py-2 w-full justify-between gap-3">
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="bg-slate-100 border-2 rounded-md py-1 px-2 w-full"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="ID">ID</label>
              <input
                type="text"
                name="ID"
                id="ID"
                className="bg-slate-100 rounded-md py-1 px-2 w-full border-2"
                placeholder="ID"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="Email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-slate-100 rounded-md py-1 px-2 w-full border-2"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="Phone">Phone number</label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="bg-slate-100 rounded-md py-1 px-2 w-full border-2"
                placeholder="Phone Number"
              />
            </div>
          </div>
        </div>

        {/* Submit Button with Loading Spinner */}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="bg-blue-500 flex items-center justify-center gap-2 cursor-pointer rounded-md p-2 text-white font-medium hover:bg-blue-600 disabled:opacity-50"
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
