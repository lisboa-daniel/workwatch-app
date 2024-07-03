'use client';

import UserHeader from "@/app/ui/dashboard/user-header";
import { inter } from "@/app/ui/fonts";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import BasicDateCalendar from '@/app/ui/calendar/basic_calendar';


export default function Page() {
  return (
    <main>
      <UserHeader/>
      <p className={`${inter.className} mb-2 text-sm md:text-sm font-extrabold text-dashTitleColor-400`}>
          Projetos / Projeto teste
      </p>
    <div>
      <p className={`${inter.className} mb-2 text-xl md:text-2xl font-extrabold text-dashTitleColor-400`}>
        Calendário
      </p>
      </div>

      <BasicDateCalendar/>
   
    </main>
 
  );
}