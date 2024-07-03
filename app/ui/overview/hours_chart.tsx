'use client';

import { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { fetchCollaborationData } from '@/app/lib/data';

type ChartData = {
  id: number;
  value: number;
  label: string;
};

type linha = {
  fullname: string;
  hours: string;
};

export default function HoursChart({ projectId }: { projectId: string }) {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        async function getData() {
            try {
                const data = await fetchCollaborationData({ projectId });
                const formattedData = data.map((item: linha, index: number) => ({
                    id: index,
                    value: parseFloat(item.hours),
                    label: item.fullname
                }));
                setChartData(formattedData);
            } catch (error) {
                console.error('Error fetching collaboration data:', error);
            }
        }

        getData();
    }, [projectId]);

    return (
        <main className='md:w-[600px] w-[485px] md:h-[200px] h-[100px] '>
            <PieChart
            series={
                [
                {
                    data: chartData,
                  
                },

                
            ]}
        
        />
        </main>
        
    );
}
