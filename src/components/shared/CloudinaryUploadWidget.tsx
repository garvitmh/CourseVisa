import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { ImagePlus } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  cloudName: string;
  uploadPreset: string;
  buttonText?: string;
  className?: string;
}

export const CloudinaryUploadWidget = ({
  onUploadSuccess,
  cloudName,
  uploadPreset,
  buttonText = 'Upload Image',
  className = ''
}: CloudinaryUploadWidgetProps) => {
  const widgetRef = useRef<any>(null);
  // Store the callback in a ref so the effect never re-fires due to a new function reference
  const callbackRef = useRef(onUploadSuccess);
  callbackRef.current = onUploadSuccess;

  useEffect(() => {
    // Only initialize once — independent of the parent's state changes
    if ('cloudinary' in window) {
      const cloudinary = (window as any).cloudinary;
      widgetRef.current = cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local', 'url', 'unsplash'],
          multiple: false,
          maxFiles: 1,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            callbackRef.current(result.info.secure_url);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudName, uploadPreset]); // ← onUploadSuccess intentionally excluded

  const handleOpenWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error('Cloudinary widget not initialized.');
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleOpenWidget} 
      className={`flex items-center gap-2 ${className}`}
    >
      <ImagePlus className="w-4 h-4" />
      {buttonText}
    </Button>
  );
};
