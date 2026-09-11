import type { ToastProps } from '@/types/components/toastTypes';
import { useCallback, useEffect, useState } from 'react';
import { MdDone, MdErrorOutline, MdOutlineWarningAmber } from 'react-icons/md';

const Toast = ({
  variant = 'success',
  title,
  details = undefined,
  onClose,
  duration = 5000,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const variants = {
    success: {
      bg: 'bg-green-600',
      text: 'text-white',
      icon: <MdDone />,
    },
    warning: {
      bg: 'bg-yellow-500',
      text: 'text-black',
      icon: <MdOutlineWarningAmber />,
    },
    error: {
      bg: 'bg-red-600',
      text: 'text-white',
      icon: <MdErrorOutline />,
    },
  };

  const { bg, text, icon } = variants[variant];

  return (
    <div
      className={`fixed z-50 
        bottom-4 md:bottom-6
        md:top-auto md:left-6 md:right-auto md:transform-none
        top-4 left-1/2 -translate-x-1/2 md:translate-x-0
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <div
        className={`${bg} ${text} rounded-lg shadow-lg p-4 min-w-75 max-w-100 flex gap-3 ${
          details ? 'items-start' : 'items-center' // <-- FIX 1: Conditionally center items
        }`}
      >
        {/* FIX 2: Removed p-2 to ensure perfect alignment with the text */}
        <div className="shrink-0 text-2xl font-bold flex items-center">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-sm ${details ? 'mb-1' : ''}`}>
            {/* FIX 3: Removed mb-1 if there are no details */}
            {title}
          </h3>
          {details && <p className="text-sm opacity-90">{details}</p>}
        </div>

        <button
          onClick={handleClose}
          className={`shrink-0 ${text} hover:opacity-70 transition-opacity ${
            details ? 'mt-0.5' : '' // Slightly push down the close button only if there are details
          }`}
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
