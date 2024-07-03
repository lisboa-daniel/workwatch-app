'use client';

import { TasksWrapper } from "@/app/ui/tasks/tasks_wrapper";
import UserHeader from "@/app/ui/dashboard/user-header";
import { inter } from "@/app/ui/fonts";
import { useProject } from '@/app/context/ProjectContext';
import PathBurguer from "@/app/ui/dashboard/path_burger";

export default function Page(){

  const { projectId, setProjectId, projectTitle, setProjectTitle } = useProject();
  return (
    <main>
      
        {<UserHeader/>}
        <PathBurguer nextpath={'Tarefas'}/>

        <p className={`${inter.className} mb-2 text-xl md:text-2xl font-extrabold text-dashTitleColor-400`}>
          Tarefas
        </p>
        <TasksWrapper/>
   
    </main>
    
  );
}