// nav-links.tsx
'use client';

import {
  HomeIcon,
  ViewColumnsIcon,
  PaperAirplaneIcon,
  CalendarIcon,
  ClockIcon,
  ChartBarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { fetchMyData } from '@/app/lib/data';

const LinksComplete = [
  { name: 'Página Inicial', href: '/dashboard', icon: HomeIcon },
  { name: 'Visão Geral', href: '/dashboard/overview', icon: ViewColumnsIcon },
  { name: 'Tarefas', href: '/dashboard/tasks', icon: PaperAirplaneIcon },

  { name: 'Timesheet', href: '/dashboard/schedule', icon: ClockIcon },


];

const LinksCompleteAdmin = [
  { name: 'Página Inicial', href: '/dashboard', icon: HomeIcon },
  { name: 'Visão Geral', href: '/dashboard/overview', icon: ViewColumnsIcon },
  { name: 'Tarefas', href: '/dashboard/tasks', icon: PaperAirplaneIcon },

  { name: 'Timesheet', href: '/dashboard/schedule', icon: ClockIcon },

  { name: 'Relatórios', href: '/dashboard/reports', icon: ChartBarIcon },


];

const LinksLite = [
  { name: 'Página Inicial', href: '/dashboard', icon: HomeIcon },
  { name: 'Minha Conta', href: '/dashboard/profile', icon: UserCircleIcon },
];

interface NavLinksProps {
  projectId: string;
  setProjectId: (id: string) => void;
}

export default function NavLinks({ projectId, setProjectId }: NavLinksProps) {
  const pathname = usePathname();


  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const myData = await fetchMyData();
        if (myData && (myData.role === 'admin' || myData.role === 'gp') ) {
          setIsAdmin(true);
        
        

        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);


  const links = (projectId != "default" && projectId) ? (isAdmin ? LinksCompleteAdmin: LinksComplete) : LinksLite;


  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const handleClick = () => {
          if (link.name == 'Página Inicial') {
            setProjectId('default');
            //console.log("o may gawd")
          }
        };

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 font-medium hover:bg-cyanWhiteBackground-100 hover:text-activeColor-400 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-colorBackground-400 text-defaultColor-100': pathname !== link.href,
                'bg-defaultColor-100 text-cyan-400': pathname === link.href,
              }
            )}
            onClick={handleClick}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
