interface UserVerificationCardProps {
  verified: number;
  unverified: number;
}

export default function UserVerificationCard({
  verified,
  unverified,
}: UserVerificationCardProps) {
  const total = verified + unverified;

  const verifiedPercentage =
    total > 0 ? Math.round((verified / total) * 100) : 0;

  const unverifiedPercentage = 100 - verifiedPercentage;

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div>
        <h2 className="font-semibold">
          Email Verification
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          User account verification status.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center">
        <div
          className="relative flex size-44 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(
              var(--primary) ${verifiedPercentage}%,
              var(--muted) ${verifiedPercentage}% 100%
            )`,
          }}
        >
          <div className="flex size-32 flex-col items-center justify-center rounded-full bg-card">
            <span className="text-3xl font-semibold">
              {verifiedPercentage}%
            </span>

            <span className="text-xs text-muted-foreground">
              Verified
            </span>
          </div>
        </div>
      </div>

      <div className="mt-7 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Verified
          </span>

          <span className="font-medium">
            {verified.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Unverified
          </span>

          <span className="font-medium">
            {unverified.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="font-medium">
            Total
          </span>

          <span className="font-semibold">
            {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}