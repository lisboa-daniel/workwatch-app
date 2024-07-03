'use client';

import { Checkbox, FormControlLabel, IconButton, ListItemButton, ListItemIcon } from "@mui/material";
import { useState, useEffect } from 'react';
import { Project } from "@/app/lib/definitions";
import { createProject, addPeopletoProject, updateProject, removePeopleOfProject } from "@/app/lib/actions";
import { fetchProjectById, fetchProjectMembersData, fetchUsersData, getUserFromCookie } from "@/app/lib/data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import PeopleIcon from '@mui/icons-material/People';
import {formatDate} from '@/app/lib/utils';
import clients from '@/app/lib/clients.json';
const duplicateMemberToast= () => toast.info("Membro já adicionado!");

import DeleteIcon from '@mui/icons-material/Delete';


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
  

function handlerSave(id:string, title: string, description: string, start_date: string, end_date: string, travel: boolean, finished: boolean, client_id : string, usersToStore: string[], usersToDelete : string[] ) {
    
    console.log(`my client id new ${client_id}`);


    const update: Project = {
        id,
        title,
        description,
        start_date,
        end_date,
        travel,
        finished,
        client_id,
    };



    // Here you can call your createProject function or perform other actions
    const sucesssNotify = () => toast.success("Dados atualizados");
    const errorNotify = () => toast.error("Falha ao atualizar dados");
    
    updateProject(update)
        .then(() => {
             addPeopletoProject(title, usersToStore)
             .then(() => {
                removePeopleOfProject(title, usersToDelete)
             })
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
    fullname: string,
    aintAllow: boolean
}
const meAsMember = {
            id: '',
            fullname: '',
            aintAllow: false
    } as ProjectMember;
    
export default function ProjectForm({projectid, handleClose, aintAllow }: {projectid: string, handleClose: any , aintAllow : boolean}) {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [start_date, setStartDate] = useState<string>('');
    const [end_date, setEndDate] = useState<string>('');
    const [travel, setTravel] = useState<boolean>(false);
    const [finished, setFinished] = useState<boolean>(false);
    const [client_id, setClientId] = useState<string>('');
    const [partinId, setPartinId] = useState('');
    const [partin, setPartin] = useState<{ id: string; fullname: string ; aintAllow: boolean}[]>([]);


    const [usersToStore, setUsersToStore] = useState<string[]>([]);
    const me = getUserFromCookie();
    const [selectedMembers, setSelectedMembers] = useState<ProjectMember[]>([]);
    let [membersDelete, setMembersDelete] = useState<string[]>([]);




    function handleDeleteMember(id :string){
        const memberGone = selectedMembers.find(member => member.id == id);
        if (memberGone){
            
            membersDelete.push(memberGone.id);

        }
        console.log(`to delete id: ${id}`);
        const updatedMembers = selectedMembers.filter(member => member.id != id);
        setSelectedMembers(updatedMembers);

    
    
    }


    useEffect(() => {
        const fetchData = async () => {
          try {
          
    
            // Fetch users data
            const projectMembers = await fetchProjectMembersData(projectid);
            setSelectedMembers(projectMembers);
            
            const projectData = await fetchProjectById(projectid);
            if (projectData){
              const data = projectData[0];
              if (data){
                setTitle(data.title);
                setDescription(data.description);
                setStartDate(formatDate(data.start_date));
                setEndDate(formatDate(data.end_date));
                setTravel(data.travel);
                setFinished(data.finished);
                setClientId(data.client_id);
             
    
              }
            }

            // Fetch users data for combobox
            const userData = await fetchUsersData();
            if (userData) {
              const formattedData = userData.map((row: any) => ({
                id: row.id,
                fullname: row.fullname,
                aintAllow: (row.role == 'admin')
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
                <label htmlFor="title" className="block default-title-style mb-2">Detalhes do projeto</label>
            </div>

            <div className="mb-4">
                <label htmlFor="titulo" className="block text-gray-700 text-sm font-bold mb-2">Título</label>
                <input
                    onChange={(e) => setTitle(e.target.value)}
                    id="titulo"
                    name="titulo"
                    placeholder="Escreva um título"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400" required
                    defaultValue={title}
                    disabled={!aintAllow}

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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
                    defaultValue={description}
                    disabled={!aintAllow}
                />
            </div>

            {/* TRAVEL */}
            <div className="mb-4">
                <label htmlFor="travel" className="block text-gray-700 text-sm font-bold mb-2">Viagens</label>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={travel}
                            disabled={!aintAllow}
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
                        disabled={!aintAllow}
                        className="shadow appearance-none mr-2 border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={client_id}
                        onChange={(e) => setClientId(e.target.value)}
                    >
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
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
                        disabled={!aintAllow}
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
                        disabled={!aintAllow}
                        className="bg-activeColor-400 hover:bg-cyanWhiteBackground-100 text-white font-bold p-2 ml-3 rounded focus:outline-none focus:shadow-outline disabled:bg-cyanWhiteBackground-100"
                        type="button"
                        onClick={handleAddPartin}
                    >
                        Adicionar
                    </button>
                </div>
                <PList members={selectedMembers} handleDeleteMember={handleDeleteMember} disabled={aintAllow}/>
                
            
            </div>

            {/* INICIO E FIM */}
            <div className="mb-4">
                <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">Data de inicio</label>
                <input
                    disabled={!aintAllow}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    value={(start_date)}
                    id="start_date"
                    name="start_date"
                    type="date"
                    placeholder="Add your comment..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">Data de fim esperada</label>
                <input
                    disabled={!aintAllow}
                    onChange={(e) => setEndDate(e.target.value)}
                    value={(end_date)}
                    id="end_date"
                    name="end_date"
                    type="date"
                    placeholder="Add your comment..."
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
                />
            </div>

            {/* STATUS */}
            <div className="mb-4">
                <label htmlFor="finished" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <FormControlLabel
                    control={
                        <Checkbox
                            disabled={!aintAllow}
                            checked={finished}
                            onChange={(e) => setFinished(e.target.checked)}
                        />
                    }
                    label="Projeto Terminado?"
                />
            </div>

            <div className="flex items-center">
                
                {aintAllow && (<button
                    type="submit"
                    
                    onClick={ () => handlerSave(projectid,title, description, start_date, end_date, travel, finished, client_id, usersToStore, membersDelete)}
                    className="bg-activeColor-400 hover:bg-activeSoft-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Salvar
                </button>)}
                

                <button
                    type="button"
                    
                    onClick={handleClose}
                    className="bg-cancelColor-400 hover:bg-cancelColorSoft-100 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
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


export function PList({members, handleDeleteMember, disabled} : {members : ProjectMember[], handleDeleteMember : any, disabled:boolean}){
    
   
    return (
        <List>
          
            {members.map((member) => (
                <ListItemButton>
                <ListItemIcon>  
                    <PeopleIcon/>
                </ListItemIcon>
    
                <ListItemText key={member.id} primary={member.fullname} />

                <IconButton edge="end" aria-label="delete" disabled={!disabled} onClick={() => handleDeleteMember(member.id)}>
                    <DeleteIcon />
                </IconButton>
                </ListItemButton>
            ))}
               
            
        </List>
    );
}