import Image from 'next/image';
import {UserProfile} from '@/app/lib/definitions';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import AccountMenu from '@/app/ui/dashboard/user-menu';


export default function UserNav({ user } : {user : UserProfile}) {
  return (
    <div className="m-2 flex flex-col md:flex-row items-center mb-5 bg-defaultColor-100 p-2 rounded-lg">
       <Image
        src={user.image_path ? `/uploads${user.image_path}` : '/customers/default.png'}
        className= "mr-2 rounded-full border-2 border-dborderColor-400 ml-2" 
        width={52}
        height={52}
        alt={`${user.name}'s profile picture`}

      />
      <div className="min-w-0">
        <p className=" text-left font-semibold">{user.name}</p>
        <p className="hidden text-sm text-gray-500 sm:block">{user.email}</p>
      </div>
        
     
      <AccountMenu/>
      {/*<ChevronDownIcon className="w-6 h-6 text-dborderColor-400"></ChevronDownIcon>*/}

      
    </div>
  );
}

