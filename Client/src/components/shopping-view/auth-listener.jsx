
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrCreateSessionId, clearSessionId } from '@/components/utils/session';
import { mergeCarts, fetchCartItems } from '@/store/shop/cart-slice';

const AuthListener = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleAuthChange = async () => {
      if (user?.id) {
        try {
          const sessionId = getOrCreateSessionId();
          
          // Only merge if we have a session ID
          if (sessionId) {
            console.log('Attempting to merge carts with:', { userId: user.id, sessionId });
            const result = await dispatch(mergeCarts({
              userId: user.id,
              sessionId
            })).unwrap();
            
            if (result.success) {
              clearSessionId();
              console.log('Cart merge successful, session cleared.');
            } else {
              console.warn('Cart merge reported success: false, keeping session ID for now.');
            }
          }
          
          // Always fetch fresh cart after login/merge
          await dispatch(fetchCartItems({ userId: user.id }));
          
        } catch (error) {
          console.error('Error during cart merge:', error);
          // Fallback: try to fetch user cart anyway
          await dispatch(fetchCartItems({ userId: user.id }));
        }
      } else if (user === null) {
        // User logged out - clear session
        clearSessionId();
      }
    };

    handleAuthChange();
  }, [dispatch, user]);

  return null;
};

export default AuthListener;