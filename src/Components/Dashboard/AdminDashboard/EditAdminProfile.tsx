import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../../Firebase/firebase-config';

const EditAdminProfile = () => {
  // Get admin data from session storage
  const adminSession = sessionStorage.getItem('admin');
  const adminData = adminSession ? JSON.parse(adminSession) : null;
  const adminId = adminData?.id; // Firestore document ID

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // State for error message
  const [errorMessage, setErrorMessage] = useState<string | null>('');

  const [formData, setFormData] = useState({
    Name: adminData?.name || '',
    ID: adminData?.adminID || '',
    Email: adminData?.email || '',
    Phone_Number: adminData?.phoneNumber || '',
    Gender: adminData?.gender || '',
    Role: adminData?.role || 'Admin',
    profileImage: adminData?.profileImage || '', // existing image if any
  });

  // Helper function to resize/compress image using a canvas
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (e) => {
        if (!e.target?.result) {
          return reject('Error reading file');
        }
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300; // Adjust maximum width as needed
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Quality set to 0.6 (60%); adjust for further compression if needed
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedDataUrl);
        } else {
          reject('Could not get canvas context');
        }
      };

      img.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean | undefined>(false);

  // Handle form field changes
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection with size validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    // Change the max allowed size if needed (currently set to 500KB)
    if (file.size > 5 * 1000 * 1024) {
      setErrorMessage('Image is too large. Max allowed is 5MB.');
      setSelectedFile(null);
      return;
    }
    setErrorMessage(null);
    setSelectedFile(file);
  };

  //Update Firestore Admin Data
  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevents URL issue
    if (!adminId) {
      toast.error('Admin ID not found!');
      console.log(adminId);
      return;
    }

    setIsSubmitting(true);
    try {
      let updatedProfileImage = formData.profileImage; // use existing image URL if no new file

      if (selectedFile) {
        // Resize/compress the new image
        updatedProfileImage = await resizeImage(selectedFile);

        // Optionally, check the size after conversion:
        const imageSize = new Blob([updatedProfileImage]).size;
        if (imageSize > 900 * 1024) {
          setErrorMessage(
            'Image too large even after compression. Please choose a smaller one.'
          );
          setIsSubmitting(false);
          return;
        }
      }

      const adminRef = doc(db, 'Admin', adminId); // Get the admin document
      await updateDoc(adminRef, {
        Name: formData.Name,
        ID: formData.ID,
        Email: formData.Email,
        Phone_Number: formData.Phone_Number,
        Gender: formData.Gender,
        Role: formData.Role,
        profileImage: updatedProfileImage,
      });
      // Update session storage with new admin data
      sessionStorage.setItem(
        'admin',
        JSON.stringify({
          id: adminId,
          adminID: formData.ID,
          gender: formData.Gender,
          name: formData.Name,
          email: formData.Email,
          role: formData.Role,
          phoneNumber: formData.Phone_Number,
          profileImage: updatedProfileImage,
        })
      );
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Automatically clear error after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      {/* Toast notifications for success and error messages */}
      <Toaster />

      <form
        onSubmit={handleSubmit}
        className="rounded-md border-[1px] border-neutral-300 bg-white h-[690px] w-full max-sm:w-full p-6 flex flex-col gap-3"
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
          <div className="flex flex-col gap-2">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="bg-slate-50 border-[1px] p-2 rounded-md cursor-pointer"
            />
          </div>
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
        {/* Display error message if any */}
        {errorMessage && (
          <p className="text-red-500 absolute bg-red-100 p-2 rounded top-96 transition-all duration-300">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default EditAdminProfile;
