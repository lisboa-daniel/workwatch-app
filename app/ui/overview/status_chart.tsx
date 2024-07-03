'use client';

import { useProject } from '@/app/context/ProjectContext';

import HoursChart from "./hours_chart";

export default function StatusChart() {
    const { projectId, setProjectId } = useProject();
    return (
        <div>
            <HoursChart projectId={projectId}/>
        </div>
    );
}