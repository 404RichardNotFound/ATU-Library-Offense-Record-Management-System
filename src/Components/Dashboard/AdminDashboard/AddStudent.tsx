import { Spinner } from '@radix-ui/themes';
import { useEffect } from 'react';
import { z } from 'zod';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

type AddStudentFormData = z.infer<typeof schema>;

const AddStudentSchemaResolver = zodResolver(schema);

const AddStudent = () => {
  const [gender, setGender] = useState<String>('');
  const [errorMessage, setErrorMessage] = useState<String | null>(null);
  const [successMessage, setSuccessMessage] = useState<String | null>(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddStudentFormData>({
    defaultValues: {
      gender: 'Male',
    }, // Default value
    resolver: AddStudentSchemaResolver,
    mode: 'onChange', // Enable real-time validation feedback
  });

  // ✅ Mutation for Posting Sign-Up Data
  const AddStudentMutation = useMutation({
    mutationFn: async (studentData: AddStudentFormData) => {
      const response = await axios.post(
        'http://localhost/Backend/registration.php',
        studentData
      );
      return response.data;
    },
    onError: () => {
      setErrorMessage('Error Adding Student, Try again.');
      setSuccessMessage(null);
    },
    onSuccess: () => {
      reset(); // Reset form after successful registration
      setSuccessMessage('Student Added Successfully!');
      setErrorMessage(null);
    },
  });

  const onSubmit = async (data: AddStudentFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Submit form data to the server
    AddStudentMutation.mutate(data);
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
    <div className="w-full bg-zinc-100 h-full flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-md border-2 border-zinc-200 bg-white h-auto w-full max-sm:w-full p-6 flex flex-col gap-3"
      >
        <h1 className="text-center font-medium text-lg">Add Student</h1>
        <div className="flex flex-col gap-4 h-auto justify-between">
          <div className="flex flex-col w-full gap-4">
            <div className="text-base w-full flex gap-2 flex-col">
              <label>Name:</label>
              <input
                {...register('name')}
                className="rounded-sm bg-slate-50 border-2 px-2 w-full"
                type="text"
                name="name"
              />

              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="text-base flex gap-2 w-auto flex-col">
              <label>Student ID:</label>
              <input
                {...register('studentID')}
                className="rounded-sm px-2 w-full bg-slate-50 border-2"
                type="text"
                name="studentID"
              />
              {errors.studentID && (
                <p className="text-red-500">{errors.studentID.message}</p>
              )}
            </div>
            <div className="text-base flex gap-2 w-full flex-col">
              <label>Email:</label>
              <input
                {...register('email')}
                className="rounded-sm bg-slate-50 border-2 px-2 w-full"
                type="email"
                name="email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div className="text-base flex gap-2 w-full flex-col">
              <label>Password:</label>
              <input
                {...register('password')}
                className="rounded-sm bg-slate-50 border-2 px-2"
                type="password"
                name="password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-2">
              <label className="text-base">Gender:</label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-base" htmlFor="Male">
                    Male
                  </label>
                  <input
                    {...register('gender')}
                    value="Male"
                    checked={gender === 'Male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-radio mt-1 cursor-pointer"
                    type="checkbox"
                    name="Male"
                    id="Male"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-base" htmlFor="Female">
                    Female
                  </label>
                  <input
                    {...register('gender')}
                    id="Female"
                    type="checkbox"
                    name="gender"
                    value="Female"
                    checked={gender === 'Female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="form-radio  cursor-pointer mt-1"
                  />
                </div>
              </div>
            </div>
            <div className="text-base w-full flex gap-2 flex-col">
              <label>Phone Number:</label>
              <input
                {...register('phoneNumber')}
                className="rounded-sm bg-slate-50 border-2 px-2"
                type="tel"
                name="phoneNumber"
              />
              {errors.phoneNumber && (
                <p className="text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="text-base flex w-full gap-4 flex-col">
          <label>Programme:</label>
          <input
            {...register('programme')}
            className="rounded-sm bg-slate-50 border-2 px-2"
            type="text"
            name="programme"
          />
          {errors.programme && (
            <p className="text-red-500">{errors.programme.message}</p>
          )}
        </div>
        <div className="flex gap-2 justify-start">
          <button
            type="submit"
            className="border-2 items-center flex gap-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md"
          >
            {isSubmitting && <Spinner />}
            {isSubmitting ? 'Please wait..' : 'Add'}
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
    </div>
  );
};

export default AddStudent;
