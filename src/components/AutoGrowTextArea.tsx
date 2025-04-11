import React, { useEffect, useRef } from 'react';

interface AutoGrowTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AutoGrowTextArea: React.FC<AutoGrowTextAreaProps> = ({ value, onChange, className = '', ...props }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textArea = textAreaRef.current;
    if (textArea) {
      // Reset height to auto to get the correct scrollHeight
      textArea.style.height = 'auto';
      // Set the height to match the content
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  };

  // Adjust height when value changes
  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <textarea
      ref={textAreaRef}
      value={value}
      onChange={(e) => {
        onChange(e);
        adjustHeight();
      }}
      className={`w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent overflow-hidden ${className}`}
      {...props}
    />
  );
};

export default AutoGrowTextArea; 