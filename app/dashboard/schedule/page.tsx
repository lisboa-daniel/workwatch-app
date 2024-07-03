'use client';

import Timetable from "@/app/ui/timesheet/time_table";
import UserHeader from "@/app/ui/dashboard/user-header";
import { inter } from "@/app/ui/fonts";
import PathBurguer from "@/app/ui/dashboard/path_burger";
import { useEffect, useState } from "react";
import { fetchTimesheetData } from "@/app/lib/data";
import { useProject } from "@/app/context/ProjectContext";
import { GridColDef } from "@mui/x-data-grid";
import Gantt from "@/app/ui/timesheet/scheduler";


export interface dataRow {
  user_fullname: string,
  task_summary: string,
  total_amount: number,
  date: string
}

export default function Page() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [datarow, setDatarow] = useState<dataRow[]>([]);
  const [datacolumn, setDataColumn] = useState<string[]>([]);
  
  const { projectId } = useProject();

  const handlerData = async (projectId: string, date1: string, date2: string) => {
    const data = await fetchTimesheetData(projectId, date1, date2);
    setDatarow(data.data_rows);
    setDataColumn(data.columns);
  };

  return (
    <main className="p-4">
      <UserHeader />
      <PathBurguer nextpath={'Timesheet'} />
 
      <div className="flex flex-col md:flex-row items-center md:items-start m-5 space-y-4 md:space-y-0 md:space-x-4">
        <p className="default-title-style text-xl md:text-2xl">De</p>
        <input
          onChange={(e) => setDate1(e.target.value)}
          id="start_date"
          name="start_date"
          type="date"
          placeholder="Start date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
        />
        <p className="default-title-style text-xl md:text-2xl">até</p>
        <input
          onChange={(e) => setDate2(e.target.value)}
          id="end_date"
          name="end_date"
          type="date"
          placeholder="End date"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
        />
        <button className="text-sm bg-activeColor-400 text-white p-3 rounded-xl" onClick={() => handlerData(projectId, date1, date2)}>
          Filtrar
        </button>
      </div>
      {<Timetable datarows={datarow} columns={datacolumn} />}
     {/* <Gantt/>*/}
        

    </main>
  );
}
