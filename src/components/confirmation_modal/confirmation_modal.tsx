// @/components/confirmation_modal/confirmation_modal.tsx
'use client';

import Button from '@/components/button/button';

type ConfirmationModalProps = {
    open: boolean;
    mode: 'lost' | 'found';
    itemTitle: string;
    onClose: () => void;
};

export default function ConfirmationModal({
    open,
    mode,
    itemTitle,
    onClose,
}: ConfirmationModalProps) {
    if (!open) return null;

    const isLost = mode === 'lost';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Dynamic Icon Accent */}
                <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isLost ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                        }`}
                >
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>

                {/* Dynamic Title */}
                <h3 className="text-2xl font-bold text-slate-900">
                    {isLost ? 'Lost Item Reported' : 'Found Item Logged'}
                </h3>

                {/* Dynamic Message Content */}
                <p className="mt-2 text-sm text-slate-600">
                    Your report for <span className="font-semibold text-slate-800">"{itemTitle}"</span> has
                    been successfully created.
                </p>

                <div className="mt-4 rounded-lg bg-slate-50 p-4 text-left text-xs text-slate-500 space-y-1 border border-slate-100">
                    <p className="font-medium text-slate-700">What happens next?</p>
                    {isLost ? (
                        <p>
                            We’ll cross-reference your submission against items turned into campus facilities. You will be notified if a potential match is found.
                        </p>
                    ) : (
                        <p>
                            If you turned this item in to a building office or MSC desk, campus staff will verify and hold it securely until the owner claims it.
                        </p>
                    )}
                </div>

                {/* Action Button */}
                <div className="mt-6 flex justify-center">
                    <Button buttonName="Done" onClick={onClose} />
                </div>
            </div>
        </div>
    );
}