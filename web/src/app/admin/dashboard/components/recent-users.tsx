import Link from 'next/link';
import { ArrowRight, Users as UserIcon } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

interface RecentUsersProps {
  users: User[];
}

export default function RecentUsers({
  users,
}: RecentUsersProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold">
            Recent Users
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Latest registered users.
          </p>
        </div>

        <Link
          href="/admin/users"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <div className="flex-1 overflow-x-auto">
        {users.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-5 py-3 font-medium">
                  User
                </th>

                <th className="px-5 py-3 font-medium">
                  Email
                </th>

                <th className="px-5 py-3 font-medium">
                  Role
                </th>

                <th className="px-5 py-3 font-medium">
                  Status
                </th>

                <th className="px-5 py-3 font-medium">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        {user.avatarUrl ? (
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                        ) : (
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>

                      <span className="max-w-40 truncate font-medium whitespace-nowrap">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {user.email}
                  </td>

                  <td className="px-5 py-4">
                    {user.role}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {user.status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(
                      user.createdAt,
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex min-h-45 flex-col items-center justify-center px-5 text-center">
            <EmptyState
              size="sm"
              icon={UserIcon}
              title="No Users Found"
              description="There are no users to display at the moment."
            />
          </div>
        )}
      </div>
    </div>
  );
}