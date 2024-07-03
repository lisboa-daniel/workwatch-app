'use client';

import UserHeader from "@/app/ui/dashboard/user-header";
import { inter } from "@/app/ui/fonts";
import { CheckCircleIcon,  } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { fetchUserByIdValue, fetchUserById } from '@/app/lib/data';
import { Button, Checkbox, FormControlLabel, LinearProgress, TextField } from "@mui/material";
import axios from 'axios';
import { User } from "@/app/lib/definitions";
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';


import { updateUser } from "@/app/lib/actions";
import { send } from "process";

export interface UserDetail {
  id: string;
  fullname: string;
  email: string;
  role: string;
  image_path: string;
  phone: string;
  display_role: string;
  password1 : string;
  password2 : string;
  enabled: boolean;
}

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



export function UploadIcon(){
  return (
    <div className="mr-2 ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
    </div>
  );

}



function saveData(id : string , fullName: string , email: string , role: string , imagePath: string , phone: string , displayRole: string, password1 : string, password2 : string, enabled :boolean ){




  const sendUser: UserDetail = {
    id: id,
    fullname: fullName,  // Set other necessary properties accordingly
    email: email,
    role: role,
    image_path: imagePath,
    phone: phone,
    display_role: displayRole,
    password1 : password1,
    password2 : password2,
    enabled: enabled

  };

  const button = document.getElementById('btn_button');

  button?.setAttribute('disabled','true');


  const sucesssNotify = () => toast.success("Dados atualizados");
  const errorNotify = () => toast.error("Falha ao atualizar dados");
  const alertNotify = (str : string) => toast.error(str);
  let pass = true;

  if ( (password1 != '' && password1)  || (password2 != '' && password2) ){
    if (!(
      verifyPassword(password1, password2)
    )) {
      alertNotify("As senhas não conferem");
      pass = false;
    }
  }
 
  if (pass){
    try {
      updateUser(sendUser, 'settings')
      .then(() => {
        sucesssNotify();
        button?.setAttribute('disabled','false');
      });
    } catch (error) {
      errorNotify();
      button?.setAttribute('disabled','false');
      throw error;
    }
  }

  button?.setAttribute('disabled','false');

  

  
 
 
}


function verifyPassword(str1 : string, str2 : string):boolean{
 return str1==str2;
}


export default function UserFormDetail( {userid, handleClose} :{userid: string, handleClose: () => void}) {

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

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [enabled, setEnabled] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserByIdValue(userid);
        if (userData) {
          const formattedData = userData.map((row: any) => ({
            id: row.id,
            fullname: row.fullname,
            email: row.email,
            role: row.role,
            image_path: row.image_path,
            phone: row.phone,
            display_role: row.display_role,
            password1: '',
            password2: '',
            enabled: row.enabled
          }));

          setUsers(formattedData); 
          if (formattedData.length > 0) {
            setFullName(formattedData[0].fullname);
            setEmail(formattedData[0].email);
            setPhone(formattedData[0].phone);
            setRole(formattedData[0].role);
            setImagePath(formattedData[0].image_path);
            setId(formattedData[0].id);
            setDisplayRole(formattedData[0].display_role);
            setEnabled(formattedData[0].enabled);
            
          }
        } else {
          setUsers(initialUsers); 
        }
      } catch (error) {
        console.error('Failed to fetch users data', error);
      }
    };
    fetchData();
  }, []);

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
    formData.append('fileName', fileName);  // Similar to the other system's approach
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      
      if (response.ok) {
        console.log(`image path == ${result.image_path}`);
        LTSpfp = fileName;
        setImagePath(result.image_path);  // Assuming the server returns the path of the uploaded file
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
    <main className="p-4 w-full h-full">

      <div>
        <p className="default-title-style mb-2">Alterar usuário</p>
      </div>

      <div className={`${inter.className} w-full h-full text-sm shadow-xl p-4 mx-auto`}>
        <div className="flex flex-col md:flex-row ">
          <div className="flex-1 p-4">
            <p className="default-title-style text-center md:text-left p-2">Imagem de perfil </p>      
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
                <Button variant="contained" component="span" className="text-white font-bold bg-activeColor-400 hover:bg-activeSoft-400 p-2 rounded flex items-center">
                  <UploadIcon /> Enviar Imagem
                </Button>
              </label>
            </div>
            {uploadProgress > 0 && (
              <div className="mt-4">
                <LinearProgress variant="determinate" value={uploadProgress} />
              </div>
            )}
          </div>
          <div className="flex-1 p-2">
            <div className="">
              <h2 className="default-title-style">Meus dados</h2>
              <div className="flex flex-col md:flex-row justify-between my-2">
                <div className="mr-0 md:mr-2 flex-1">
                  <label className="block text-gray-700">Nome completo:</label>
                  <input 
                    type="text" 
                    placeholder="Insira seu nome completo" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between my-2">
                {/* email */}
                <div className="flex-1">
                  <label aria-label="edit_cargo" className="block text-gray-700">Cargo:</label>
                  <input 
                    type="text" 
                    aria-label="edit_cargo"
                    id="edit_cargo"
                    name="cargo"
                    placeholder="Seu cargo" 
                    defaultValue={displayRole} 
                    onChange={(e) => setDisplayRole(e.target.value)}
                     
                    className="mt-1 p-2 rounded w-full text-nm md:text-sm" 
                  />
                <label aria-label="edit_cargo" className="block text-gray-700">Permissão:</label>
                <select 
                   
                  value={role}
                   onChange={(e) => setRole(e.target.value)}
              
                   className="mt-1 p-2 rounded w-full" 
                 >
                     <option value={'gp'}>Gestor</option>
                     <option value={'admin'}>Administrador</option>
                     <option value={'normal'}> Comum</option>
                 </select>

                </div>

                <div className="mt-2 md:mt-0 ml-0 md:ml-2 flex-1">
                  <label className="block text-gray-700">Celular:</label>
                  <input 
                    type="text" 
                    placeholder="(11 9____-____)" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>
              </div>

              <div className="flex justify-between my-2"> 

                <div className="mr-0 md:mr-2 flex-1">         
                  <label className="block text-gray-700">Email:</label>
                  <input 
                    type="email" 
                    placeholder="Insira seu email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="mt-1 p-2 rounded w-full" 
                  />
                </div>


              </div>


              <FormControlLabel
                    control={
                        <Checkbox
                            checked={enabled}
                            
                            onChange={(e) => setEnabled(e.target.checked)}
                        />
                    }
                    label="Usuário ativo"

                />
            </div>

            {/* AUTENTICAÇÃO */}
            <div className="p-0 mt-2">
              <h2 className="default-title-style">Autenticação</h2>
              <div className="flex flex-col md:flex-row justify-between my-2">
                <div className="mr-0 md:mr-2 flex-1">
                  <label className="block text-gray-700">Nova senha:</label>
                  <input id="password1" onChange={(e) => setPassword1(e.target.value) } type="password" placeholder="Insira sua nova senha" className="mt-1 p-1 rounded w-full text-xs" />
                </div>
                <div className="mt-2 md:mt-0 ml-0 md:ml-2 flex-1">
                  <label className="block text-gray-700">Confirmar senha</label>
                  <input id="password2" onChange={(e) => setPassword2(e.target.value) } type="password" placeholder="Confirme sua nova senha" className="mt-1 p-1 text-xs rounded w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2 p-2 space-x-4">
            <button 
                onClick={() => saveData(id, fullName, email, role, imagePath, phone, displayRole, password1, password2, enabled)}
                className="text-white font-bold bg-activeColor-400 hover:bg-activeSoft-400 p-2 rounded flex items-center disabled:bg-activeSoft-400"
                id="btn_save"
                >   
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Salvar dados
               
            </button>

           
            <button
            className="bg-red-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
            type="button"
            onClick={handleClose}
            >
            Fechar
            </button>
        </div>

        <ToastContainer position="top-right" />
      </div>

     
    </main>
  );
}
