import type { UserRole } from '@/generated/prisma/enums';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import RoleEditor from './role-editor';

type ManagedUser = { id: string; name: string; email: string; role: UserRole };

export default function UsersTable({ users }: { users: ManagedUser[] }) {
  return (
    <Table aria-label="User accounts">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Current role</TableHead>
          <TableHead>Update role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={4}>No accounts match these filters.</TableCell>
          </TableRow>
        )}
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell className="break-all">{user.email}</TableCell>
            <TableCell>{user.role === 'ADMIN' ? 'Admin' : 'User'}</TableCell>
            <TableCell>
              <RoleEditor {...user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
