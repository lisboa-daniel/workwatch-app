'use client';

import { useEffect, useState } from 'react';
import HoursForm from './hours_form';
import { FormattedHourData, Task } from '@/app/lib/definitions';
import { fetchTaskById, fetchUsersData, fetchUsersDataByProject } from '@/app/lib/data';
import * as React from 'react';
import {updateTaskData, addHours, createTask} from "@/app/lib/actions";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useProject } from '@/app/context/ProjectContext';
interface TasksFormDetailProps {
  id: string;
  handleClose: () => void;
  setIssueTitle: (title :string) => void;
}


function saveData(
    project_id : string,
    user_id : string,
    type : string,
    summary : string,
    start_date : string,
    end_date : string,
    status : string
) {

    const taskData = {
        id : '',
        project_id : project_id,
        user_id : user_id,
        type : type,
        summary : summary,
        start_date : start_date,
        end_date : end_date,
        status : status
    }
    // Here you can use the toSaveHours array as needed
    //console.log('Saved hours:', toSaveHours);
    const sucesssNotify = () => toast.success("Tarefa criada");
    const errorNotify = () => toast.error("Falha ao atualizar dados");
""
    try {
        createTask(taskData)
        .then(() => {
            sucesssNotify();
        });

    } catch (error) {
        errorNotify();
        throw error;
    }
   
}
   

function formatDate(dateString: string | undefined): string  | undefined {
    if (dateString){
        const date = new Date(dateString);
        const isoString = date.toISOString(); // Converts to UTC and returns in ISO 8601 format
        return isoString.split('T')[0]; // Extracts the date part (YYYY-MM-DD)
    }

    return undefined;

  }
  
  


interface TasksFormProps {
    handleClose: () => void;
    defaultStatus : string;
  }
export default function TasksForm( {handleClose, defaultStatus} : TasksFormProps){

    const {projectId} = useProject();

   

    const errorNotify = () => toast.error("Falha ao atualizar dados");
    const [toSaveHours, setToSaveHours] = React.useState<FormattedHourData[]>([]);

    const handleSaveHours = (hours: FormattedHourData[]) => {
        // Update the toSaveHours state in the parent component
        setToSaveHours(hours);
    };


    const [project_id, setProjectId] = useState<string>(projectId);
    //const [user_id, setUserId] = useState<string>('');
    const [type, setType] = useState<string>('Task');
    const [summary, setSummary] = useState<string>('');
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [status, setStatus] = useState<string>(defaultStatus);
    const [ownerId, setOwnerId] = useState('');
    
    
    const [owners, setOwners] = useState<{ id: string; fullname: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    

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
                        setOwnerId(formattedData[0].id);
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
            <label htmlFor="title" className="block default-title-style mb-2">Criar uma tarefa</label>
        </div>

        <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
            <textarea
            id="description"
            name="description"
            placeholder="Escreva uma breve descrição"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            
            onChange={(e) => setSummary(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
            <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={defaultStatus}
            onChange={(e) => setStatus(e.target.value)}
            >
            <option value="todo">A fazer</option>
            <option value="pending">Em progresso</option>
            <option value="done">Feito</option>
            </select>
        </div>

        <div className="mb-4">
        <label htmlFor="owner" className="block text-gray-700 text-sm font-bold mb-2">Dono</label>
        <select
          id="owner"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          
          onChange={(e) => setOwnerId(e.target.value)}
        >
           

          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.fullname}
            </option>
          ))}

          
        </select>
      </div>


        <div className="mb-4">
            <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">Data de Inicio</label>
            <input
            id="start_date"
            name="start_date"
            type="date"
            placeholder="Add your comment..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            
            onChange={(e) => setStartDate(e.target.value)}
            />
        </div>

        <div className="mb-4">
            <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">Data de fim esperada</label>
            <input
            id="end_date"
            name="end_date"
            type="date"
            placeholder="Add your comment..."
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            
            onChange={(e) => setEndDate(e.target.value)}
            />
        </div>

        <div className="flex w-auto">
            <button
            className="bg-activeColor-400 hover:bg-activeSoft-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => saveData(project_id, ownerId, type, summary, start_date,end_date,status)}
            >
            Criar
            </button>


            <button
            className="bg-red-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
            type="button"
            onClick={handleClose}
            >
            Fechar
            </button>
            </div>

            <div>
                <ToastContainer position="bottom-right" />
            </div>

           
    </form>
   

  );
}
