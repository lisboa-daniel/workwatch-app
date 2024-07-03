/*import { fetchCardData } from '@/app/lib/data'
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

const iconMap = {
  collected: ClockIcon,
  customers: ClockIcon,
  pending: ClockIcon,
  invoices: ClockIcon,
};

export default async function CardWrapper() {
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course }

      <Card title="Total de horas" value={totalPaidInvoices} type="collected" />
      <Card title="Estimativa de horas inicial" value={totalPendingInvoices} type="pending" />
      <Card title="Estimado restante" value={numberOfInvoices} type="invoices" />
      <Card title="Meu tempo total" value={numberOfCustomers} type="customers"/> 
  
    </>
  );
}



export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}*/
