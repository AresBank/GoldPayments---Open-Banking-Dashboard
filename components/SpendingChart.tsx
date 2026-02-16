
import React, { useMemo } from 'react';
import type { Transaction, SpendingCategory } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SpendingChartProps {
    transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded-md">
        <p className="label">{`${label} : ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'MXN' }).format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

export const SpendingChart: React.FC<SpendingChartProps> = ({ transactions }) => {
    const spendingData: SpendingCategory[] = useMemo(() => {
        const categories: { [key: string]: number } = {};
        transactions.forEach(tx => {
            if (tx.amount < 0 && tx.currency === 'MXN') { // Only count MXN expenses for this chart
                const category = tx.category;
                if (categories[category]) {
                    categories[category] += Math.abs(tx.amount);
                } else {
                    categories[category] = Math.abs(tx.amount);
                }
            }
        });
        return Object.entries(categories)
            .map(([name, total]) => ({ name, total }))
            .sort((a, b) => b.total - a.total);
    }, [transactions]);

    const COLORS = ['#F59E0B', '#FBBF24', '#FCD34D', '#FDE047', '#FEF08A'];

    return (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-full">
            <h3 className="text-xl font-bold text-white mb-4">Gastos por Categoría</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={spendingData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                            width={80}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
                        <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                            {spendingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
