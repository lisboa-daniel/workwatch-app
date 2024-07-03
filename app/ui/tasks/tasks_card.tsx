'use client';

import { inter } from '@/app/ui/fonts';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import { FlagIcon, BookmarkIcon, PlusCircleIcon} from '@heroicons/react/24/solid';
import TasksForm from "./tasks_form";
import TasksFormDetail from "./tasks_form_detail";

import Link from 'next/link';
import { Interface } from 'readline';
import { init } from 'next/dist/compiled/webpack/webpack';


interface Task {
  id: string;
  title: string;
  task: string;
  start_date: string;
  end_date: string;
  status: string;
  owner : string;
}

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

interface TaskData {
  todo: Task[];
  pending: Task[];
  done: Task[];
}


interface MyTasks{
  title: string; id: string; owner: string;
}

export function TaskCard({
  title,
  color,
  tasks,
  setTasks,
  group
 
}: {
  title: string;
  color: string;
  group : string;
  tasks: { title: string; id: string; owner: string }[]; // Remove the 'flag' property from the type definition

  setTasks: (taskData: TaskData) => void;
}) {
  let bgc;
  let tc;
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);


  const rHandleOpen = (initStat: string) => {
    defaultStatus = initStat;
    setDefaultStatus(initStat);
    setOpen(true);
  }

  const handleClose = () => setOpen(false);
  let [myTasks, setMyTasks] = useState<MyTasks[]>([]);
  myTasks = tasks;

  switch (color) {
    case "b":
      bgc = "bg-cardBlue-400";
      tc = "text-cardBlue-400";
      break;
    case "y":
      bgc = "bg-cardYellow-400";
      tc = "text-cardYellow-400";
      break;
    case "g":
      bgc = "bg-cardGreen-400";
      tc = "text-cardGreen-400";
      break;
    default:
      bgc = "bg-cardBlue-400";
      tc = "text-cardBlue-400";
  }

  let [defaultStatus, setDefaultStatus] = useState('');
  return (

    
    <div className={`rounded-xl p-3s shadow-xl md:ml-4 border-2 border-blankBackground-300 w-[320px] h-full md: mb-6 `}>
      <div className={`flex items-center ${bgc} rounded-xl ml-2 mr-2 flex h-1 mt-[8px]`} />
    
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          <Box sx={style} className="md:w-[800px] w-[400px] h-[600px]">
         <TasksForm defaultStatus={defaultStatus }handleClose={handleClose}/>
        </Box>

      </Modal>


    
      <div className="flex p-4 justify-between">
        <div className="flex items-center">
          <BookmarkIcon className={`h-7 w-7 ${tc}`} />
          <p className={`${inter.className} ml-2 text-dashTitleColor-400 font-extrabold text-[20]`}>{title}</p>
        </div>
        <div>
     
     
          <IconButton onClick={() => rHandleOpen(group)} className="hover:text-transparent bg-transparent" aria-label="delete">
            <PlusCircleIcon className={`${tc}  hover:text-gray-400  h-7 w-7`} />
          </IconButton>
     
        </div>
      </div>

      <div id="cards">
        {/* Map over tasks array and render IssueCard for each task */}
        {tasks.map(task => (
          <IssueCard key={task.id} title={task.title} id={task.id} owner={task.owner} setMyTasks={setMyTasks} group={myTasks}/>
        ))}
      </div>
    </div>
  );
}


export function OpenDetail({handleOpen} : { handleOpen : any}){

  
  handleOpen();
}


export interface IssueCardProps{
 title: string; id: string; owner: string;
 setMyTasks: (taskData: MyTasks[]) => void;
 group : MyTasks[];
 
}

export function IssueCard({ title, id, owner, setMyTasks, group }: IssueCardProps) {
  const [open, setOpen] = useState(false);
  const [issueTitle, setIssueTitle] = useState(title); // State variable for the issue title
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(`issuecard gp = ${group}`)
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

  return (
    <main className={`flex flex-col rounded-lg text-sm h-full shadow-xl border-2 border-blankBackground-300 bg-blankBackground-100 m-2`}>
      <Link href="#" onClick={handleOpen} className={`flex flex-col rounded-lg text-sm h-full border-blankBackground-300 bg-blankBackground-100 hover:bg-blankBackground-200 p-2 m-2`}>
        <p className='default-title-style text-sm md:text-sm mb-3 '>{issueTitle}</p> {/* Use the state variable for the title */}
        <div className='flex justify-between text-left text-blankBackground-400'>
          <p>Dono: {owner}</p> 
          <div className="flex items-center"> {/* Wrapper div for FlagIcon */}
            
          </div>
        </div>
      </Link>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <main>
          <Box sx={style} className="md:w-[800px] w-[400px] h-[600px]">
            <TasksFormDetail id={id} handleClose={handleClose} setIssueTitle={setIssueTitle} group={group} setMyTasks={setMyTasks} /> {/* Pass the setIssueTitle function */}
          </Box>
        </main>
      </Modal>
    </main>
  );
}
