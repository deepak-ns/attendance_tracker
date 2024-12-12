'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default function AttendanceTable({ filters }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        setLoading(true);
        let query = supabase
          .from('attendance')
          .select(`
            *,
            students (first_name, last_name),
            classes (
              subjects (name),
              teachers (first_name, last_name)
            )
          `);

        if (filters?.classId) {
          query = query.eq('class_id', filters.classId);
        }
        if (filters?.studentId) {
          query = query.eq('student_id', filters.studentId);
        }
        if (filters?.date) {
          query = query.eq('date', filters.date.toISOString().split('T')[0]);
        }

        const { data, error } = await query
          .order('date', { ascending: false });

        if (error) throw error;
        setAttendance(data);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendance();
  }, [filters]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4"> Attendance Records</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{format(new Date(record.date), 'PP')}</TableCell>
                <TableCell>
                  {record.students.first_name} {record.students.last_name}
                </TableCell>
                <TableCell>{record.classes.subjects.name}</TableCell>
                <TableCell>
                  {record.classes.teachers.first_name} {record.classes.teachers.last_name}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    record.status === 'present' ? 'bg-green-100 text-green-800' :
                    record.status === 'absent' ? 'bg-red-100 text-red-800' :
                    record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}