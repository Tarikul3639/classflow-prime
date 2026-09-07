import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCog,
  UserCheck,
} from 'lucide-react';

interface UsersStatsProps {
  isLoading?: boolean;
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  adminUsers: number;
  normalUsers: number;
  bannedUsers: number;
}

export function UsersStats({
  isLoading,
  totalUsers,
  verifiedUsers,
  unverifiedUsers,
  adminUsers,
  normalUsers,
  bannedUsers,
}: UsersStatsProps) {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
    },
    {
      title: 'Verified',
      value: verifiedUsers,
      icon: ShieldCheck,
    },
    {
      title: 'Unverified',
      value: unverifiedUsers,
      icon: ShieldAlert,
    },
    {
      title: 'Admins',
      value: adminUsers,
      icon: UserCog,
    },
    {
      title: 'Normal Users',
      value: normalUsers,
      icon: UserCheck,
    },
    {
      title: 'Banned Users',
      value: bannedUsers,
      icon: ShieldAlert,
    },
  ];

  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>

                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-semibold">
                Loading...
              </p>
            </div>
          );
        })}
      </section>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {stat.title}
              </p>

              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
            </div>

            <p className="mt-3 text-2xl font-semibold">
              {stat.value.toLocaleString()}
            </p>
          </div>
        );
      })}
    </section>
  );
}