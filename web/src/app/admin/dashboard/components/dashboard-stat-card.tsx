import { Card, CardContent } from "@/components/ui/card";
interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
}
export default function DashboardStatCard({
  title,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <Card className="border-border rounded-md shadow-none">
      {" "}
      <CardContent className="p-4">
        {" "}
        <p className="text-xs font-medium text-muted-foreground">
          {" "}
          {title}{" "}
        </p>{" "}
        <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {" "}
          {value}{" "}
        </div>{" "}
        {description && (
          <p className="mt-1 text-xs text-muted-foreground"> {description} </p>
        )}{" "}
      </CardContent>{" "}
    </Card>
  );
}
