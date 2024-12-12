'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

const COLORS = ['#4CAF50', '#F44336', '#FFC107', '#2196F3'];

export default function AttendanceSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - 7);

        const { data, error } = await supabase
          .from('attendance')
          .select('status')
          .gte('date', startOfWeek.toISOString().split('T')[0]);

        if (error) throw error;

        const summaryData = data.reduce((acc, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.entries(summaryData).map(([status, value]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1),
          value
        }));

        setSummary(chartData);
      } catch (error) {
        console.error('Error fetching attendance summary:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Weekly Attendance Overview</h2>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={summary}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {summary?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}