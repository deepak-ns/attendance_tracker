'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function AttendanceFilters({ onFilterChange }) {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      const [classesResponse, studentsResponse] = await Promise.all([
        supabase
          .from('classes')
          .select(`
            id,
            subjects (name),
            teachers (first_name, last_name)
          `),
        supabase
          .from('students')
          .select('id, first_name, last_name')
      ]);

      if (classesResponse.data) setClasses(classesResponse.data);
      if (studentsResponse.data) setStudents(studentsResponse.data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClassChange = (value) => {
    setSelectedClass(value === selectedClass ? '' : value);
    onFilterChange(prev => ({
      ...prev,
      classId: value === selectedClass ? null : value
    }));
  };

  const handleStudentChange = (value) => {
    setSelectedStudent(value === selectedStudent ? '' : value);
    onFilterChange(prev => ({
      ...prev,
      studentId: value === selectedStudent ? null : value
    }));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onFilterChange(prev => ({
      ...prev,
      date: date
    }));
  };

  return (
    <div className="space-y-4 lg:space-y-0 lg:flex lg:space-x-4 items-end">
      <div className="flex-1">
        <Select value={selectedClass} onValueChange={handleClassChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((cls) => (
              <SelectItem key={cls.id} value={cls.id}>
                {cls.subjects.name} - {cls.teachers.first_name} {cls.teachers.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Select value={selectedStudent} onValueChange={handleStudentChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Student" />
          </SelectTrigger>
          <SelectContent>
            {students.map((student) => (
              <SelectItem key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}