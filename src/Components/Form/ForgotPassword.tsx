import forgotPasswordIcon from '../../assets/forgot-password.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import atuLogo from '/ATU-LOGO.png';
import { motion } from 'motion/react';
import axios from 'axios';
import { Spinner } from '@radix-ui/themes';
import { useMutation } from '@tanstack/react-query';

// Define the schema for form validation using Zod
const schema = z
  .object({
    ID: z.string().min(9, 'Must be 9 characters!'),
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
    path: ['confirmPassword'],
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

  // Destructure the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordSchema>({
    resolver: ResetPasswordSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  // Mutation for Posting Sign-Up Data
  const resetMutation = useMutation({
    mutationFn: async (userData: ResetPasswordSchema) => {
      const response = await axios.post(
        'http://localhost/Backend/registration.php',
        userData
      );
      return response.data;
    },
    onError: () => {
      setErrorMessage('Reset Error, Try again.');
      setSuccessMessage(null);
    },
    onSuccess: () => {
      reset(); // Reset form after successful registration
      setSuccessMessage('Reset Successful!');
      setErrorMessage(null);
    },
  });

  const onSubmit = async (userData: ResetPasswordSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Submit form data to the server
    resetMutation.mutate(userData);
    console.log(userData);
    reset();
  };

  // ✅ Automatically clear error after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    } else if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }} // Start above screen and invisible
      animate={{ y: 0, opacity: 1 }} // Slide down to normal position
      transition={{ duration: 0.6, ease: 'easeOut' }} // Smooth transition
      className="w-vh pb-10 md:lg:justify-center lg:h-vh max-2xl:pt-16 2xl:pt-16 flex flex-col gap-8 justify-center items-center"
    >
      <div className="flex max-sm:7/12 max-md:w-11/12 max-xl:w-8/12 max-2xl:w-5/7 max-lg:w-10/12 max-md:pl-3 justify-evenly gap-3 items-start ">
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
        className="bg-white border-2 gap-7 max-2xl:w-7/12E  max-xl:w-8/12 max-lg:w-10/12 w-2/5 shadow-sm border-neutral-200 rounded-lg p-8 h-auto flex flex-col justify-center"
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
              {...register('ID')}
              id="adminID"
              name="adminID"
              className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
              type="text"
              placeholder="ID"
            />
            {errors.ID && <p className="text-red-500">{errors.ID.message}</p>}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="password">New Password</label>
            <input
              {...register('newPassword')}
              id="password"
              className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
              type="password"
              name="password"
              placeholder="New Password"
            />
            {errors.newPassword && (
              <p className="text-red-500">{errors.newPassword.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Confirm New Password</label>
          <input
            {...register('confirmNewPassword')}
            id="confirmPassword"
            className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
            type="password"
            placeholder="Confirm New Password"
          />
          {errors.confirmNewPassword && (
            <p className="text-red-500">{errors.confirmNewPassword.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-start">
          <button
            type="submit"
            className="border-2 items-center flex gap-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Please wait..' : 'Reset Password'}
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
