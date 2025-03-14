import { z } from 'zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Spinner } from '@radix-ui/themes';
import { useEffect } from 'react';
import atuLogo from '/ATU-LOGO.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import fileIcon from '../../assets/document.png';

const schema = z.object({
  name: z
    .string()
    .min(5, 'Must be at least 5 characters!')
    .max(20, 'Name is too long!') // name must be a string
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces!'),
  studentID: z.string(),
  email: z.string().email(), // Must be a valid email
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long!') // Minimum length of 8
    .regex(/[A-Z]/, 'At least one uppercase letter!')
    .regex(/[a-z]/, 'At least one lowercase letter!')
    .regex(/\d/, 'At least one number!')
    .regex(/[@$!%*?&]/, 'At least one special character (@$!%*?&)!'),
  phoneNumber: z
    .string()
    .min(10, 'Invalid phone number!')
    .max(10, 'Invalid phone number!'),
  gender: z.enum(['Male', 'Female']),
  programme: z.string().min(2, 'invalid programme'),
});

type RegistrationFormData = z.infer<typeof schema>;

const RegistrationSchemaResolver = zodResolver(schema);

const Registration = () => {
  const [gender, setGender] = useState<String>('');
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [successMessage, setSuccessMessage] = useState<String | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      gender: 'Male',
    }, // Default value
    resolver: RegistrationSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  // ✅ Mutation for Posting Sign-Up Data
  const registrationMutation = useMutation({
    mutationFn: async (studentData: RegistrationFormData) => {
      const response = await axios.post(
        'http://localhost/Backend/registration.php',
        studentData
      );
      return response.data;
    },
    onError: () => {
      setErrorMessage('Error Registering, Try again.');
      setSuccessMessage(null);
    },
    onSuccess: () => {
      reset(); // Reset form after successful registration
      setSuccessMessage('Registration Successful! Proceed to login.');
      setErrorMessage(null);
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Submit form data to the server
    registrationMutation.mutate(data);
    console.log(data);
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
    <>
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
          className="bg-white border-2 gap-7 max-2xl:w-7/12  max-xl:w-8/12 max-lg:w-10/12 w-2/5 shadow-sm border-neutral-200 rounded-lg p-8 h-auto flex flex-col justify-center"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-start">
              Registration Form
            </h2>
            <img src={fileIcon} className="w-8 h-8" alt="A Form Icon" />
          </div>
          <div className="flex max-sm:flex-col max-sm:gap-3 gap-10 justify-between">
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Name</label>
                <input
                  {...register('name')}
                  id="name"
                  className="border-2 bg-slate-50 hover:border-dotted p-2 border-gray-300 rounded-md"
                  type="text"
                  name="name"
                  autoComplete="name auto"
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="studentID">Student ID</label>
                <input
                  {...register('studentID')}
                  id="studentID"
                  name="studentID"
                  className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                  type="text"
                  placeholder="ID"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email :</label>
                <input
                  {...register('email')}
                  id="email"
                  className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                  type="email"
                  autoComplete="email auto"
                  name="email"
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  {...register('password')}
                  id="password"
                  className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-4 ">
                <span>Gender</span>
                <div className="flex gap-10">
                  <div className="inline-flex items-center">
                    <input
                      {...register('gender')}
                      required
                      id="Male"
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={gender === 'Male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio cursor-pointer text-blue-500"
                    />
                    <label htmlFor="Male" className="ml-2">
                      Male
                    </label>
                  </div>
                  <div className="inline-flex items-center">
                    <input
                      {...register('gender')}
                      required
                      id="Female"
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={gender === 'Female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio cursor-pointer text-pink-500"
                    />
                    <label htmlFor="Female" className="ml-2">
                      Female
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  {...register('phoneNumber')}
                  id="phoneNumber"
                  className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="programme">Programme</label>
            <input
              {...register('programme')}
              type="text"
              className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
              id="programme"
              name="programme"
              placeholder="Programme"
            />
          </div>
          <div className="flex gap-2 justify-start">
            <button
              type="submit"
              className="border-2 items-center flex gap-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? 'Please wait..' : 'Register'}
            </button>
          </div>

          <div className="flex gap-2 cursor-pointer justify-start">
            <Link to={'/ForgotPassword'}>
              <p className="text-blue-500 hover:text-blue-700">
                forgot password ?
              </p>
            </Link>
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
        <div className="flex max-sm:flex-col max-sm:items-center max-md:8/12 max-lg:w-10/12 w-2/5 justify-around ">
          <div className="mb-3">
            <p>
              A member ?
              <Link to={'/StudentLogin'}>
                <span className="text-blue-500 ml-2 hover:text-blue-700 cursor-pointer">
                  Login here
                </span>
              </Link>
            </p>
          </div>
          <p className="">or</p>
          <div className="mb-4 max-sm:mt-2">
            <p>
              An admin ?
              <Link to={'/AdminLogin'}>
                <span className="text-blue-500 ml-2 hover:text-blue-700 cursor-pointer">
                  Login here
                </span>
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Registration;
