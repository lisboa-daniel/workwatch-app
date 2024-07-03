import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { FormattedHourData } from '@/app/lib/definitions';
import { fetchHoursByTaskId } from '@/app/lib/data';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { formatCurrencyBR } from '@/app/lib/utils';

interface HoursListProps {
  hours: FormattedHourData[];

  onDeleteHour: (hourId: string | undefined) => void;
}

export default function HoursList({ hours, onDeleteHour }: HoursListProps) {
  const [dense, setDense] = React.useState(false);

  const handleDeleteHour = (hourId: string | undefined)  => {
    // Call the onDeleteHour function with the hourId to delete the hour entry
    onDeleteHour(hourId);
  };

  
  const typeNiceName: {
    [key: string]: string; // This is the index signature
    normal: string;
    travel: string;
    extra: string;
} = {
    normal: "Normais",
    travel: "Viagem",
    extra: "Extras"
};

  return (
    <List dense={dense}>
      {hours.map((hour, index) => (
        <ListItem key={index}>
          <Avatar>
            <AccessTimeIcon />
          </Avatar>
          <ListItemText className='ml-2'
            primary={`${hour.fullname} - Entregou ${hour.amount} horas ${typeNiceName[hour.type]} em [${hour.description}] ${hour.cost>0 ?  formatCurrencyBR(hour.cost) : ''}`}
          />
          <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteHour(hour.id)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
    </List>
  );
}
