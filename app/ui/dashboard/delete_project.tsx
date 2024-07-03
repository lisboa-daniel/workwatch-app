import { deleteProject } from "@/app/lib/actions";


interface ConfirmationDialogProps {
    projectId : string;
    handleClose: () => void;
    projectName: string;
  }

  function handleDelete(id : string){
    try {
        deleteProject(id);
    } catch (error) {
        console.log(error);
    }
    
}

export  function DeleteProjectConfirm({ projectName,projectId, handleClose }: ConfirmationDialogProps) {
    return(
        <main className=''>
            <div className='  m-4 w-full'>
                    <p> Tem certeza que deseja deletar o projeto <br/>[<b>{projectName}]</b>? </p>
                   
            </div>   

            <div className=' flex-col  justify-center '>
            <p className="text-sm"> * Ação irreversível * </p>
                   
            </div>        


           
                    
            <div className='flex  justify-center mt-6'>
                
                <button
                className="bg-green-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
                type="button"
                onClick={() => handleDelete(projectId)}
                >
                Sim
               </button>

               <button
                    className="bg-red-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
                    type="button"
                    onClick={handleClose}
                    >
                    Não
                </button>
                
                </div>

            
        </main>

    );
}






