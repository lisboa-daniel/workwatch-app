'use server';
 
import { z } from 'zod';
import sql from '@/db.js';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'
import { UserInfo, Task, FormattedHourData, Project, ProjectParam } from './definitions';
import { signIn } from '@/auth';
import { AuthError, User } from 'next-auth';
import { ptBR } from '@mui/x-data-grid/locales';



const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
  .number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
 
  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function saveProjectParam(paramFields:ProjectParam[]) {
  try {
    paramFields.forEach(async param => {
      try {
         await sql`INSERT INTO project_settings(project_id, param_name, value)
         
         VALUES(
         ${param.project_id},
         ${param.param_name},
         ${param.value}
         
         )`;

         console.log("params salvos");
      } catch (error) {
         console.log(`Erro ao salvar parametro ${param.param_name}`)
         throw error;
      }
   });
  } catch (error) {
    console.log("erro ao gravar dado de parametro");
    throw error;
  }
  
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
  const amountInCents = amount * 100;
 
  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
  //throw new Error('Failed to Delete Invoice');
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function saveCookie(key: string , value: string ){
  cookies().set(key, value);

}

export async function getCookie(key:string) {
  try{
    const cookieStore = cookies();
    const hasCookie = (cookieStore.has(key));
  
    if (hasCookie) return cookieStore.get(key);
    else return undefined;
  } catch(Error){
    console.log(Error);
  }

}

function DeleteCookies(clist: string[]){
  const cookieStore = cookies();
  clist.forEach(cookie => {
    if (cookieStore.has(cookie)){
      cookieStore.delete(cookie);
    }
  });
}

export async function UpdateUserCookie(name :string, email:string, role:string){
  try{
    const cookieStore = cookies();
    DeleteCookies(['uinf_name, uinf_email, uinf_srole']);
    

    cookieStore.delete("uinf_name");
    cookieStore.set("uinf_name", name);
    cookieStore.set("uinf_email", email);
    cookieStore.set("uinf_srole", role);
    
    
  } catch(Error){
    console.log(Error);
  }
}


import { signOut } from '@/auth';

export async function handleSignOut() {
  await signOut();
}


export interface UserDetail {
  id: string;
  fullname: string;
  email: string;
  role: string;
  image_path: string;
  phone: string;
  display_role: string;
  password1 : string;
  password2 : string;
  enabled: boolean;
}

import bcrypt from 'bcrypt';
import { delay } from './utils';

export async function updateUser(userdata: UserDetail, referal: string) {
  const salt = await bcrypt.genSalt(12);

  const hashedPassword = await bcrypt.hash(userdata.password1, salt);



  try{

    if (userdata.password1 && userdata.password1 != ''){
      const test = await sql`UPDATE users
        SET fullname = ${userdata.fullname}, 
        email = ${userdata.email},
        role = ${userdata.role},
        image_path = ${userdata.image_path},
        phone = ${userdata.phone}, 
        display_role = ${userdata.display_role},
        password = ${hashedPassword},
        enabled = ${userdata.enabled}
        WHERE id = ${userdata.id};`;
    } else {
      const test = await sql`UPDATE users
      SET fullname = ${userdata.fullname}, 
      email = ${userdata.email},
      role = ${userdata.role},
      image_path = ${userdata.image_path},
      phone = ${userdata.phone}, 
      display_role = ${userdata.display_role},
      enabled = ${userdata.enabled}
      WHERE id = ${userdata.id};`;
    }
    

    UpdateUserCookie(userdata.fullname, userdata.email,userdata.role);
    console.log("Usuário atualizado");
 

  }


  catch(error){
    console.log(`Erro ao atualizar perfil`);
    throw error;
  }

  revalidatePath('/dashboard/redirect?page_name='+referal);
  redirect('/dashboard/redirect?page_name='+referal);


}


export async function deleteHours(deleteHours: FormattedHourData[]) {
  // Extracting just the ids from the FormattedHourData array
  const ids = deleteHours.map(hour => hour.id);
  ids.forEach(async id => {
   await sql`DELETE FROM hours where id = ${id}`;
 });
}

export async function deleteTask(id : string) {
  console.log(`delete task id = ${id}`);
  try {
    
    await sql`DELETE FROM hours where task_id = ${id}`;
    console.log(`horas deletadas!`);

    await sql`DELETE FROM tasks where id = ${id};`
    console.log(`tarefa deletada!`);
    
   

  } catch (error) {
    console.log(`impossible delete ${error}`);
  }

  revalidatePath('/dashboard/redirect?page_name=tasks');
  redirect('/dashboard/redirect?page_name=tasks');
}


export async function deleteProject(id:string) {
  try {
    // Delete related records in the 'hours' table
    await sql`
      DELETE FROM hours
      WHERE task_id IN (
        SELECT id FROM tasks WHERE project_id = ${id}
      );
    `;
    console.log('Hours deleted!');

    // Delete related records in the 'tasks' table
    await sql`
      DELETE FROM tasks
      WHERE project_id = ${id};
    `;
    console.log('Tasks deleted!');

    // Delete related records in the 'project_settings' table
    await sql`
      DELETE FROM project_settings
      WHERE project_id = ${id};
    `;
    console.log('Project settings deleted!');

    // Delete related records in the 'relation_projects_users' table
    await sql`
      DELETE FROM relation_projects_users
      WHERE project_id = ${id};
    `;
    console.log('Project-user relations deleted!');

    // Finally, delete the project itself
    await sql`
      DELETE FROM projects
      WHERE id = ${id};
    `;
    console.log('Project deleted!');

  } catch (error) {
    console.log(`Impossible to delete: ${error}`);
  }

  revalidatePath('/dashboard/redirect?page_name=/');
  redirect('/dashboard/redirect?page_name=/');
}


export async function addHours(task_id: string | undefined, newHours: FormattedHourData[]) {
  // Initialize an array to store the values with proper type annotation
  const valuesArray: [string, string, string, string, string, number][] = [];

  // Iterate over newHours array to generate values array
  newHours.forEach(hour => {
      if (!hour.user_id) {
          throw new Error('user_id is required');
      }
      valuesArray.push([
        task_id || '', 
        hour.user_id, 
        hour.description || '', 
        hour.amount, 
        hour.type || '' ,
        hour.cost// Ensure hour.type is a string
      ]);
  });

  try {
      // Execute SQL query to insert hours
      await sql`
          INSERT INTO hours (task_id, user_id, description, amount, type, cost) VALUES 
          ${sql(valuesArray)}
      `;

      console.log("horas adicionadas!");
  } catch (error) {
      throw error;
      console.error('Error in creating hours:', error);
  }
}


export async function createUser(userData : UserDetail) {
  const salt = await bcrypt.genSalt(12);


const match = userData.phone.match(/(\d{4})$/);


const lastDigits = match ? match[0] : null;
const concatenated = `${ (lastDigits) ? lastDigits : ''}`;
//console.log(`contr asena = ${concatenated}`);
const hashedPassword = await bcrypt.hash(concatenated, salt);

  try {
    await sql`INSERT INTO users(fullname, email, role, image_path, phone, display_role,password)
    VALUES(
      ${userData.fullname},
      ${userData.email},
      ${userData.role},
      ${userData.image_path},
      ${userData.phone},
      ${userData.display_role},
      ${hashedPassword}
      
    )`;
  } catch (error) {
    console.log(`error on creating user ${error}`);
    throw error;
    
  }
  revalidatePath('/dashboard/redirect?page_name=settings');
  redirect('/dashboard/redirect?page_name=settings');

  
}

export async function removePeopleOfProject(project_title: string, users : string[]){
  try {
    const project = await sql`
    SELECT id FROM projects WHERE title = ${project_title};
  `;
  
  if (!project || !project.length) {
    throw new Error(`Project with title ${project_title} not found`);
  }
  
  const project_id = project[0].id;
  
    users.forEach(async id => {
        await sql`DELETE FROM relation_projects_users WHERE project_id = ${project_id} and 
        user_id = ${id}`;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }

}

export async function addPeopletoProject(project_title: string, users: string[]) {

  if (users.length > 0){
// Initialize an array to store the values with proper type annotation
const valuesArray: [string, string][] = [];

try {
  // Querying the project_id using project_title
  const project = await sql`
    SELECT id FROM projects WHERE title = ${project_title};
  `;

  if (!project || !project.length) {
    throw new Error(`Project with title ${project_title} not found`);
  }

  const project_id = project[0].id;

  // Iterate over users array to generate values array
  users.forEach(user => {
    valuesArray.push([project_id.toString(), user]);
  });

  // Execute SQL query to insert users into the project
  await sql`
    INSERT INTO relation_projects_users(project_id, user_id) VALUES 
    ${sql(valuesArray)}
  `;

  console.log("Users added to the project!");
} catch (error) {
  console.error('Error in adding users to the project:', error);
  throw error;
}
  }
  
}

export async function updateProject(projectData : Project){
  try {

    await sql`
    UPDATE projects SET
    title = ${projectData.title},
    description = ${projectData.description},
    start_date = ${projectData.start_date},
    end_date = ${projectData.end_date},
    travel = ${projectData.travel},
    finished = ${projectData.finished},
    client_id = ${projectData.client_id}
    WHERE id = ${projectData.id}` 

  } catch(err) {
    console.log(`Falhou ao atualizar pj ${projectData.id}`)
    throw err;
  }

  revalidatePath('/dashboard/redirect?page_name=/');
  redirect('/dashboard/redirect?page_name=/');
}

export async function createProject(projectData: Project) {
  try {
    await sql`
      INSERT INTO projects (
        title,
        description,
        start_date,
        end_date,
        travel,
        finished,
        client_id
      ) VALUES (
        ${projectData.title},
        ${projectData.description},
        ${projectData.start_date},
        ${projectData.end_date},
        ${projectData.travel},
        ${projectData.finished},
        ${projectData.client_id}
      );
    `;

    console.log("projeto criado");
  } catch (error) {
    console.log('Não foi possível criar um projeto');
    throw error;
  }

  revalidatePath('/dashboard/redirect?page_name=/');
  redirect('/dashboard/redirect?page_name=/');
}


export async function updateTaskData(taskData : Task) {

  /*console.log(`UUPDATE tasks SET
  user_id = ${taskData.user_id},
  type = ${taskData.type},
  summary = ${taskData.summary},
  start_date = ${taskData.start_date},
  end_date = ${taskData.end_date},
  status = ${taskData.status}
  WHERE id=${taskData.id}
`)*/



  console.log('pid:123 taskData.start_date = '+taskData.start_date);

  try{
      await sql`UPDATE tasks SET
        user_id = ${taskData.user_id},
        type = ${taskData.type},
        summary = ${taskData.summary},
        start_date = ${taskData.start_date},
        end_date = ${taskData.end_date},
        status = ${taskData.status}
        WHERE id=${taskData.id}
      `

      console.log("task updated!!!");
  }
  catch(error){
    console.log(`error to update: ${error}`)
  }

  revalidatePath('/dashboard/redirect?page_name=tasks');
  redirect('/dashboard/redirect?page_name=tasks');
}

export async function createTask(taskData : Task){
  
  //console.log(`pj ${taskData.project_id}\n ud ${taskData.user_id}`)
  
  try{
    const test = await sql`INSERT INTO tasks(project_id, user_id, type, summary, start_date, end_date, status) VALUES(
      ${taskData.project_id},
      ${taskData.user_id},
      ${taskData.type},
      ${taskData.summary},
      ${taskData.start_date},
      ${taskData.end_date},
      ${taskData.status}

    );`;

    
    console.log("Task created");


  }

  catch(error){
    console.log(`falha ao criar tarefa`);
    throw error;
  }

  revalidatePath('/dashboard/redirect?page_name=tasks');
  redirect('/dashboard/redirect?page_name=tasks');

}

export async function refuse() {
  
  revalidatePath('/dashboard');
  redirect('/dashboard/');
}
