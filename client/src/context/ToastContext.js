import { createContext, useContext, useState, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);

    if(!context){
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timeoutRefs = useRef({});

    const addToast = (message, type='info') => {
        const id = Date.now();
        const newToast = {id, message, type};
        setToasts(prev => [...prev, newToast]);

        timeoutRefs.current[id] = setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const removeToast = (id) => {
        if(timeoutRefs.current[id]){
            clearTimeout(timeoutRefs.current[id]);
            delete timeoutRefs.current[id];
        }

        setToasts(toasts.filter(toast => toast.id !== id));
    };

    const pauseToast = (id) => {
        if(timeoutRefs.current[id]){
            clearTimeout(timeoutRefs.current[id]);
            delete timeoutRefs.current[id];
        }
    };

    const resumeToast = (id) => {
        timeoutRefs.current[id] = setTimeout(() => {
            removeToast(id);
        }, 3000);
    };

    const value = {
        toasts,
        addToast,
        removeToast,
        pauseToast,
        resumeToast,
        toastSuccess: (message) => addToast(message, 'success'),
        toastError: (message) => addToast(message, 'error'),
        toastInfo: (message) => addToast(message, 'info')
    };

    return (
        <ToastContext.Provider value={value}>
            { children }
            <ToastContainer toasts={toasts} onClose={removeToast} onPause={pauseToast} onResume={resumeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onClose, onPause, onResume }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div 
                    key={toast.id}
                    className={`toast toast-${toast.type}`}
                    onMouseEnter={() => onPause(toast.id)}
                    onMouseLeave={() => onResume(toast.id)}
                >
                    <span>toast.message</span>

                    <button onClick={() => onClose(toast.id)} className="toast-cancel">
                        x
                    </button>
                </div>
            ))}
        </div>
    );
};