'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Button from '@/components/ui/button';

export default function CancelTicketButton({
  itemId,
  itemName,
  action,
}: {
  itemId: string;
  itemName: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const promptId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isConfirming && !dialog.open) {
      dialog.showModal();
    } else if (!isConfirming && dialog.open) {
      dialog.close();
    }
  }, [isConfirming]);

  return (
    <>
      <Button
        variant="unstyled"
        type="button"
        onClick={() => setIsConfirming(true)}
        className="activity-table-cancel rounded-md border border-[var(--danger-border)] bg-[var(--danger-surface)] px-3 py-1.5 font-semibold text-[var(--danger-text)] transition-colors hover:bg-[var(--danger-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
      >
        Cancel
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={promptId}
        onCancel={(event) => {
          event.preventDefault();
          setIsConfirming(false);
        }}
        className="m-auto w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-[var(--surface-border)] bg-[var(--surface-raised)] p-4 text-center text-[var(--text-primary)] shadow-xl"
      >
        <h2 id={promptId} className="text-base font-bold">
          Are you sure you want to cancel
        </h2>
        <p className="mt-1 break-words text-sm text-[var(--text-muted)]">{itemName}</p>
        <div className="mt-4 flex justify-center gap-3">
          <Button
            variant="unstyled"
            type="button"
            onClick={() => setIsConfirming(false)}
            className="rounded-md border border-[var(--surface-border)] bg-[var(--surface-raised)] px-3 py-1.5 text-base font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            No
          </Button>
          <form action={action}>
            <input type="hidden" name="itemId" value={itemId} />
            <Button
              variant="unstyled"
              type="submit"
              className="rounded-md border border-red-700 bg-red-700 px-3 py-1.5 text-base font-semibold text-white transition-colors hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
            >
              Yes
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
}
