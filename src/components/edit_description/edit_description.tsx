'use client';

import { useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button';
import { updateItemDescription } from '@/actions/update-item-description';

export default function EditDescription({
  itemId,
  description,
  onSaved,
}: {
  itemId: string;
  description: string | null;
  onSaved: (description: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(description ?? '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const saving = useRef(false);
  const inputId = useId();
  const router = useRouter();

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current) return;
    saving.current = true;
    setPending(true);
    setError(null);
    try {
      const result = await updateItemDescription(itemId, draft);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onSaved(result.description);
      setEditing(false);
      setSaved(true);
      router.refresh();
    } catch {
      setError('Unable to save your description. Please try again.');
    } finally {
      saving.current = false;
      setPending(false);
    }
  }

  return (
    <div>
      {editing ? (
        <form onSubmit={save} className="space-y-3" aria-busy={pending}>
          <label htmlFor={inputId} className="block text-sm font-semibold">
            Description (optional)
          </label>
          <textarea
            autoFocus
            id={inputId}
            value={draft}
            disabled={pending}
            onChange={(event) => setDraft(event.target.value)}
            rows={5}
            className="w-full rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] p-3 text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
          />
          {error && (
            <p role="alert" className="text-sm text-[var(--danger-text)]">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save description'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={pending}
              onClick={() => {
                setEditing(false);
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className="whitespace-pre-wrap break-words text-[var(--text-muted)]">
            {description || 'No description provided.'}
          </p>
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={() => {
              setDraft(description ?? '');
              setSaved(false);
              setEditing(true);
            }}
          >
            Edit description
          </Button>
        </>
      )}
      {saved && (
        <p role="status" className="mt-2 text-sm text-[var(--text-muted)]">
          Description saved.
        </p>
      )}
    </div>
  );
}
