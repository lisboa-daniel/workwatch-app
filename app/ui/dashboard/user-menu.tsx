'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { handleSignOut, refuse } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchMyData } from '@/app/lib/data';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const myData = await fetchMyData();
        if (myData && myData.role === 'admin') {
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

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Sua conta">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <ChevronDownIcon className="w-6 h-6 text-dborderColor-400"></ChevronDownIcon>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
          <Link key="Perfil" href="/dashboard/profile" className="w-full flex">
            <Avatar /> <p className="text-nm p-1">Perfil</p>
          </Link>
        </MenuItem>

        {isAdmin && (
          <MenuItem>
            <Link key="settings" href="/dashboard/settings" className="w-full flex">
              <Settings /> <p className="text-nm pl-2">Administração</p>
            </Link>
          </MenuItem>
        )}

        <Divider />

        <MenuItem>
          <form className="w-full flex items-start" action={handleSignOut}>
            <button className="w-full flex">
              <Logout fontSize="small" className="md:mr-3" /> Sair
            </button>
          </form>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
