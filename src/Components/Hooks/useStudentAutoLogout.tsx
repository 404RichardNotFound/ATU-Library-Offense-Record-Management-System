import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // 1 hour (in ms)

export const useStudentAutoLogout = () => {
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = () => {
    sessionStorage.clear();
    navigate('/StudentLogin');
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Check if user returns to tab
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) resetTimer();
    });

    resetTimer(); // initial timer

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      document.removeEventListener('visibilitychange', resetTimer);
    };
  }, []);
};
