/**
 * Toast Notification Component
 * Professional flash messages for user feedback
 */

import React, { useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const icons = {
        success: CheckCircle,
        error: AlertTriangle,
        info: Info,
        warning: AlertTriangle
    };

    const colors = {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800'
    };

    const Icon = icons[type];

    return (
        <div className={clsx(
            "fixed top-4 right-4 z-50 max-w-md rounded-lg shadow-lg border-l-4 p-4 animate-slide-in",
            colors[type]
        )}>
            <div className="flex items-start">
                <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
                <p className="flex-1 text-sm font-medium">{message}</p>
                <button
                    onClick={onClose}
                    className="ml-3 flex-shrink-0 hover:opacity-70 transition-opacity"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// Toast Container for multiple toasts
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                />
            ))}
        </div>
    );
}

// Hook for managing toasts
export function useToast() {
    const [toasts, setToasts] = React.useState([]);

    const addToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}
