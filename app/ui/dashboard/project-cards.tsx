'use client';

import { useEffect, useState } from 'react';
import { fetchMyData, fetchProjectsData } from "@/app/lib/data";
import { Card } from "@/app/ui/dashboard/card";

interface Project {
  id: string;
  title: string;
  description: string;
  travel: boolean;
}

export default function CardWrapper() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  let [isAdmin, setIsAdmin] = useState(false);
  let [isGp, setGp] = useState(false);

  
  useEffect(() => {
    const fetchData = async () => {

      try {
        const myData = await fetchMyData();
        if (myData.role && myData.role === 'admin') {
          isAdmin = true;
          setIsAdmin(true);
          setGp(true);
        } else {
          isAdmin = false;
          setIsAdmin(false);

          
        }

        if (myData.role && myData.role === 'gp'){
          setGp(true);
        }

        try {
          const projectsData = await fetchProjectsData(isAdmin);
          if (projectsData) setProjects(projectsData); // Fallback to an empty array if undefined
        } catch (err) {
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }

      


    
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Falha ao atualizar os projetos tente mais tarde.</p>;
  }

  if (projects.length === 0) {
    return <p>Tudo limpo. Você não está associado a nenhum projeto!</p>;
  }

  return (
    <>
      {projects.map((project, index) => (
        <Card key={index} id={project.id} title={project.title} description={project.description} admin={isAdmin || isGp} travel={project.travel}/>
      ))}
    </>
  );
}
