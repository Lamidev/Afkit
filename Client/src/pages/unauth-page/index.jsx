import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react'; 

const UnauthPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-lg w-full">
        <Lock className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-extrabold text-red-600 mb-4">
          Unauthorized Access
        </h1>
        <p className="text-base md:text-lg text-gray-700 mb-6">
          It looks like you don't have permission to access this resource.
          Please ensure you're logged in with an authorized account.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
           
            onClick={() => window.location.href = '/auth/login'} 
            className="px-6 py-3 hover:bg-gray-100 hover:text-blue-900 transition-colors duration-200" 
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthPage;