'use client';

import { useEffect, useState } from 'react';
import { TaskCard } from "./tasks_card";
import { fetchTaskData } from '@/app/lib/data';
import CreateTask from "@/app/ui/tasks/create_task_modal";
import { useProject } from '@/app/context/ProjectContext';

interface Task {
  id: string;
  title: string;
  task: string;
  start_date: string;
  end_date: string;
  status: string;
  owner : string;
}

interface TaskData {
  todo: Task[];
  pending: Task[];
  done: Task[];
}


export function TasksWrapper() {
  const { projectId } = useProject();
  const [tasks, setTasks] = useState<TaskData>({
    todo: [],
    pending: [],
    done: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const taskData = await fetchTaskData(projectId);
      setTasks(taskData);
    };

    fetchData();
  }, []);

  return (
    <main className="flex flex-col md:flex-row justify-center">
      <TaskCard group="todo" title="A fazer" tasks={tasks.todo} setTasks={setTasks} color="b" />
      <TaskCard group="pending" title="Em progresso" tasks={tasks.pending} setTasks={setTasks}  color="y" />
      <TaskCard group="done" title="Concluído" tasks={tasks.done} setTasks={setTasks} color="g" />
    </main>
  );
}
