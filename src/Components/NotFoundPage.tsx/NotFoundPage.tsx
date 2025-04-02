import notFound from '../../assets/404img.jpg';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }} // Start above screen and invisible
      animate={{ y: 0, opacity: 1 }} // Slide down to normal position
      transition={{ duration: 0.6, ease: 'easeOut' }} // Smooth transition
      className="flex flex-col items-center pb-10 pt-10 max-md:pt-20 max-sm:pt-14 h-screen overflow-hidden"
    >
      <img
        src={notFound}
        className="w-[335px] h-[335px] max-md:w-72 max-md:h-72 max-sm:w-64 max-sm:h-64"
        alt="404 Not Found Icon"
      />
      <h1 className="max-sm:text-[22px] max-md:text-[28px] text-[34px]  w-5/7 text-center font-bold">
        OOPS! PAGE CANNOT BE FOUND
      </h1>
      <p className="text-center sm:text-md lg:text-lg xl:text-xl  w-4/5 text-wrap mt-4">
        Sorry but it seems the page you are looking for does not exist, have
        been removed, name changed or is unavailable
      </p>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 border-2 transition-colors duration-300 hover:bg-blue-700 font-semibold text-white py-2 px-6 rounded-md mt-4"
      >
        <p>Go Back</p>
      </button>
    </motion.div>
  );
}

export default NotFoundPage;
