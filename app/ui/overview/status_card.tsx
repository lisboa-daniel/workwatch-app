'use client';

import { inter } from '@/app/ui/fonts';
import { ClockIcon } from '@heroicons/react/24/outline';


export function StatusCard({
  title,
  hours,
  color,
}: {
  title: string;
  hours: string;
  color: string;
}) {
  let bgc;
  let tc;

 
  // Hardcoded color assignments
  switch(color){
    case "b": 
      bgc = "bg-cardBlue-400"; 
      tc = "text-cardBlue-400"; 
      break;
    case "y": 
      bgc = "bg-cardYellow-400"; 
      tc = "text-cardYellow-400"; 
      break;
    case "g": 
      bgc = "bg-cardGreen-400"; 
      tc = "text-cardGreen-400"; 
      break;
    default:
      bgc = "bg-cardBlue-400";  // Default to blue if color is not specified
      tc = "text-cardBlue-400"; 
  }

  return (
    <div className={`rounded-xl p-3s shadow-xl border-1 border-slate-200 w-64 h-[120px] md:ml-6 mb-6 `}>
      <div className={`flex items-center ${bgc} rounded-lg flex h-1 mt-[24px]`} />
      <div className="flex p-4"> 
        <ClockIcon className={`h-7 w-7 ${tc}`} />
        <p className={`${inter.className} ml-2 text-dashTitleColor-400 font-extrabold text-[20]`}>{title}</p>
      </div>
      <p className="rounded-xl text-center overflow-hidden mb-15">
        {hours}
      </p>
    </div>
  );
}
