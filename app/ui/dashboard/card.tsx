// card.tsx
'use client';


import { inter } from '@/app/ui/fonts';
import { UserGroupIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useProject } from '@/app/context/ProjectContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CreateProjectForm from './create_project_form';
import ProjectForm from '@/app/ui/dashboard/project_form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteProjectConfirm } from './delete_project';

const style2 = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'none'

};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'scroll'
};

export function Card({
  title,
  description,
  id,
  admin,
  travel,
}: {
  title: string;
  description: string;
  id: string;
  admin: boolean;
  travel : boolean;
}) {
  const Icon = UserGroupIcon;
  const { setProjectId, setProjectTitle, setProjectTravel } = useProject();
  const router = useRouter();

  const handleClick = () => {
    setProjectId(id);
    setProjectTitle(title);
    setProjectTravel(travel);
    
    router.push('/dashboard/overview');
  };

  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);


  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleDelete = () => {
    setOpenDelete(true);

  }
  


  return (
    <div className="rounded-xl p-3 shadow-xl md:ml-4 border-2 border-blankBackground-300 w-[256px] h-full md:mb-6">
      <div className="flex p-4 justify-between">
        {Icon ? <Icon className="h-7 w-7 text-activeColor-400" /> : null}
        <p className={` ${inter.className} ml-2 text-activeColor-400 font-extrabold text-[20]`}>{title}</p>
      <div>
        <button onClick={handleOpenEdit} className='text-activeColor-400 h-6 w-6 ml-2'>
          {admin && (
            <PencilIcon/>
          )
         
          
          }

          { !admin && 
          (
            <VisibilityIcon/>
          )}
          </button>

 




        </div>
  
      </div>
      <Modal
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style} className="md:w-[800px] w-[400px] h-[600px]">
          <ProjectForm projectid={id} handleClose={handleCloseEdit} aintAllow={admin}/>
          </Box>

        </Modal>


        <Modal
          open={openDelete}
          onClose={handleCloseEdit}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style2} className="w-[300px] h-[auto]">

          <DeleteProjectConfirm projectName={title} projectId={id} handleClose={handleCloseDelete} />


          </Box>

        </Modal>

 

      <p className="rounded-xl bg-white px-4 py-4 text-left text-sm text-gray-600 h-24 overflow-hidden mb-4">
        {description}
      </p>
      <div className="flex justify-center">
        <button onClick={handleClick} className="flex p-2 bg-activeColor-400 font-semibold rounded-xl m-2 text-defaultColor-100 text-sm">
          Selecionar
        </button>

        
      </div>
      {admin && (
              <button onClick={handleDelete} 
              className='text-activeColor-400 h-6 w-6 ml-2'>     
                    <DeleteIcon/>   
              </button>
      )
    }

    </div>
  );
}
