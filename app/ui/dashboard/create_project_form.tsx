'use client';

import { Checkbox, FormControlLabel, ListItemButton, ListItemIcon } from "@mui/material";
import { useState, useEffect } from 'react';
import { Client, Project } from "@/app/lib/definitions";
import { createProject, addPeopletoProject } from "@/app/lib/actions";
import { fetchUsersData, getUserFromCookie } from "@/app/lib/data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
import clientData from '@/app/lib/clients.json';

const duplicateMemberToast= () => toast.info("Membro já adicionado!");

function handlerSave(title: string, description: string, start_date: string, end_date: string, travel: boolean, finished: boolean, client_id : string, usersToStore: string[]) {
    
    const id = '';
    const newProject: Project = {
        id,
        title,
        description,
        start_date,
        end_date,
        travel,
        finished,
        client_id
    };

    // Here you can call your createProject function or perform other actions
    const sucesssNotify = () => toast.success("Dados atualizados");
    const errorNotify = () => toast.error("Falha ao atualizar dados");
    
    createProject(newProject)
        .then(() => {
            if (usersToStore.length > 0) addPeopletoProject(title, usersToStore)
            .then(() => {
                sucesssNotify(); 
            })
            .catch((error) => {
                console.log("falha ao add pessoas no projeto");
                errorNotify();
                throw(error);
            })
        });
    
    // Handle storing the usersToStore array as needed
}

export interface ProjectMember {
    id : string,
    fullname: string
}
const meAsMember = {
            id: '',
            fullname: 'vai dar certo?'
    } as ProjectMember;
    


function formatDate(dateString: string ): string   {
    if (dateString){
        const date = new Date(dateString);
        const isoString = date.toISOString(); // Converts to UTC and returns in ISO 8601 format
        return isoString.split('T')[0]; // Extracts the date part (YYYY-MM-DD)
    }
    return '';
 

    }
      
export default function CreateProjectForm({ handleClose }: { handleClose: any }) {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [travel, setTravel] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [partinId, setPartinId] = useState('');
    const [client_id, setClientId] = useState('346367fc-24c5-4e42-880d-1cf05f44d839');
    const [partin, setPartin] = useState<{ id: string; fullname: string }[]>([]);
    const [usersToStore, setUsersToStore] = useState<string[]>([]);
    const me = getUserFromCookie();
    const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);
    const [clients, setClients] = useState<Client[]>(clientData);

    
    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch user from cookie
            const me = await getUserFromCookie();
            setSelectedMembers([me]);
            setUsersToStore([...usersToStore, me.id]);
    
            // Fetch users data
            const userData = await fetchUsersData();
            if (userData) {
              const formattedData = userData.map((row: any) => ({
                id: row.id,
                fullname: row.fullname,
              }));
              setPartin(formattedData);
              if (formattedData.length > 0) {
                setPartinId(formattedData[0].id);
              }
            } else {
              setPartin([]);
            }
          } catch (error) {
            console.error('Failed to fetch data:', error);
          }
        };
    
        fetchData();
      }, []);

    

    const handleAddPartin = () => {
        const selectedMember = partin.find(member => member.id === partinId);
        if (selectedMember && !selectedMembers.find(member => member.id === selectedMember.id)) {
            setSelectedMembers([...selectedMembers, selectedMember]);
            setUsersToStore([...usersToStore, selectedMember.id]);
        } else {
            duplicateMemberToast();
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
                <label htmlFor="title" className="block default-title-style mb-2">Criar um novo projeto</label>
            </div>

            <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    id="titulo"
                    name="titulo"
                    placeholder="Escreva um título"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
                <textarea
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    id="description"
                    name="description"
                    placeholder="Escreva uma breve descrição"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            {/* TRAVEL */}
            <div className="mb-4">
                <label htmlFor="travel" className="block text-gray-700 text-sm font-bold mb-2">Viagens</label>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={travel}
                            onChange={(e) => setTravel(e.target.checked)}
                        />
                    }
                    label="Permitir horas do trajeto da viagem"
                />
            </div>


            {/*Clientes*/}
            <div className="mb-4">
                <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">Selecione um cliente</label>
                <div className='flex p-1'>
                    <select
                        className="shadow appearance-none mr-2 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"

                        onChange={(e) => setClientId(e.target.value)}
                    >
                        {clients.map((client) => (
                            <option value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>

                </div>
            </div>
         


            {/* INTEGRANTES */}
            <div className="mb-4">
                <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">Integrantes</label>
                <div className='flex p-1'>
                    <select
                        className="shadow appearance-none mr-2 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        defaultValue={partinId}
                        onChange={(e) => setPartinId(e.target.value)}
                    >
                        {partin.map((owner) => (
                            <option key={owner.id} value={owner.id}>
                                {owner.fullname}
                            </option>
                        ))}
                    </select>

                    <button
                        className="bg-activeColor-400 hover:bg-cyanWhiteBackground-100 text-white font-bold p-2 ml-3 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleAddPartin}
                    >
                        Adicionar
                    </button>
                </div>
                <PList members={selectedMembers}/>
                
            
            </div>

            {/* INICIO E FIM */}
            <div className="mb-4">
                <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">Data de inicio</label>
                <input
                    onChange={(e) => setStartDate(formatDate(e.target.value))}
                    required
                    id="start_date"
                    name="start_date"
                    type="date"
                    placeholder="Add your comment..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">Data de fim esperada</label>
                <input
                    onChange={(e) => setEndDate(formatDate(e.target.value))}
                    
                    id="end_date"
                    name="end_date"
                    type="date"
                    placeholder="Add your comment..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>


            <div className="flex items-center">
                <button
                    type="submit"
                    
                    onClick={ () => handlerSave(title, description, start_date, end_date, travel, finished, client_id, usersToStore)}
                    className="bg-activeColor-400 hover:bg-activeSoft-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Criar
                </button>

                <button
                    type="button"
                    
                    onClick={handleClose}
                    className="bg-cancelColor-400 hover:bg-cancelColorSoft-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
                >
                    Cancelar
                </button>
            </div>

            <div>
                <ToastContainer position="bottom-right" />
            </div>
        </form>
    );
}


export function PList({members} : {members : ProjectMember[]}){

   
    return (
        <List>
          
            {members.map((member) => (
                <ListItemButton>
                <ListItemIcon>  
                    <PeopleIcon/>
                </ListItemIcon>
    
                <ListItemText key={member.id} primary={member.fullname} />
                </ListItemButton>
            ))}
               
            
        </List>
    );
}