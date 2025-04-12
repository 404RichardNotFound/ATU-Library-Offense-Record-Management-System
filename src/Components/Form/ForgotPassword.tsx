import forgotPasswordIcon from '../../assets/forgot-password.png';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../Firebase/firebase-config'; // Import Firebase config
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'; // Firebase Firestore methods

import { zodResolver } from '@hookform/resolvers/zod';
import atuLogo from '/ATU-LOGO.png';
import { motion } from 'motion/react';

// Define the schema for form validation using Zod
const schema = z
  .object({
    userID: z.string().min(9, 'Must be 9 characters!'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long!')
      .regex(/[A-Z]/, 'At least one uppercase letter!')
      .regex(/[a-z]/, 'At least one lowercase letter!')
      .regex(/\d/, 'At least one number!')
      .regex(/[@$!%*?&]/, 'At least one special character (@$!%*?&)!'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match!',
    path: ['confirmNewPassword'],
  });

// Infer the type of the schema
type ResetPasswordSchema = z.infer<typeof schema>;

// Create a resolver for the schema
const ResetPasswordSchemaResolver = zodResolver(schema);

function ForgotPassword() {
  // State for error and success messages
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [successMessage, setSuccessMessage] = useState<string | null>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: ResetPasswordSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  const resetPassword = async (userID: string, confirmNewPassword: string) => {
    try {
      // First, check if the user exists in the Admin collection
      const adminRef = collection(db, 'Admin');
      const adminQuery = query(adminRef, where('ID', '==', userID)); // Use 'query' with 'where'
      const adminSnapshot = await getDocs(adminQuery);

      // If the user exists in the Admin collection
      if (!adminSnapshot.empty) {
        const adminDoc = adminSnapshot.docs[0];
        const adminDocRef = doc(db, 'Admin', adminDoc.id); // Get the document reference using its ID
        await updateDoc(adminDocRef, {
          Password: confirmNewPassword, // Update the password field
        });
        console.log('Password reset for Admin: ', adminDoc.id); // Clear session storage and navigate to Admin login page
        sessionStorage.clear();

        setSuccessMessage('Reset successful! Redirecting to Login Page ...');
        reset();
        setTimeout(() => navigate('/AdminLogin'), 1000);
        return;
      }

      // If the user doesn't exist in Admin, check the Students collection
      const studentRef = collection(db, 'Students');
      const studentQuery = query(studentRef, where('Student_ID', '==', userID)); // Use 'query' with 'where'
      const studentSnapshot = await getDocs(studentQuery);

      // If the user exists in the Students collection
      if (!studentSnapshot.empty) {
        const studentDoc = studentSnapshot.docs[0]; // Get the first matching document
        const studentDocRef = doc(db, 'Students', studentDoc.id); // Get the document reference using its ID
        await updateDoc(studentDocRef, {
          Student_Password: confirmNewPassword, // Update the password field
        });
        console.log('Password reset for Student: ', studentDoc.id);
        // Clear session storage and navigate to Student login page
        sessionStorage.clear();
        setSuccessMessage(
          'Password reset successful! Redirecting to Student login...'
        );
        reset();
        setTimeout(() => navigate('/student-login'), 1000);
        return;
      }

      // If user not found
      setErrorMessage('User not found in Admin or Students');
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrorMessage('Error resetting password, please try again later.');
    }
  };

  const onSubmit = async (data: ResetPasswordSchema) => {
    const { userID, confirmNewPassword } = data;

    // Call the resetPassword function
    await resetPassword(userID, confirmNewPassword);

    // The success and error messages are now set inside resetPassword itself
  };

  useEffect(() => {
    // Clear messages after 5 seconds
    const timer = setTimeout(() => {
      setErrorMessage(null);
      setSuccessMessage(null);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [errorMessage, successMessage]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-vh pb-10 md:lg:justify-center lg:h-vh max-2xl:pt-16 2xl:pt-16 flex flex-col gap-8 justify-center items-center"
    >
      <div className="flex max-sm:7/12 max-md:w-11/12 max-xl:w-8/12 max-2xl:w-5/7 max-lg:w-10/12 max-md:pl-8 max-xl:pl-4 max-sm:pl-5 justify-evenly gap-3 items-start ">
        <img src={atuLogo} alt="ATU's Logo" className="max-w-20 max-h-20" />
        <div className="flex flex-col">
          <h1 className="text-2xl text-wrap font-bold">
            ATU Library Offense Record Management System (LORMS)
          </h1>
          <p className="max-sm:text-sm">Powered by ATU management</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='bg-white border-[1px] max-sm:w-[80%] gap-5 max-2xl:w-5/12  max-xl:w-7/12 max-md:w-9/12 w-[35%] shadow-sm border-neutral-300 rounded-lg p-8 h-auto flex flex-col justify-center"
      '
      >
        <div className="flex gap-3">
          <h2 className="text-2xl font-semibold text-start">Forgot Password</h2>
          <img
            src={forgotPasswordIcon}
            className="w-8 h-8"
            alt="Forgot Password Icon"
          />
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="ID">Enter ID</label>
            <input
              {...register('userID')}
              id="userID"
              name="userID"
              className="border-[1px] border-neutral-300 bg-slate-50 hover:border-dotted px-2 py-1 rounded-md "
              type="text"
              placeholder="ID"
            />
            {errors.userID && (
              <p className="text-red-500">{errors.userID.message}</p>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="newPassword">New Password</label>
            <input
              {...register('newPassword')}
              id="newPassword"
              className="border-[1px] border-neutral-300 bg-slate-50 hover:border-dotted px-2 py-1 rounded-md "
              type="password"
              name="newPassword"
              placeholder="New Password"
            />
            {errors.newPassword && (
              <p className="text-red-500">{errors.newPassword.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="confirmNewPassword">Confirm New Password</label>
          <input
            {...register('confirmNewPassword')}
            id="confirmPassword"
            className="border-[1px] border-neutral-300 bg-slate-50 hover:border-dotted px-2 py-1 rounded-md "
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500">{errors.confirmNewPassword.message}</p>
          )}
        </div>
        {/* Submit Button with Loading Spinner */}
        <div className="flex gap-2 mt-1 justify-start">
          <button
            type="submit"
            className=" transition-colors duration-300 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-[6px] px-5 rounded-md"
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
        {/* Show Success Message */}
        {successMessage && (
          <p
            className={`text-green-500 bg-green-100 p-2 rounded mt-2 transition-all duration-300 ${
              successMessage
                ? 'opacity-100 h-auto'
                : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
            {successMessage}
          </p>
        )}

        {/* Show Error Message */}
        {errorMessage && (
          <p
            className={`text-red-500 bg-red-100 p-2 rounded mt-2 transition-all duration-300 ${
              errorMessage
                ? 'opacity-100 h-auto'
                : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
            {errorMessage}
          </p>
        )}
      </form>

      <div className="flex max-sm:items-center max-xl:px-10 max-md:8/12 max-xl:w-10/12 w-2/5 justify-around ">
        <div className="mb-3">
          <p
            onClick={() => navigate(-1)}
            className="text-blue-500 ml-2 hover:text-blue-700 cursor-pointer transition-colors duration-300"
          >
            Go Back
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default ForgotPassword;
