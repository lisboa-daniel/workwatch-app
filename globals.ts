export let selectedProject: string | null = null;
export const setSelectedProject = (projectName: string) => {
    selectedProject = projectName;
};

export const getSelectedProject = () => {
    return selectedProject;
};