'use client';

import { useEffect, useState } from 'react';

import { getUserIdFromCookie } from '@/app/lib/data';
import { StatusCard } from "@/app/ui/overview/status_card";
import UserHeader from '@/app/ui/dashboard/user-header';
import Image from 'next/image';
import { inter } from '@/app/ui/fonts';
import StatusChart from '@/app/ui/overview/status_chart';
import LastestHours from "@/app/ui/overview/lastest_hours";
import StatusCardWrapper from "@/app/ui/overview/status_card_wrapper";
import { useProject } from '@/app/context/ProjectContext';
import PathBurguer from '@/app/ui/dashboard/path_burger';

export default function Page() {
  const { projectId, setProjectId, projectTitle, setProjectTitle } = useProject();
  const [userId, setUserId] = useState<string | null>(null);

  const ppid = projectId;

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await getUserIdFromCookie();
      setUserId(userId);
    };

    fetchUserId();
  }, []);

  return (
    <>
      <UserHeader />
      <PathBurguer nextpath={'Visão geral'}/>
      <div>
        <p className={`${inter.className} mb-2 text-xl md:text-2xl font-extrabold text-dashTitleColor-400`}>
          Visão geral do projeto
        </p>
      </div>


      <div>
        <p className={`${inter.className} mb-2 text-sm md:text-xs text-dashTitleColor-400`}>
          * Dados obtidos a partir da previsão de horas em tarefas finalizadas e a ser finalizada.
        </p>
      </div>

        
      <div className="flex justify-center">
        <main className="flex flex-col md:flex-row justify-center">
          {userId && <StatusCardWrapper userId={userId} />}
        </main>
      </div>
      <p className={`${inter.className} mb-4 text-xl md:text-nm font-extrabold text-dashTitleColor-400 text-center`}>
          Colaboração no projeto em horas
        </p>
      <div className="flex justify-center items-center mb-3">
        <StatusChart />
      </div>
      <LastestHours />
    </>
  );
}
