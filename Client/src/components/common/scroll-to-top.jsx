import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Ensure the scroll happens after the route has fully transitioned
    const timeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant", // "smooth" can sometimes feel laggy during page transitions
      });
      
      // Fallback for some browsers
      if (typeof document !== 'undefined') {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }
    }, 10);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
