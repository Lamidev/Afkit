
export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('guestSessionId');
  if (!sessionId) {
    sessionId = 'guest_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('guestSessionId', sessionId);
  }
  return sessionId;
};

export const clearSessionId = () => {
  localStorage.removeItem('guestSessionId');
};

export const getSessionId = () => {
  return localStorage.getItem('guestSessionId');
};