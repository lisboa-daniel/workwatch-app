'use client';

import { useEffect, useState } from 'react';
import HoursFormDetail from './hours_form_detail';
import { FormattedHourData, Task } from '@/app/lib/definitions';
import { fetchMyData, fetchTaskById, fetchUsersData, fetchUsersDataByProject } from '@/app/lib/data';
import * as React from 'react';
import {updateTaskData, addHours, deleteHours, deleteTask} from "@/app/lib/actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { group } from 'console';
import { useProject } from '@/app/context/ProjectContext';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import ConfirmationDialog from '../dashboard/confirm_dialog_delete';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'none'

  };


  
interface Tasq {
    id: string;
    title: string;
    task: string;
    start_date: string;
    end_date: string;
    status: string;
    owner : string;
  }

interface TaskData {
    todo: Tasq[];
    pending: Tasq[];
    done: Tasq[];
  }

interface MyTasks{
    title: string; id: string; owner: string;
}
  
interface TasksFormDetailProps {
  id: string;
  handleClose: () => void;
  setIssueTitle: (title :string) => void;
  setMyTasks: (taskData: MyTasks[]) => void;
  group : MyTasks[];

}
import Box from '@mui/material/Box';
function alterTaskInGroup(group : MyTasks[], cardData : MyTasks){
    //if (group.length <= 0) console.log("GROUP IS EMPTY");
    group.forEach(task => {
        //console.log(`task.id [${task.id}]== cardData.id [${cardData.id}]`)
        if (task.id == cardData.id){
            task = cardData;
        }
    });

    return group;
}



function saveData(
    id: string | undefined,
    user_id: string | undefined,
    type: string | undefined,
    summary: string | undefined,
    start_date: string | undefined,
    end_date: string | undefined,
    status: string | undefined,
    setIssueTitle: any,
    toSaveHours: FormattedHourData[],
    setMyTask: any,
    group: MyTasks[],
    hourstoDelete : FormattedHourData[]
) {

   
    const taskdata: Task = {
        id: id || '',
        project_id: '', // You might need to set this as well
        user_id: user_id || '',
        type: type || '',
        summary: summary || '',
        start_date: start_date || '',
        end_date: end_date || '',
        status: status || '',
    };

    
    

    const ng : MyTasks[] = alterTaskInGroup(group, {
        id: taskdata.id,
        title: taskdata.summary,
        owner: ''
    })
    

    setMyTask(ng);



    // Here you can use the toSaveHours array as needed
    //console.log('Saved hours:', toSaveHours);

    
    const sucesssNotify = () => toast.success("Dados atualizados");
    const errorNotify = () => toast.error("Falha ao atualizar dados");
    
    if (toSaveHours.length > 0) {
        addHours(id, toSaveHours)
            .then(() => {
                sucesssNotify();
            })
            .catch((error) => {
                console.error('Error in updating hours:', error);
                errorNotify();
            });
    } 

    if(hourstoDelete.length > 0){
        deleteHours(hourstoDelete);
    }

    updateTaskData(taskdata);
 

    //setIssueTitle(summary);
}
   
function formatDate(dateString: string | undefined): string  | undefined {
    if (dateString){
        const date = new Date(dateString);
        const isoString = date.toISOString(); // Converts to UTC and returns in ISO 8601 format
        return isoString.split('T')[0]; // Extracts the date part (YYYY-MM-DD)
    }

    return undefined;

  }



/*
function formatDate(dateStr: string | undefined): string | undefined {
    if (dateStr) {




      console.log(`pidfd2: date being formatted: ${dateStr}`);
      const date = new Date(dateStr);
      
      // Brasilia timezone offset (GMT-3)
      const timezoneOffset = -3 * 60; // Offset in minutes
  
      // Get the UTC time and adjust by the timezone offset
      const adjustedDate = new Date(date.getTime() + timezoneOffset * 60 * 1000);
  
      // Extract year, month, and day
      const year = adjustedDate.getUTCFullYear();
      const month = adjustedDate.getUTCMonth() + 1; // getUTCMonth() returns month from 0-11
      const day = adjustedDate.getUTCDate() + 1;
  
      // Ensure two digits for month and day
      const monthStr = month < 10 ? '0' + month : month.toString();
      const dayStr = day < 10 ? '0' + day : day.toString();
  
      return `${year}-${monthStr}-${dayStr}`;
    }
    return undefined;
}
  */
  



export default function TasksFormDetail({ id, handleClose, setIssueTitle, setMyTasks, group }: TasksFormDetailProps) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleCloseD = () => setOpen(false);
    const { projectId } = useProject();


    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    let [allowEdit, setAllowEdit] = useState<boolean>(false);   
    const errorNotify = () => toast.error("Falha ao atualizar dados");
    const [toSaveHours, setToSaveHours] = React.useState<FormattedHourData[]>([]);
    //console.log(`detail gp = `);
    //console.log({group});
    const handleSaveHours = (hours: FormattedHourData[]) => {
        // Update the toSaveHours state in the parent component
        setToSaveHours(hours);
    };
   
    const [task, setTask] = useState<Task>();
    let [ownerId, setOwnerId] = useState('');
    let [statusValue, setstatusValue ] = useState('');

   

    const [owners, setOwners] = useState<{ id: string; fullname: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    let [hourstoDelete, setHourstoDelete] = React.useState<FormattedHourData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            let myData = await fetchMyData();
            try {
               
                if (myData && (myData.role == 'admin' || myData.role == 'gp' ) ) {
                  
                  allowEdit= true;
                  setAllowEdit(true);
                  setIsAdmin(true);
                  
                } else {
                  setIsAdmin(false);
                }
              } catch (error) {
                console.error('Failed to fetch data', error);
              }
            
         

            try {
                const taskData = await fetchTaskById(id);
             
                if (taskData) {
                    setTask(taskData);
                    setstatusValue(taskData.status);
                    setOwnerId(taskData.user_id);
                    console.log(`ownerid = ${ownerId}`)
                    if (taskData.user_id == myData.user_id){
                        allowEdit = true;
                        setAllowEdit(true);
                    }
                    
                } else {
                    setError('Task not found');
                }
            } catch (err) {
                setError('Failed to fetch task data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await fetchUsersDataByProject(projectId);
                if (userData) {
                    const formattedData = userData.map((row: any) => ({
                        id: row.id,
                        fullname: row.fullname,
                    }));
                    setOwners(formattedData);

                    
                    if (formattedData.length > 0) {
                        setOwnerId(task ? task.user_id: '');         
                      
                    }

                    
                } else {
                    setOwners([]);
                }
            } catch (error) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }


  
  return (
    <form>
        
        <div className="mb-4">
            <label htmlFor="title" className="block default-title-style mb-2">Detalhe da tarefa</label>
        </div>

        <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
            <textarea
            id="description"
            name="description"
            placeholder="Escreva uma breve descrição"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 disabled:text-gray-400 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={task?.summary}
            onChange={(e) => task && (task.summary = e.target.value)}
            disabled={!allowEdit}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={statusValue}
            onChange={(e) => task && (setstatusValue(e.target.value))}
            disabled={!allowEdit}
            >
            <option value="todo">A fazer</option>
            <option value="pending">Em progresso</option>
            <option value="done">Concluido</option>
            </select>
        </div>

        <div className="mb-4">
        <label htmlFor="owner" className="block text-gray-700 text-sm font-bold mb-2">Dono</label>
        <select
          id="owner"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={ownerId}
          disabled={!allowEdit}
          onChange={(e) => setOwnerId(e.target.value)}
        >
           

          {owners.map((owner) => (
            <option value={owner.id}>
              {owner.fullname}
            </option>
          ))}

          
        </select>
      </div>

         <HoursFormDetail disabled={false} task_id={id} handleClose={handleClose} onSaveHours={handleSaveHours} hourstoDelete={hourstoDelete}  />


        <div className="mb-4">
            <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">Data de Inicio</label>
            <input
            id="start_date"
            name="start_date"
            type="date"
            placeholder="Add your comment..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400 "
            defaultValue={formatDate(task?.start_date || '')}
            onChange={(e) => task && (task.start_date = e.target.value)}
            disabled={!allowEdit}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">Data de fim</label>
            <input
            id="end_date"
            name="end_date"
            type="date"
            placeholder="Add your comment..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400 "
            defaultValue={formatDate(task?.end_date || '')}
            onChange={(e) => task && (task.end_date = e.target.value)}
            disabled={!allowEdit}
            />
        </div>

        <div className="flex w-auto">
            <button
            className="bg-cardGreen-400 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => saveData(id,ownerId, task?.type, task?.summary, formatDate(task?.start_date), formatDate(task?.end_date), statusValue, setIssueTitle, toSaveHours, setMyTasks, group, hourstoDelete)}
            disabled={false}
            >
            Salvar
            </button>


            <button
            className="bg-red-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
            type="button"
            onClick={handleClose}
            >
            Fechar
            </button>



            { (isAdmin || allowEdit) && (          <button
            className="bg-red-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
            type="button"
            onClick={handleOpen}
            >
            Deletar <DeleteIcon />
            </button>)}
  
            </div>

            <Modal
                open={open}
                onClose={handleCloseD}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="w-[300px] h-[auto]">
                   <ConfirmationDialog handleClose={handleCloseD} id={id} message='Tem certeza que deseja deletar?'/>
                </Box>

            </Modal>

            
            <div>
                <ToastContainer position="bottom-right" />
            </div>

           
    </form>
   

  );
}
