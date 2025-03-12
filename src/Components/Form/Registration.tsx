import { z } from 'zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Spinner } from '@radix-ui/themes';
import { useEffect } from 'react';
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
  programme: z.enum(['Computer Science']),
});

type RegistrationFormData = z.infer<typeof schema>;

const RegistrationSchemaResolver = zodResolver(schema);

const Registration = () => {
  const [programme, setProgramme] = useState('');
  const [gender, setGender] = useState<String>('Male');
  const [errorMessage, setErrorMessage] = useState<String | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    defaultValues: {
      gender: 'Female',
      programme: 'Computer Science',
    }, // Default value
    resolver: RegistrationSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  // ✅ Mutation for Posting Sign-Up Data
  const registrationMutation = useMutation({
    mutationFn: async (studentData: RegistrationFormData) => {
      const response = await axios.post(
        'http://localhost/backend/registration.php',
        studentData,
        { withCredentials: true }
      );
      return response.data;
    },
    onError: () => {
      setErrorMessage('Error Registering, Try again.');
    },
    onSuccess: () => {
      reset(); // Reset form after successful registration
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
    }
  }, [errorMessage]);

  return (
    <>
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
              <label>Name :</label>
              <input
                {...register('name')}
                className="border-2 bg-slate-50 hover:border-dotted p-2 border-gray-300 rounded-md"
                type="text"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label>Student ID :</label>
              <input
                {...register('studentID')}
                className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                type="text"
                placeholder="ID"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Email :</label>
              <input
                {...register('email')}
                className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label>Password :</label>
              <input
                {...register('password')}
                className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-4 ">
              <label>Gender :</label>
              <div className="flex gap-10">
                <div className="inline-flex items-center">
                  <input
                    {...register('gender')}
                    required
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-radio text-blue-500"
                  />
                  <span className="ml-2">Male</span>
                </div>
                <div className="inline-flex items-center">
                  <input
                    {...register('gender')}
                    required
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-radio text-pink-500"
                  />
                  <span className="ml-2">Female</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-3">
              <label>Phone Number :</label>
              <input
                {...register('phoneNumber')}
                className="border-2 bg-slate-50 hover:border-dotted p-2 rounded-md "
                type="tel"
                placeholder="Phone"
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="course">Programme</label>
          <select
            {...register('programme')}
            id="course"
            name="course"
            className="border-2 cursor-pointer w-full bg-slate-50 hover:border-dotted p-2 rounded-md"
            value={programme}
            onChange={(e) => setProgramme(e.target.value)}
          >
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Accounting</option>
            <option value="Physics">Fashion</option>
            <option value="Chemistry">Electrical Engineering</option>
          </select>
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
          <p className="text-blue-500 hover:text-blue-700">forgot password ?</p>
        </div>
        {/* Show Success Message */}
        {registrationMutation.isSuccess && (
          <p
            className={`text-green-500 bg-green-100 p-2 rounded mt-2 transition-all duration-300 ${
              registrationMutation.isSuccess
                ? 'opacity-100 h-auto'
                : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
            Registration successful!
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
            <span className="text-blue-500 ml-2 hover:text-blue-700 cursor-pointer">
              Login here
            </span>
          </p>
        </div>
        <p className="">or</p>
        <div className="mb-4 max-sm:mt-2">
          <p>
            An admin ?
            <span className="text-blue-500 ml-2 hover:text-blue-700 cursor-pointer">
              Login here
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Registration;
