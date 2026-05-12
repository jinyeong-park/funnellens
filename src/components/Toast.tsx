import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
  type?: 'error' | 'success';
  onClose: () => void;
}

export const Toast = ({ message, type = 'error', onClose }: ToastProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-gray-100 shadow-xl rounded-lg p-4 min-w-[320px]"
        >
          <div className={`w-1 absolute left-0 top-0 bottom-0 rounded-l-lg ${type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <div className="flex-shrink-0">
            {type === 'error' ? (
              <AlertCircle size={20} className="text-red-500" />
            ) : (
              <CheckCircle2 size={20} className="text-emerald-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{type === 'error' ? 'Error' : 'Success'}</p>
            <p className="text-xs text-gray-500">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
