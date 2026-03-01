export default function ClassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="pb-24 lg:pb-8">{children}</div>;
}
