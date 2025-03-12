import notFound from '../../assets/not-found.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }} // Start above screen and invisible
      animate={{ y: 0, opacity: 1 }} // Slide down to normal position
      transition={{ duration: 0.6, ease: 'easeOut' }} // Smooth transition
      className="flex flex-col items-center pb-24 pt-28 h-screen"
    >
      <img
        src={notFound}
        className="w-[335px] h-[335px] max-md:w-72 max-md:h-72 max-sm:w-64 max-sm:h-64"
        alt="404 Not Found Icon"
      />
      <h1 className="max-sm:text-2xl max-md:text-3xl text-4xl  w-5/7 text-center font-bold">
        OOPS! PAGE CANNOT BE FOUND
      </h1>
      <p className="text-center sm:text-md lg:text-lg xl:text-xl  w-4/5 text-wrap mt-4">
        Sorry but it seems the page you are looking for does not exist, have
        been removed, name changed or is unavailable
      </p>
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-500 hover:bg-blue-700 font-semibold text-white py-2 px-6 rounded mt-4"
      >
        <p>Go Back</p>
      </button>
    </motion.div>
  );
}

export default NotFoundPage;
