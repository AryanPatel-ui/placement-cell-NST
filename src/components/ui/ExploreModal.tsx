import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function ExploreModal({ isOpen, onClose, onContinue }: ExploreModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden text-center p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0066FF]/10 flex items-center justify-center mb-6">
          <Sparkles size={28} className="text-[#0066FF]" />
        </div>

        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
          Sign in to explore more
        </h2>
        
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          Create a free account to browse verified listings, use advanced filters, and apply to opportunities with one click.
        </p>

        <button
          onClick={() => {
            onClose();
            onContinue();
          }}
          className="w-full py-3.5 rounded-xl bg-[#0066FF] text-white font-black text-sm tracking-wide hover:bg-[#0052CC] transition-all shadow-[0_8px_20px_-6px_rgba(0,102,255,0.5)] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Continue to Sign in
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
