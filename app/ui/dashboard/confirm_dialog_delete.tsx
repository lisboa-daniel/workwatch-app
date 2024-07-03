import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { deleteTask } from '@/app/lib/actions';


interface ConfirmationDialogProps {
    message: string;
    handleClose: () => void;
    id: string;
  }

  function handleDelete(id : string){
    console.log('handle delete');
    deleteTask(id);
}

export default function ConfirmationDialog({message, handleClose, id} : ConfirmationDialogProps){
    return(
        <main className=''>
            <div className='flex  justify-center '>
                    <p>{message}</p>
            </div>        

            <div className='flex  justify-center mt-6'>
                
                <button
                className="bg-green-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
                type="button"
                onClick={() => handleDelete(id)}
                >
                Sim
               </button>

               <button
                    className="bg-red-500 hover:bg-cyanWhiteBackground-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-3 "
                    type="button"
                    onClick={handleClose}
                    >
                    Não
                </button>
                
                </div>

            
        </main>

    );
}