'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import {
  Menu,
  UserRound,
  UserRoundPen,
  BookOpen,
  Building2,
  Presentation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
const inter = Inter({ subsets: ['latin'] });


export default function RootLayout({children}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: UserRound, label: 'Students', href: '/students' },
    { icon: UserRoundPen, label: 'Teachers', href: '/teachers' },
    { icon: BookOpen, label: 'Subjects', href: '/subjects' },
    { icon: Building2, label: 'Departments', href: '/departments' },
    { icon: Presentation, label: 'Classes', href: '/classes' },
  ];

  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="min-h-screen bg-background">
        <aside
          className={cn(
            'fixed left-0 top-0 z-40 h-screen w-64 transform bg-card transition-transform duration-200 ease-in-out',
            !isSidebarOpen && '-translate-x-full'
          )}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-xl font-bold">
              <Link href="/">Attendance Tracker</Link>
            </h1>
            <button onClick={() => setIsSidebarOpen(false)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-4 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm hover:bg-accent"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div
          className={cn(
            'transition-margin duration-200 ease-in-out',
            isSidebarOpen ? 'ml-64' : 'ml-0'
          )}
        >
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </button>
            )}
          </header>
          <main className="container mx-auto p-4">{children}</main>
        </div>
      </div>
    </body>
    </html>
  );
}