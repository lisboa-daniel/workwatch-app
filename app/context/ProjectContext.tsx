

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';


interface ProjectContextType {
  projectId: string;
  setProjectId: (id: string) => void;
  projectTitle: string;
  setProjectTitle: (title: string) => void;

  projectTravel: boolean;
  setProjectTravel: (param : boolean) => void;
  
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [projectId, setProjectIdState, ] = useState('');
  const [projectTitle, setProjectTitleState] = useState('');
  const [projectTravel, setProjectTravelState] = useState(false);

  const setProjectId = (id: string) => {
    setProjectIdState(id);
    localStorage.setItem('projectId', id);
  };

  const setProjectTitle = (title: string) => {
    setProjectTitleState(title);
    localStorage.setItem('projectTitle', title);
  };

  const setProjectTravel = (param: boolean) => {
    setProjectTravelState(param);
    localStorage.setItem('projectTravel', param ? 'yes' : 'no');
  }



  useEffect(() => {
    const storedProjectId = localStorage.getItem('projectId');
    const storedProjectTitle = localStorage.getItem('projectTitle');
    const storedProjectTravel = localStorage.getItem('projectTravel');

    if (storedProjectId) {
      setProjectIdState(storedProjectId);
    }
    if (storedProjectTitle) {
      setProjectTitleState(storedProjectTitle);
    }

    if (storedProjectTravel){
      let param = (storedProjectTravel == 'yes') ? true : false;
      setProjectTravelState(param);
    }


  }, []);

  return (
    <ProjectContext.Provider value={{ projectId, setProjectId, projectTitle, setProjectTitle, projectTravel, setProjectTravel}}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
