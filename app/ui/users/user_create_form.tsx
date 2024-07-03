'use client';

import UserHeader from "@/app/ui/dashboard/user-header";
import { inter } from "@/app/ui/fonts";
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { fetchUserById } from '@/app/lib/data';
import { Button, LinearProgress, TextField } from "@mui/material";
import axios from 'axios';
import { User } from "@/app/lib/definitions";
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';

import { UserDetail, createUser, updateUser } from "@/app/lib/actions";
import { send } from "process";



let LTSpfp = '';

const formatDate = (date: Date): string => {
  const padToTwoDigits = (num: number): string => num.toString().padStart(2, '0');

  const day = padToTwoDigits(date.getDate());
  const month = padToTwoDigits(date.getMonth() + 1); // Months are zero-indexed in JavaScript
  const year = date.getFullYear().toString().slice(2); // Get the last two digits of the year
  const hours = padToTwoDigits(date.getHours());
  const minutes = padToTwoDigits(date.getMinutes());
  const seconds = padToTwoDigits(date.getSeconds());

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
};




const initialUsers: UserDetail[] = [];

function saveData(id : string , fullName: string , email: string , role: string , imagePath: string , phone: string , displayRole: string, enabled :boolean ){
  const sendUser: UserDetail = {
    id: id,
    fullname: fullName,
    email: email,
    role: role,
    image_path: imagePath,
    phone: phone,
    display_role: displayRole,
    password1: '',
    password2: '',
    enabled: enabled
  };



  const sucesssNotify = () => toast.success("Dados atualizados");
  const errorNotify = () => toast.error("Falha ao atualizar dados");
  const alertNotify = (str : string) => toast.error(str);

  try {
    createUser(sendUser)
    .then(() => {
      sucesssNotify();
    });
  } catch (error) {
    errorNotify();
    throw error;
  }

}


export default function UserForm() {
  const [selectedPage, setSelectedPage] = useState('Gerenciar Usuarios');
  const [users, setUsers] = useState<UserDetail[]>(initialUsers);
  
  const [id, setId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [role, setRole] = useState('');
  const [displayRole, setDisplayRole] = useState('');
  
  const [imagePath, setImagePath] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  

  useEffect(() => {
    const formattedData = [{
      id: '',
      fullname: '',
      email:'',
      role:'',
      image_path: '',
      phone: '',
      display_role: '',
      password1: '',
      password2: '',
      enabled: false
    }];
    setUsers(formattedData); 
  }, []); // Ensure this runs only once on component mount

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };
  
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    const fileName = `${fullName.toLowerCase().replace(' ', '-')}&v=${formatDate(new Date())}.png`;
    formData.append('file', file);
    formData.append('fileName', fileName);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (response.ok) {
        console.log(`image path == ${result.image_path}`);
        LTSpfp = fileName;
        setImagePath(result.image_path);
        setUploadProgress(0);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      setUploadProgress(0);
    }
  };

  return (
    <main className="p-4 w-full">
    

      <div>
        <p className="default-title-style mb-2">Criar novo usuário</p>
      </div>

      <div className={`${inter.className} shadow-xl p-4 mx-auto`}>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-4">
            <p className="default-title-style text-center md:text-left p-4">Imagem de perfil </p>      
            <Image
              src={imagePath ? `/uploads${imagePath}` : '/customers/default.png'}
              className="rounded-full w-24 h-24 md:w-48 md:h-48 object-cover mx-auto"
              alt={`${fullName}'s profile picture`}
              width={256}
              height={256}
            />
         
            <div className="flex justify-center mt-4">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="upload-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="upload-file">
                <Button variant="contained" component="span">
                  Enviar Imagem
                </Button>
              </label>
            </div>
            {uploadProgress > 0 && (
              <div className="mt-4">
                <LinearProgress variant="determinate" value={uploadProgress} />
              </div>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="p-4">
              <h2 className="default-title-style">Meus dados</h2>
              <div className="flex flex-col md:flex-row justify-between my-2">
                <div className="mr-0 md:mr-2 flex-1">
                  <label className="block text-gray-700">Nome completo:</label>
                  <input 
                    type="text" 
                    placeholder="Insira seu nome completo" 
          
                    onChange={(e) => setFullName(e.target.value)} 
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between my-2">
                <div className="mr-0 md:mr-2 flex-1">
                  <label className="block text-gray-700">Email:</label>
                  <input 
                    type="email" 
                    placeholder="Insira seu email" 
         
                    onChange={(e) => setEmail(e.target.value)} 
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-2 flex-1">
                  <label className="block text-gray-700">Celular:</label>
                  <input 
                    type="text" 
                    placeholder="(11 9____-____)" 
            
                    onChange={(e) => setPhone(e.target.value)} 
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>
              </div>

              <div className="flex justify-between my-2"> 
                <div className="flex-1">
                  <label className="block text-gray-700">Cargo:</label>
                  <input 
                    type="text" 
                    placeholder="Digite um cargo" 
                
                    onChange={(e) => setDisplayRole(e.target.value)}
               
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>
              </div>

              <div className="flex justify-between my-2"> 
                <div className="flex-1">
                  <label className="block text-gray-700">Permissão:</label>
                  <select 
                   
                
                    onChange={(e) => setRole(e.target.value)}
               
                    className="mt-1 p-2 rounded w-full" 
                  >
                      <option value={'gp'}>Gestor</option>
                      <option value={'admin'}>Administrador</option>
                      <option value={'normal'}> Comum</option>
                  </select>

                  
                </div>
              </div>
            </div>

            {/* AUTENTICAÇÃO */}

          </div>
        </div>
        <div className="flex justify-center mt-4 p-2 space-x-4">
        <button 
            onClick={() => saveData(id, fullName, email, role, imagePath, phone, displayRole,true)}
            className="text-white font-bold bg-green-600 p-2 rounded flex items-center"
            >   
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Salvar dados
          </button>
        </div>

        <ToastContainer position="top-right" />
      </div>
    </main>
  );
}
