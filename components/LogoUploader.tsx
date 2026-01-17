
import React from 'react';

interface LogoUploaderProps {
  onUpload: (base64: string) => void;
  logo: string | null;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({ onUpload, logo }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-blue-400 transition-colors cursor-pointer relative">
      <input
        type="file"
        className="absolute inset-0 opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      {logo ? (
        <div className="flex flex-col items-center">
          <img src={logo} alt="Uploaded logo" className="h-24 object-contain mb-4 rounded shadow-sm" />
          <p className="text-sm font-medium text-slate-600">Click or drag to change logo</p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-slate-400">
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p className="text-sm font-medium">Upload your Logo</p>
          <p className="text-xs mt-1">PNG, JPG, SVG supported</p>
        </div>
      )}
    </div>
  );
};
