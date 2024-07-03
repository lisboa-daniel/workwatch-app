'use client';


import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CreateProjectForm from '@/app/ui/dashboard/create_project_form';
import CardWrapper from '@/app/ui/dashboard/project-cards';
import CircleIcon from '@mui/icons-material/Circle';
import * as React from 'react';
import { FlagIcon, BookmarkIcon, PlusCircleIcon} from '@heroicons/react/24/solid';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import TasksFormDetail from "@/app/ui/tasks/tasks_form_detail";


import {Button} from '@/app/ui/button';

import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons'


import { inter } from '@/app/ui/fonts';
import UserHeader from '@/app/ui/dashboard/user-header';
import { fetchMyData } from '@/app/lib/data';

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




export default function Page() {

  const [openNew, setOpenNew] = useState(false);
  const handleOpenNew = () => setOpenNew(true);
  const handleCloseNew = () => setOpenNew(false);

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const myData = await fetchMyData();
        if (myData && myData.role === 'admin' || myData.role =='gp') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main >

      <UserHeader/>
      
      <div className='flex items-center'>

     
        <p className={`${inter.className} mb-4 text-xl md:text-2xl font-extrabold text-dashTitleColor-400 mr-8`}>
          Projetos participantes
        </p>
      
        {isAdmin && (
        <Button  className='flex items-center justify-between w-[150px] bg-activeColor-400 p-3 mt-2 mb-3' onClick={handleOpenNew}>
        <p className={`${inter.className} text-sm text-defaultColor-100`}>Novo projeto</p>
        <PlusCircleIcon className='text-defaultColor-100 h-5 w-5' />
        </Button>
        )}

      </div>
     

      <p className={`${inter.className} mb-4 text-normal font-medium text-dashTitleColor-400`}> 
            <CircleIcon className='h-2 w-2'/> Selecione um projeto:
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {<CardWrapper />}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      <Modal
          open={openNew}
          onClose={handleCloseNew}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
            <Box sx={style} className="md:w-[800px] w-[400px] h-[600px]">
          <CreateProjectForm handleClose={handleCloseNew}/>
          </Box>

        </Modal>

      </div>
    </main>
  );
}