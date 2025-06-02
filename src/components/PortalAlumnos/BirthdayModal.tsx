'use client';
import React from 'react';
import { ConfettiComponent } from '../PortalProfes/Confetti';

interface BirthdayModalProps {
    userName: string;
    onClose: () => void;
}

const BirthdayModal: React.FC<BirthdayModalProps> = ({ userName, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-8 relative max-w-md w-full text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">🎉 ¡Feliz Cumpleaños!</h2>
                    <p className="text-xl text-gray-600">¡{userName}, esperamos que tengas un día maravilloso!</p>
                </div>
                <div className="mt-6">
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        ¡Gracias!
                    </button>
                </div>
            </div>
            <ConfettiComponent repeat={true} />
        </div>
    );
};

export default BirthdayModal;
