interface UpdateProjectButtonProps {
    setProjectId: (id: string) => void;
  }
  
  export default function UpdateProjectButton({ setProjectId }: UpdateProjectButtonProps) {
    const handleClick = () => {
      const newProjectId = 'new-project-id'; // Replace with the actual ID
      setProjectId(newProjectId);
    };
  
    return (
      <button onClick={handleClick} className="btn-update-project">
        Set Project ID
      </button>
    );
  }