import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SalesChart({ data }) {
    return (
        <div className="mt-5">
            <h4>Top Sales Reps by Deal Value</h4>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="dealValue" fill="#007bff" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
