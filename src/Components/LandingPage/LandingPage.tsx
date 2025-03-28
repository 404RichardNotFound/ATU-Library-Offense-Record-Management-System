import atuLogo from '/ATU-LOGO.png';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import studentIcon from '../../assets/study.png';
import adminIcon from '../../assets/user-setting.png';
import { motion } from 'framer-motion';
import { useState } from 'react';

const LandingPage = () => {
  const [showQuestion, setShowQuestion] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="flex h-screen justify-center items-center"
    >
      <div className="-mt-20 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3">
          <img src={atuLogo} className="w-32 h-32" alt="" />

          {/* Typewriter for Welcome Message */}
          <h1 className="text-2xl font-bold">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString('Welcome to ATU LORMS ..')
                  .pauseFor(1000) // Short delay before showing next text
                  .callFunction(() => setShowQuestion(true)) // Show next text
                  .start();
              }}
              options={{
                autoStart: true,
                cursor: '|',
                delay: 50,
              }}
            />
          </h1>

          {/* Typewriter for "Which are you?" Appears after first text completes */}
          {showQuestion && (
            <p className="text-xl font-medium">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString('Which are you?')
                    .pauseFor(9999999) // Ensures text stays after typing
                    .start();
                }}
                options={{
                  autoStart: true,
                  cursor: '|',
                  delay: 50,
                }}
              />
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <Link className="cursor-pointer" to="/StudentLogin">
            <button className="font-medium flex py-1 items-center border-slate-200 px-3 hover:bg-blue-600 text-sm rounded-md text-white bg-blue-500 border-2">
              <img src={studentIcon} className="w-6 h-6" alt="" />
              Student
            </button>
          </Link>
          <Link className="cursor-pointer" to="/AdminLogin">
            <button className="font-medium py-1 flex items-center border-slate-200 px-3 hover:bg-blue-600 text-sm rounded-md text-white bg-blue-500 border-2">
              <img src={adminIcon} className="w-6 h-6" alt="" />
              Admin
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
