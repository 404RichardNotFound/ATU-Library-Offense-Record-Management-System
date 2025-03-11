import './App.css';
import atuLogo from '/ATU-LOGO.png';
import { motion } from 'motion/react';
import Registration from './Components/Form/Registration';

function App() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-vh pb-10 md:lg:h-auto lg:h-screen max-2xl:pt-16 2xl:pt-16 flex flex-col gap-8 justify-center items-center"
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
        <Registration />
      </motion.div>
    </>
  );
}

export default App;
