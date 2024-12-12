'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function AttendanceStats({ filters }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        let query = supabase
          .from('attendance')
          .select('status');

        if (filters?.classId) {
          query = query.eq('class_id', filters.classId);
        }
        if (filters?.studentId) {
          query = query.eq('student_id', filters.studentId);
        }
        if (filters?.date) {
          query = query.eq('date', filters.date.toISOString().split('T')[0]);
        }

        const { data, error } = await query;

        if (error) throw error;

        const statsCounts = data.reduce((acc, curr) => {
          acc[curr.status] = (acc[curr.status] || 0) + 1;
          return acc;
        }, {});

        const statsData = Object.entries(statsCounts).map(([status, count]) => ({
          status: status.charAt(0).toUpperCase() + status.slice(1),
          count
        }));

        setStats(statsData);
      } catch (error) {
        console.error('Error fetching attendance stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [filters]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-10">Attendance Statistics</h2>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="80%" height="100%">
          <BarChart data={stats}>
            <XAxis dataKey="status" />
            <YAxis />
            <Bar dataKey="count" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}