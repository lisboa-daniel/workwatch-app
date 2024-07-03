// nav-bar.tsx
'use client';

import SideNav from './sidenav';
import { useProject } from '@/app/context/ProjectContext';

export default function NavBar() {
  const { projectId, setProjectId } = useProject();

  return (
    <div className="navbar-wrapper h-full">
      <SideNav projectId={projectId} setProjectId={setProjectId} />
    </div>
  );
}
