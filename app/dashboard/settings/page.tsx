'use client';

import { useEffect, useState } from 'react';
import { fetchMyData, fetchUsersData } from '@/app/lib/data';
import { inter } from '@/app/ui/fonts';
import UserHeader from '@/app/ui/dashboard/user-header';
import { Button } from '@/app/ui/button';
import { WrenchIcon, UsersIcon, InboxStackIcon } from '@heroicons/react/24/outline';
import { FlagIcon, BookmarkIcon, PlusCircleIcon} from '@heroicons/react/24/solid';
import UsersForm from "@/app/ui/users/user_create_form";
import UsersFormDetail from "@/app/ui/users/user_form";
import Box from '@mui/material/Box';
import Image from 'next/image';

interface UserData {
    id: string,
    fullname: string,
    email: string,
    display_role: string,
    image_path: string,
    enabled: boolean
}

const initialUsers: UserData[] = [
  
];


const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
 
};

import Modal from '@mui/material/Modal';
import clsx from 'clsx';
import { refuse } from '@/app/lib/actions';
import ProjectParamForm from '@/app/ui/settings/pjparam_form';
import { ToastContainer } from 'react-toastify';
export default function Page() {
  const [selectedPage, setSelectedPage] = useState('Gerenciar Usuarios');
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [openG, setOpenG] = useState(false);
  const openModal = (id:string) => {
    setOpenG(true);
    setUserId(id);
  }
  const handleCloseG = () => setOpenG(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUsersData();
        const formattedData = userData.map((row: any) => ({ 
            id: row.id,
            fullname: row.fullname,
            email: row.email,
            display_role: row.display_role,
            image_path: row.image_path,
            enabled: row.enabled
            
        }));

        try {
          const myData = await fetchMyData();
          if (myData){
            if (myData.role != 'admin' || (!myData.role) ){
              refuse();
            }
          }
        } catch (error) {
          
        }

        setUsers(formattedData);
    
        
        
      } catch (error) {
        console.error('Failed to fetch users data', error);
      }
    };
    fetchData();
  }, []);


  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [userid , setUserId] = useState('');
  
  return (
    <main className="p-4 flex flex-col">
      <UserHeader />
      <p className={`${inter.className} default-title-style mb-3`}>
        Administração
      </p>


      <div className="flex flex-col md:flex-row border 1 p-2">
        <aside className="w-full md:w-1/4 mb-4 md:mb-0 md:pr-4 ">
          <div className="mb-2 flex items-center">
            <UsersIcon className={`h-5 w-5 mr-2 ${selectedPage === 'Gerenciar Usuarios' ? 'text-activeColor-400' : ''}`} />
            <button 
              className={`text-nm font-bold ${selectedPage === 'Gerenciar Usuarios' ? 'text-activeColor-400' : ''}`}
              onClick={() => setSelectedPage('Gerenciar Usuarios')}
            >
              Gerenciar Usuarios
            </button>
          </div>

          <div className="mb-4 flex items-center">
            <WrenchIcon className={`h-5 w-5 mr-2 ${selectedPage === 'Configurações' ? 'text-activeColor-400' : ''}`} />
            <button 
              className={`text-nm font-bold ${selectedPage === 'Configurações' ? 'text-activeColor-400' : ''}`}
              onClick={() => setSelectedPage('Configurações')}
            >
              Configurações de parametros
            </button>
          </div>
        </aside>

        <div className="flex-1 bg-gray-100 p-4 rounded-md">
          {selectedPage === 'Gerenciar Usuarios' && (
            <div>
                <Button onClick={handleOpen} className='flex items-center justify-between w-[150px] bg-activeColor-400 p-3 mt-2 mb-3'>
                <p className={`${inter.className} text-sm text-defaultColor-100`}>Novo Usuário</p>
                <PlusCircleIcon className='text-defaultColor-100 h-5 w-5' />
                </Button>

                <Modal
                
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                  <Box sx={style} className="md:w-[800px] w-[400px] h-[600px]">
                <UsersForm/>
                </Box>

              </Modal>

              <Modal
                open={openG}
                onClose={handleCloseG}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                  <Box sx={style} className=" md:overflow-y-hidden overflow-y-scroll w-full md:mb-3 md:w-[1024px] md:mt-0 mt-3 md:h-[640px] md:p-2 ">
                <UsersFormDetail userid={userid} handleClose={handleCloseG}/>
                </Box>

              </Modal>



              {users.map(user => (
                <div key={user.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-2 bg-white mb-2 shadow rounded-md">

                <Image
                  src={user.image_path ? `/uploads${user.image_path}` : '/customers/default.png'}
                  className= "mr-2 rounded-full border-2 border-dborderColor-400 ml-2" 
                  width={52}
                  height={52}
                  alt={`${user.fullname}'s profile picture`}

                />
                  <div className="flex-1" id={user.id}>
                    
                    <p className="font-semibold">{user.fullname}</p>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-500 text-sm">Cargo: {user.display_role}</p>
                 
                  </div>
                  <div className="flex-1" id={user.id}>
                  <p className={clsx('text-gray-500', {
                      'text-green-500': user.enabled,
                      'text-red-500': !user.enabled
                    })}>Status:  {(user.enabled ? 'Ativo' : 'Não ativo')}</p>
                  </div>

                  <button className="mt-2 md:mt-0 bg-activeColor-400 hover:bg-activeColor-600 font-bold p-2 text-defaultColor-100  rounded-lg m-3" onClick={() => openModal(user.id)}>Gerenciar</button>
                   {/* <button className="mt-2 md:mt-0 bg-cancelColor-400 hover:bg-cancelColor-600 font-bold p-2 text-defaultColor-100 rounded-lg m-3" onClick={() => openModal(user.id)}>Desativar</button>*/}
                  
                </div>
              ))}
            </div>
          )}
          {selectedPage === 'Aprovações pendentes' && (
            <div>
              <p className="text-xl font-semibold">Aprovações pendentes</p>
              
            </div>
          )}
          {selectedPage === 'Configurações' && (
            <div>
              <p className="text-xl font-semibold">Configurações de parametros</p>
              <ProjectParamForm/>
            </div>
          )}
        </div>
        
      </div>
    </main>
  );
}
