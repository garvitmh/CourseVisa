import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { ImagePlus, Video } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void;
  cloudName: string;
  uploadPreset: string;
  buttonText?: string;
  className?: string;
  resourceType?: 'image' | 'video' | 'auto';
  maxFiles?: number;
}

export const CloudinaryUploadWidget = ({
  onUploadSuccess,
  cloudName,
  uploadPreset,
  buttonText = 'Upload Image',
  className = '',
  resourceType = 'image',
  maxFiles = 1,
}: CloudinaryUploadWidgetProps) => {
  const widgetRef = useRef<any>(null);
  const callbackRef = useRef(onUploadSuccess);
  callbackRef.current = onUploadSuccess;

  useEffect(() => {
    if ('cloudinary' in window) {
      const cloudinary = (window as any).cloudinary;
      widgetRef.current = cloudinary.createUploadWidget(
        {
          cloudName,
          uploadPreset,
          sources: ['local', 'url', 'unsplash'],
          multiple: maxFiles > 1,
          maxFiles,
          resourceType,
        },
        (error: any, result: any) => {
          if (!error && result && result.event === 'success') {
            callbackRef.current(result.info.secure_url);
          }
        }
      );
    }
  }, [cloudName, uploadPreset, resourceType, maxFiles]);

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
      {resourceType === 'video' ? <Video className="w-4 h-4" /> : <ImagePlus className="w-4 h-4" />}
      {buttonText}
    </Button>
  );
};
