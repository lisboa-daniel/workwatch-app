
import { useProject } from '@/app/context/ProjectContext';
import { inter } from '@/app/ui/fonts';


export default function PathBurguer({nextpath} : {nextpath : string | null} ){
    const { projectId, setProjectId, projectTitle, setProjectTitle } = useProject();
    return <>
        <p className={`${inter.className} mb-2 text-sm md:text-sm font-extrabold text-dashTitleColor-400`}>
          Você está em: Projetos {'>'} {projectTitle} {nextpath ?  ' > ' + nextpath : ''}
      </p>
    </>
}