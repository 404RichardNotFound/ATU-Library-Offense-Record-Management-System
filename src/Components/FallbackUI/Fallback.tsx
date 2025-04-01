import { Spinner } from '@radix-ui/themes';
import { useState, useEffect } from 'react';

const Fallback = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 500); // Show spinner after 0.5s delay
    return () => clearTimeout(timer);
  }, []);

  return show ? (
    <div className="h-screen w-full items-center flex justify-center">
      <Spinner className="-mt-14" />
    </div>
  ) : null;
};

export default Fallback;
