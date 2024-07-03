'use client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// layout.tsx
import { ReactNode } from 'react';
import NavBar from '@/app/ui/dashboard/nav-bar';
import { ProjectProvider } from '@/app/context/ProjectContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ProjectProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <NavBar />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-8">{children}</div>
        </div>
      </LocalizationProvider>
    </ProjectProvider>
  );
}
