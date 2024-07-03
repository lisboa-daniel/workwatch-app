'use client';

import { useEffect, useState } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { fetchLastestHours } from '@/app/lib/data'; // Update with the actual path
import { useProject } from '@/app/context/ProjectContext';
export default function HoursTable() {
    const { projectId, setProjectId, projectTitle, setProjectTitle } = useProject();

    console.log(`projectId ID HRTB 1 ${projectId}`);

    const [rows, setRows] = useState<GridRowsProp>([]);
    const columns: GridColDef[] = [
        { field: 'author', headerName: 'Autor', width: 150 },
        { field: 'task', headerName: 'Tarefa', width: 150 },
        { field: 'description', headerName: 'Descrição', width: 150 },
        { field: 'hours', headerName: 'Horas', width: 150 },
        { field: 'date', headerName: 'Data', width: 150 },
    ];

    useEffect(() => {
        async function fetchData() {
           
            try {
                console.log(`projectId ID HRTB 2 ${projectId}`);
                const data = await fetchLastestHours({ projectId: projectId }); // Replace 'your_project_id' with the actual project ID
                setRows(data.map((item, index) => ({
                    id: index,
                    author: item.author,
                    task: item.task,
                    description: item.description,
                    hours: item.hours,
                    date: item.date,
                })));
            } catch (error) {
                console.error('Error fetching latest hours:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div className='mt-25 w-full h-100'>
            <DataGrid sx={{ m: 2 }} 
            
            rows={rows} columns={columns} localeText={ptBR.components.MuiDataGrid.defaultProps.localeText} />
        </div>
    );
}
