"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface UserGrowthData {
  month: string;
  users: number;
}

interface UserGrowthChartProps {
  data?: UserGrowthData[];
}

const defaultData: UserGrowthData[] = [
  { month: "Jan", users: 0 },
  { month: "Feb", users: 0 },
  { month: "Mar", users: 0 },
  { month: "Apr", users: 0 },
  { month: "May", users: 0 },
  { month: "Jun", users: 0 },
  { month: "Jul", users: 0 },
  { month: "Aug", users: 0 },
  { month: "Sep", users: 0 },
  { month: "Oct", users: 0 },
  { month: "Nov", users: 0 },
  { month: "Dec", users: 0 },
];

export default function UserGrowthChart({
  data = defaultData,
}: UserGrowthChartProps) {
  return (
    <Card className="h-full border-border shadow-none">
      <CardHeader>
        <CardTitle>User Growth</CardTitle>

        <CardDescription>
          Number of registered users over time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}