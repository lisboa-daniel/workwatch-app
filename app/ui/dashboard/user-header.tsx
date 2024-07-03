'use client';

import { useEffect, useState } from 'react';
import { inter } from '@/app/ui/fonts';
import UserNav from '@/app/ui/dashboard/user-nav';
import { getCurrentDay } from '@/app/lib/utils';
import { getUserCookies } from '@/app/lib/data'; // Import the getUserCookies function

const initialUser = {
    email: "[User Email]]",
    name: "[User Name]",
    image_path: "/default.png",
};

export default function UserHeader() {
    const [user, setUser] = useState(initialUser);
    const dayString = getCurrentDay();

    useEffect(() => {
        async function fetchData() {
            const userCookies = await getUserCookies();

            // Update state with user cookie data
            setUser(prevUser => ({
                ...prevUser,
                email: userCookies.email ?? prevUser.email,
                name: userCookies.name ?? prevUser.name,
                image_path: userCookies.image_path ?? prevUser.image_path,
            }));
        }

        fetchData();
    }, []); // Empty dependency array to run this effect only once on component mount

    return (
        <div>
            <div className="flex items-center bg-defaultColor-100 p-2 r-3 rounded-lg  md:flex md:h-10">
                <p className={`${inter.className} mb-4 text-xl md:text-l font-extrabold text-dborderColor-400`}>
                    {dayString}
                </p>
                <div className="ml-auto">
                    <UserNav user={user}></UserNav>
                </div>
            </div>
            <div className="border-t-2 border-dborderColor-400 w-full m-2 "></div>
        </div>
    );
}