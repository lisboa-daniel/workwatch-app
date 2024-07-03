import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
//import { sql } from '@vercel/postgres';

import type { User, UserInfo } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
import sql from './db.js'
import {saveCookie} from '@/app/lib/actions';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql`SELECT * FROM Users WHERE email=${email}`;

    return user[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}



/*
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}*/
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(3) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) {
            saveCookie("uinf_id",user.id);
            saveCookie("uinf_email",email);
            saveCookie("uinf_name",user.fullname);
            saveCookie("uinf_image_path",user.image_path);
            saveCookie("uinf_srole",user.role);
            
            if (user.enabled) return user;
            else return null;
          }
        }
 
         
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});