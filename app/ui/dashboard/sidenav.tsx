// sidenav.tsx
import Link from 'next/link';
import UserNav from '@/app/ui/dashboard/user-nav';
import AcmeLogo from '@/app/ui/app-logo';
import { ArrowsPointingOutIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import Logout from '@/app/ui/google-icons';
import NavLinks from './nav-links';
import { handleSignOut } from '@/app/lib/actions';

interface SideNavProps {
  projectId: string;
  setProjectId: (id: string) => void;
}

export default function SideNav({ projectId, setProjectId }: SideNavProps) {
  const profile = { name: 'Minha Conta', href: '/dashboard/profile', icon: UserCircleIcon };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-cyan-400">
      <Link className="mb-2 flex h-10 justify-start rounded-md bg-cyan-400 p-4 md:h-40" href="/">
        <div className="w-32 h-12 text-white md:w-40 md:mt-332">
          <AcmeLogo fontSize="s" />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 mt-12 md:mt-0">
        <NavLinks projectId={projectId} setProjectId={setProjectId} />
        <div className="hidden h-full w-full grow rounded-md bg-cyan-400 md:block"></div>


        


        {/* SAIR BUTTON*/}
        <form action={handleSignOut}>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-cyan-400 p-3 text-white font-medium hover:bg-cyan-100 hover:text-cyan-400 md:flex-none md:justify-start md:p-2 md:px-3">
            <Logout />
            <div className="hidden md:block">Sair</div>
          </button>
        </form>




      </div>
    </div>
  );
}
