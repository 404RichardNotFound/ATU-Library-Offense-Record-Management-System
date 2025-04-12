import authenticationIcon from '../../assets/authentication.png';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { z } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../Firebase/firebase-config';
import atuLogo from '/ATU-LOGO.png';
import { motion } from 'motion/react';
import { Spinner } from '@radix-ui/themes';

// Define the schema for form validation using Zod
const schema = z.object({
  Student_ID: z.string().min(9, 'Must be 9 characters!'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long!')
    .regex(/[A-Z]/, 'At least one uppercase letter!')
    .regex(/[a-z]/, 'At least one lowercase letter!')
    .regex(/\d/, 'At least one number!')
    .regex(/[@$!%*?&]/, 'At least one special character (@$!%*?&)!'),
});

// Infer the type of the schema
type StudentLoginSchema = z.infer<typeof schema>;

// Create a resolver for the schema
const StudentLoginSchemaResolver = zodResolver(schema);

function StudentLogin() {
  // State for error and success messages
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [successMessage, setSuccessMessage] = useState<string | null>('');
  const navigate = useNavigate();

  // Destructure the useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StudentLoginSchema>({
    resolver: StudentLoginSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  const onSubmit = async (studentLogins: StudentLoginSchema) => {
    setErrorMessage('');
    setSuccessMessage('');
    const data: StudentLoginSchema = studentLogins;

    console.log(data);

    try {
      // Query Firestore to find the student with the entered Student_ID
      const q: any = query(
        collection(db, 'Students'),
        where('Student_ID', '==', data.Student_ID)
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setErrorMessage('Student ID not found');
        return;
      }

      const studentDoc = querySnapshot.docs[0]; // Get the first matching document
      const studentData: any = studentDoc.data();

      if (studentData.Student_Password === data.password) {
        // Store student data in session storage
        const studentKey = `student_${studentDoc.id}`;
        sessionStorage.setItem(
          studentKey,
          JSON.stringify({
            id: studentDoc.id,
            ID: studentData.Student_ID,
            Gender: studentData.Student_Gender,
            Program: studentData.Student_Program,
            Name: studentData.Student_Name,
            Email: studentData.Student_Email,
            Role: 'Student',
            JoinDate: studentData.JoinDate,
            PhoneNumber: studentData.Student_PhoneNumber,
            profileImage: studentData.profileImage,
          })
        );
        sessionStorage.setItem('activeStudentId', studentDoc.id);

        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => navigate('/StudentDashboard'), 1000);
      } else {
        setErrorMessage('Incorrect password');
      }
    } catch (error) {
      setErrorMessage('Error logging in. Try again.');
      console.error('Login Error:', error);
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
    <motion.div
      initial={{ y: -50, opacity: 0 }} // Start above screen and invisible
      animate={{ y: 0, opacity: 1 }} // Slide down to normal position
      transition={{ duration: 0.6, ease: 'easeOut' }} // Smooth transition
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
        className="bg-white border-[1px] max-sm:ml-4 max-sm:w-[80%] gap-5 max-2xl:w-5/12  max-xl:w-7/12 max-md:w-9/12 w-[35%] shadow-sm border-neutral-300 rounded-lg p-8 h-auto flex flex-col justify-center"
      >
        <div className="flex gap-3">
          <h2 className="text-2xl font-semibold text-start">Students Login</h2>
          <img
            src={authenticationIcon}
            className="w-8 h-8"
            alt="User Authentication Icon"
          />
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="Student ID">Student ID</label>
            <input
              {...register('Student_ID')}
              id="Student_ID"
              name="Student_ID"
              className="border-[1px] bg-slate-50 hover:border-dotted  px-2 py-1 border-neutral-300 rounded-md"
              type="text"
              placeholder="ID"
            />
            {errors.Student_ID && (
              <p className="text-red-500">{errors.Student_ID.message}</p>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              {...register('password')}
              id="password"
              className="border-[1px] bg-slate-50 hover:border-dotted  px-2 py-1 border-neutral-300 rounded-md "
              type="password"
              name="password"
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2 justify-start">
          <button
            type="submit"
            className=" items-center flex gap-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-[5px] px-5 rounded-md"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Please wait..' : 'Login'}
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

      <div className="flex max-sm:flex-col max-sm:items-center max-xl:px-10 max-md:8/12 max-xl:w-10/12 w-2/5 justify-around ">
        <div className="mb-3">
          <p>
            Have not registered ?
            <Link to={'/Registration'}>
              <span className="text-blue-500 ml-2 hover:text-blue-700 cursor-pointer">
                Register here
              </span>
            </Link>
          </p>
        </div>
        <p className="">or</p>
        <div className="mb-4 max-sm:mt-2">
          <p>
            An admin ?
            <Link to={'/AdminLogin'}>
              <span className="text-blue-500 transition-colors duration-300 ml-2 hover:text-blue-700 cursor-pointer">
                Login here
              </span>
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default StudentLogin;
