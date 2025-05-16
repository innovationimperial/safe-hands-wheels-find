
import React from 'react';

interface UploadErrorProps {
  error: string | null;
}

const UploadError: React.FC<UploadErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
      <p className="font-medium">{error}</p>
      <p className="text-sm mt-1">Please check your connection and try again.</p>
    </div>
  );
};

export default UploadError;
