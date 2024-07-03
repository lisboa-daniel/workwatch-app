// Timetable.tsx

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export interface dataRow {
  user_fullname: string;
  task_summary: string;
  total_amount: number;
  date: string;
}

interface TimetableProps {
  datarows: dataRow[];
  columns: string[];
}

export default function Timetable({ datarows, columns }: TimetableProps) {
  // Create an object to hold rows with dynamic fields
  const rowsMap: { [key: string]: any } = {};

  // Populate rowsMap with initial issue fields
  datarows.forEach((row) => {
    const issueKey = `${row.user_fullname} / ${row.task_summary}`;
    rowsMap[issueKey] = { id: issueKey, issue: issueKey };
  });

  // Populate rowsMap with data from datarows based on date and total_amount
  datarows.forEach((row) => {
    rowsMap[`${row.user_fullname} / ${row.task_summary}`][row.date] = row.total_amount;
  });

  // Convert rowsMap object to rows array
  const rows = Object.keys(rowsMap).map((key) => rowsMap[key]);

  // Create columns array for DataGrid
  const gridColumns: GridColDef[] = [
    { field: 'issue', headerName: 'Issue', width: 250 },
    ...columns.map((col) => ({
      field: col,
      headerName: col,
      width: 110,
    })),
  ];

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DataGrid
          rows={rows}
          columns={gridColumns}
        
          pageSizeOptions={[5]}
          getRowId={(row) => row.id} // Specify the id getter function
        />
      </LocalizationProvider>
    </Box>
  );
}
