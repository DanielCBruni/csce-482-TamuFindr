'use client';

import { useState, useTransition } from 'react';
import { setUserRole } from '@/actions/user-role';
import type { UserRole } from '@/generated/prisma/enums';
import Button from '@/components/ui/button';
import Select from '@/components/ui/select';

export default function RoleEditor({
  id,
  email,
  role,
}: {
  id: string;
  email: string;
  role: UserRole;
}) {
  const [selected, setSelected] = useState<UserRole>(role);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setMessage('');
        startTransition(async () => {
          try {
            const result = await setUserRole(id, selected);
            setFailed(!result.success);
            setMessage(result.success ? 'Role updated.' : result.error);
          } catch {
            setFailed(true);
            setMessage('Unable to update the role. Please try again.');
          }
        });
      }}
    >
      <div className="flex items-center gap-2">
        <Select
          aria-label={`Role for ${email}`}
          value={selected}
          disabled={pending}
          onChange={(event) => {
            setSelected(event.target.value as UserRole);
            setMessage('');
          }}
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Button
          type="submit"
          disabled={pending || selected === role}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save'}
        </Button>
      </div>
      {message && (
        <p role={failed ? 'alert' : 'status'} className="mt-2 text-sm">
          {message}
        </p>
      )}
    </form>
  );
}
