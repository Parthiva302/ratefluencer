import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const Icon = type === 'success' ? CheckCircle2 : XCircle;

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-2 ${bgColor} text-white px-4 py-3 rounded-lg shadow-xl shadow-black/20 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default Toast;
