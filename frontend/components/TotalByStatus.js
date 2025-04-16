import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const dataColor = [
    { stages1: true, },
    { stages2: true, },
    { stages3: true, },
];

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

export default function TotalByStatus({ data }) {
    return (
        <div style={{ width: "100%", height: 400, padding: "1rem" }}>
            <h4 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
                Deal Value by Status
            </h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {dataColor.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}