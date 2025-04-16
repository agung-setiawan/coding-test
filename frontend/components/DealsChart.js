import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

export default function DealsChart({ data }) {
    return (
        <div className="mt-5">
            <h4>Deal Status per Sales Rep</h4>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rep" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Closed Won" stackId="a" fill="#28a745" />
                    <Bar dataKey="In Progress" stackId="a" fill="#0d6efd" />
                    <Bar dataKey="Closed Lost" stackId="a" fill="#dc3545" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}