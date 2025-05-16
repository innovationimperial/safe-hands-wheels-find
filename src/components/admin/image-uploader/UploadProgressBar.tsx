
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressBarProps {
  isUploading: boolean;
  progress: number;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({ isUploading, progress }) => {
  if (!isUploading) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Uploading...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgressBar;
