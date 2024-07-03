import * as React from 'react';
import { FormattedHourData } from '@/app/lib/definitions';
import { fetchHoursByTaskId, fetchMyData } from '@/app/lib/data';
import HoursList from './hours_list';

interface HoursFormProps {
  handleClose: () => void;
  onSaveHours: (hours: FormattedHourData[]) => void;
}

export default function HoursForm({handleClose, onSaveHours }: HoursFormProps) {
  const [hours, setHours] = React.useState<FormattedHourData[]>([]);
  const [hourType, setHourType] = React.useState('normal'); // Default to 'normal'
  const [hourAmount, setHourAmount] = React.useState('');
  const [hourDescription, setHourDescription] = React.useState('');

  /*const handleAddHour = async () => {
    // Check if all required fields are filled
    if (!hourAmount || !hourDescription) {
      console.error('Please fill in all fields');
      return;
    }

    try {
      // Fetch user data
      const data = await fetchMyData();
      if (data) {
        const newHour: FormattedHourData = {
          id: '',
          user_id: data.user_id,
          fullname: data.fullname,
          amount: hourAmount,
          description: hourDescription,
          type: hourType
          cost : hourVal
        };

        setHours(prevHours => [...prevHours, newHour]);
        onSaveHours([...hours, newHour]);

        // Clear input fields
        setHourAmount('');
        setHourDescription('');
        setHourType('normal'); // Reset to 'normal' instead of an empty string
      }
    } catch (error) {
      console.error('Failed to add new hour:', error);
    }
  };

  const handleDeleteHour = (hourId: string | undefined) => {
    // Filter out the hour entry with the given hourId
    const updatedHours = hours.filter(hour => hour.id !== hourId);
    setHours(updatedHours);

    // Call the onSaveHours function with the updated hours state
    onSaveHours(updatedHours);
  };
*/
  return (
    <main>
     {/* <div className="mb-4">
        <label htmlFor="hamount" className="block text-gray-700 w-auto text-sm font-bold mb-2">Horas entregues</label>
        <div className='flex p-1'>
          <label className="block text-gray-700 w-autotext-sm font-bold mb-2 mr-2">Tipo de horas:</label>
          <select
            className="shadow appearance-none mr-2 border rounded w-[120px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={hourType}
            onChange={(e) => setHourType(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="travel">Viagem</option>
            <option value="extra">Extra</option>
          </select>
          <input
            type="number"
            id="hamount"
            name="hamount"
            placeholder="Horas"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={hourAmount}
            onChange={(e) => setHourAmount(e.target.value)}
          />
          <button
            className="bg-activeColor-400 hover:bg-cyanWhiteBackground-100 text-white font-bold p-2 ml-3 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleAddHour}
          >
            Adicionar
          </button>
        </div>
        <label htmlFor="hourdesc" className="mt-3 block text-gray-700 text-sm font-bold mb-2">Descrição da hora entregue</label>
        <textarea
          id="hourdesc"
          name="hourdesc"
          placeholder="Escreva uma breve descrição da hora entregue"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={hourDescription}
          onChange={(e) => setHourDescription(e.target.value)}
        />


        <label htmlFor="hourdesc" className="mt-3 block text-gray-700 text-sm font-bold mb-2">Valor</label>
        <input
          id="hourdesc"
          name="hourdesc"
          type='numeric'
          placeholder="Escreva uma breve descrição da hora entregue"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"*/
          }
         </main>
  );
}
