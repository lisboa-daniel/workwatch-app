'use client';

import { useEffect, useState } from 'react';
import { StatusCard } from '@/app/ui/overview/status_card';
import { fetchOverviewData } from '@/app/lib/data'; // Update with the actual path

import { useProject } from '@/app/context/ProjectContext';


export default function StatusCardWrapper({userId} : { userId: string}) {
    
    const { projectId, setProjectId, projectTitle, setProjectTitle } = useProject();

    const [data, setData] = useState<{ totalHours: string; formmatedAVG: string; fyHours: string } | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const projectData = await fetchOverviewData({ projectId: projectId, userId: userId });
                setData(projectData);
            } catch (error) {
                console.error('Error fetching overview data:', error);
            }
        }

        fetchData();
    }, []);

    if (!data) {
        // Data is still being fetched, return loading indicator or null
        return null;
    }

    return (
        <>
            <StatusCard title="Horas totais" color="g" hours={`${data.totalHours ? data.totalHours : '0'} horas`} />
            <StatusCard title="Média por entrega" color="y" hours={`${!isNaN(parseInt(data.formmatedAVG)) ? data.formmatedAVG : '0'} horas`} />
            <StatusCard title="Suas horas" color="b" hours={`${data.fyHours ? data.fyHours : '0'} horas`} />
        </>
    );
}
