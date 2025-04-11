
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface AlertData {
  severity: string;
  count: number;
}

interface AlertsBySeverityChartProps {
  data: AlertData[];
}

export function AlertsBySeverityChart({ data }: AlertsBySeverityChartProps) {
  const COLORS = {
    Critical: "#ea384c",
    High: "#F97316",
    Medium: "#FEC6A1",
    Low: "#33C3F0",
  };

  const chartData = useMemo(() => {
    return data.map((item) => ({
      name: item.severity,
      value: item.count,
      color: COLORS[item.severity as keyof typeof COLORS] || "#8884d8",
    }));
  }, [data]);

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} alerts`, "Count"]}
            contentStyle={{ 
              backgroundColor: "rgba(34, 37, 51, 0.9)", 
              borderColor: "rgba(139, 92, 246, 0.5)" 
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
