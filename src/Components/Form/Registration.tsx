import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Spinner } from '@radix-ui/themes';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config'; // Update this path as needed

import atuLogo from '/ATU-LOGO.png';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import fileIcon from '../../assets/document.png';

const schema = z.object({
  Student_Name: z
    .string()
    .min(5, 'Must be at least 5 characters!')
    .max(40, 'Name is too long!') // name must be a string
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces!'),
  Student_ID: z.string(),
  Student_Email: z.string().email(), // Must be a valid email
  Student_Password: z
    .string()
    .min(8, 'Password must be at least 8 characters long!') // Minimum length of 8
    .regex(/[A-Z]/, 'At least one uppercase letter!')
    .regex(/[a-z]/, 'At least one lowercase letter!')
    .regex(/\d/, 'At least one number!')
    .regex(/[@$!%*?&]/, 'At least one special character (@$!%*?&)!'),
  Student_PhoneNumber: z
    .string()
    .min(10, 'Invalid phone number!')
    .max(10, 'Invalid phone number!'),
  Student_Gender: z.enum(['Male', 'Female']),
  Student_Program: z.string().min(2, 'invalid program'),
});

type RegistrationFormData = z.infer<typeof schema>;

const RegistrationSchemaResolver = zodResolver(schema);

const Registration = () => {
  const [gender, setGender] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: RegistrationSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  // 🔁 Outside the component, after imports

  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        if (!e.target?.result) return reject('Error reading file');
        img.src = e.target.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 300;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6); // 60% quality
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      let imageBase64 = '';

      if (selectedFile) {
        imageBase64 = await resizeImage(selectedFile);

        // Check again after resize
        const imageSize = new Blob([imageBase64]).size;
        if (imageSize > 900 * 1024) {
          setErrorMessage(
            'Image too large even after compression. Please choose a smaller one.'
          );
          return;
        }
      }

      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}/${today.getFullYear()}`;

      const studentDataWithImage = {
        ...data,
        profileImage: imageBase64,
        JoinDate: formattedDate,
      };

      await addDoc(collection(db, 'Students'), studentDataWithImage);

      setSuccessMessage('Registration Successful! Proceed to login.');
      setErrorMessage(null);
      reset();
      setSelectedFile(null);
    } catch (error) {
      console.error('Firebase registration error:', error);
      setErrorMessage('Error registering student. Please try again.');
      setSuccessMessage(null);
    }
  };

  // Automatically clear error after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);
      return () => clearTimeout(timer);
    } else if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
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
        <div className="flex max-sm:7/12 max-md:w-11/12 max-xl:w-8/12 max-2xl:w-5/7 max-lg:w-10/12 max-xl:pl-6 max-md:pl-3 justify-evenly gap-3 items-start ">
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
          className="bg-white border-[1px] gap-[15px] max-2xl:w-5/12 max-md:w-10/12 max-lg:w-8/12 max-xl:w-6/12 w-2/5 shadow-sm border-neutral-300 rounded-lg p-8 h-auto flex flex-col justify-center"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-start">
              Registration Form
            </h2>
            <img src={fileIcon} className="w-8 h-8" alt="A Form Icon" />
          </div>
          <div className="flex max-sm:flex-col max-sm:gap-3 gap-8 justify-between">
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="name">Name</label>
                <input
                  {...register('Student_Name')}
                  className="border-[1px] bg-slate-50 hover:border-dotted px-2 py-1 border-neutral-300 rounded-md"
                  type="text"
                  name="Student_Name"
                  placeholder="Name"
                />
                {errors.Student_Name && (
                  <p className="text-red-500">{errors.Student_Name.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="studentID">Student ID</label>
                <input
                  {...register('Student_ID')}
                  name="Student_ID"
                  className="border-[1px] bg-slate-50 hover:border-dotted rounded-md  px-2 py-1 border-neutral-300"
                  type="text"
                  placeholder="ID"
                />
                {errors.Student_ID && (
                  <p className="text-red-500">{errors.Student_ID.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email :</label>
                <input
                  {...register('Student_Email')}
                  className="border-[1px] bg-slate-50 hover:border-dotted  px-2 py-1 border-neutral-300 rounded-md "
                  type="email"
                  autoComplete="email auto"
                  name="Student_Email"
                  placeholder="Email"
                />
                {errors.Student_Email && (
                  <p className="text-red-500">{errors.Student_Email.message}</p>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input
                  {...register('Student_Password')}
                  className="border-[1px] bg-slate-50 hover:border-dotted  px-2 py-1 border-neutral-300 rounded-md "
                  type="password"
                  name="Student_Password"
                  placeholder="Password"
                />
                {errors.Student_Password && (
                  <p className="text-red-500">
                    {errors.Student_Password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3 mt-[2px] ">
                <span>Gender</span>
                <div className="flex gap-10">
                  <div className="inline-flex items-center">
                    <input
                      {...register('Student_Gender')}
                      id="Male"
                      type="radio"
                      name="Student_Gender"
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
                      {...register('Student_Gender')}
                      id="Female"
                      type="radio"
                      name="Student_Gender"
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
              <div className="flex flex-col gap-2 mt-[4px]">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  {...register('Student_PhoneNumber')}
                  className="border-[1px] bg-slate-50 hover:border-dotted  px-2 py-1 border-neutral-300 rounded-md "
                  type="tel"
                  name="Student_PhoneNumber"
                  placeholder="Phone Number"
                />
                {errors.Student_PhoneNumber && (
                  <p className="text-red-500">
                    {errors.Student_PhoneNumber.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return setSelectedFile(null);

                if (file.size > 5 * 1000 * 1024) {
                  setErrorMessage('Image is too large. Max allowed is 500KB.');
                  setSelectedFile(null);
                  return;
                }

                setErrorMessage(null); // Clear any previous error
                setSelectedFile(file);
              }}
              className="bg-slate-50 text-[14px] border-[1px] px-2 py-1 border-neutral-300 rounded-md cursor-pointer"
            />
          </div>
          <div className="w-full flex flex-col gap-2">
            <label htmlFor="program">Program</label>
            <input
              {...register('Student_Program')}
              type="text"
              className="border-[1px] bg-slate-50 hover:border-dotted  px-2 py-1 border-neutral-300 rounded-md "
              id="program"
              name="Student_Program"
              placeholder="Program"
            />
            {errors.Student_Program && (
              <p className="text-red-500">{errors.Student_Program.message}</p>
            )}
          </div>
          <div className="flex gap-2 justify-start">
            <button
              type="submit"
              className="border-2 items-center flex gap-4 bg-blue-500 hover:bg-blue-700 mt-1 text-white font-bold py-[5px] px-6 rounded-md"
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
                <span className="text-blue-500 ml-2 transition-colors duration-300 hover:text-blue-700 cursor-pointer">
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
