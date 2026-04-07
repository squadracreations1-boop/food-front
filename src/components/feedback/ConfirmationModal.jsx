import React from 'react';
import Modal from '../common/Model'; // Note: File is named Model.jsx in codebase
import Button from '../common/Button';
import { AlertCircle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    // Reset loading state when modal opens/closes
    React.useEffect(() => {
        if (isOpen) setIsLoading(false);
    }, [isOpen]);

    const handleConfirm = async () => {
        try {
            const result = onConfirm();
            if (result instanceof Promise) {
                setIsLoading(true);
                await result;
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={isLoading ? undefined : onClose} title={title}>
            <div className="flex flex-col items-center text-center py-20 px-16">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDangerous ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    <AlertCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex gap-3 w-full">
                    <Button
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDangerous ? "danger" : "primary"}
                        fullWidth
                        onClick={handleConfirm}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
