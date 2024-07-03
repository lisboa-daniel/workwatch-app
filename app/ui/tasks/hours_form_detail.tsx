import * as React from 'react';
import { FormattedHourData } from '@/app/lib/definitions';
import { fetchHoursByTaskId, fetchMyData } from '@/app/lib/data';
import HoursList from './hours_list';
import { useProject } from '@/app/context/ProjectContext';

interface HoursFormProps {
  task_id: string;
  handleClose: () => void;
  onSaveHours: (hours: FormattedHourData[]) => void;
  hourstoDelete: FormattedHourData[];
  disabled: boolean;
}

export default function HoursFormDetail({ task_id, handleClose, onSaveHours, hourstoDelete, disabled }: HoursFormProps) {
  const [hours, setHours] = React.useState<FormattedHourData[]>([]);
  const [hourType, setHourType] = React.useState('normal'); // Default to 'normal'
  const [hourAmount, setHourAmount] = React.useState('');
  const [hourDescription, setHourDescription] = React.useState('');
  const [hourval, setHourval] = React.useState(0);
  const [toSaveList, setToSaveList] = React.useState<FormattedHourData[]>([]);
  const [hourvalEnabled, setHourvalEnabled] = React.useState(false);
  const { projectTravel} = useProject();
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const hoursData = await fetchHoursByTaskId(task_id);
        if (hoursData) {
          setHours(hoursData);
        }
      } catch (error) {
        console.error('Failed to fetch hours data:', error);
      }
    };

    fetchData();
  }, [task_id]);

  React.useEffect(() => {
    if (hourType === 'travel') {
      setHourvalEnabled(false);
    } else {
      setHourvalEnabled(true);
    }
    setHourval(0);
  }, [hourType]);

  const handleAddHour = async () => {
    if (!hourAmount || !hourDescription) {
      console.error('Please fill in all fields');
      return;
    }

    try {
      const data = await fetchMyData();
      if (data) {
        const newHour: FormattedHourData = {
          id: '',
          user_id: data.user_id,
          fullname: data.fullname,
          amount: hourAmount,
          description: hourDescription,
          type: hourType,
          cost: hourval
        };

        setHours(prevHours => [...prevHours, newHour]);
        setToSaveList(prevToSaveList => [...prevToSaveList, newHour]);
        onSaveHours([...toSaveList, newHour]);

        setHourAmount('');
        setHourDescription('');
        setHourType('normal');
      }
    } catch (error) {
      console.error('Failed to add new hour:', error);
    }
  };

  const handleDeleteHour = (hourId: string | undefined) => {
    const hourToDelete = hours.find(hour => hour.id === hourId);
    if (hourToDelete) {
      setToSaveList(prevToSaveList => [...prevToSaveList, hourToDelete]);
      onSaveHours([...toSaveList, hourToDelete]);
    }
    const updatedHours = hours.filter(hour => hour.id !== hourId);
    setHours(updatedHours);
  };

  return (
    <main>
      <div className="mb-4">
        <label htmlFor="hamount" className="block text-gray-700 w-auto text-sm font-bold mb-2">Horas entregues</label>
        <div className='flex p-1'>
          <label className="block text-gray-700 w-autotext-sm font-bold mb-2 mr-2">Tipo de horas:</label>
          <select
            className="shadow appearance-none mr-2 border rounded w-[120px] text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={hourType}
            onChange={(e) => setHourType(e.target.value)}
            disabled={disabled}
          >
            <option value="normal">Normal</option>
            {projectTravel &&  (<option value="travel">Viagem</option>)}
            <option value="extra">Extra</option>
          </select>
          <input
            type="number"
            id="hamount"
            name="hamount"
            placeholder="Horas"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
            value={hourAmount}
            onChange={(e) => setHourAmount(e.target.value)}
            disabled={disabled}
          />
          <button
            className="bg-activeColor-400 hover:bg-cyanWhiteBackground-100 text-white font-bold p-2 ml-3 rounded focus:outline-none focus:shadow-outline disabled:bg-cyanWhiteBackground-100 disabled:disabled:text-gray-200"
            type="button"
            onClick={handleAddHour}
            disabled={disabled}
          >
            Adicionar
          </button>
        </div>
        <label htmlFor="hourdesc" className="mt-3 block text-gray-700 text-sm font-bold mb-2">Descrição da hora entregue</label>
        <textarea
          id="hourdesc"
          name="hourdesc"
          placeholder="Escreva uma breve descrição da hora entregue"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400 "
          value={hourDescription}
          disabled={disabled}
          onChange={(e) => setHourDescription(e.target.value)}
        />

        <label htmlFor="hourval" className="mt-3 block text-gray-700 text-sm font-bold mb-2">Despesas viagem</label>
        <input
          id="hourval"
          name="hourval"
          type='number'
          placeholder="999.999 Apenas números"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400 "
          value={hourval}
          disabled={hourvalEnabled}
          onChange={(e) => setHourval(parseFloat(e.target.value))}
        />
      </div>

      <HoursList hours={hours} onDeleteHour={handleDeleteHour} />
    </main>
  );
}
