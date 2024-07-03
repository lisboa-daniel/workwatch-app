'use server';

import postgres from "postgres";
import { User, Task, HourData, FormattedHourData, Client, ReportProject, ProjectParam } from './definitions';


import {unstable_noStore  as  noStore} from 'next/cache';
import sql from '@/db.js';

import { cookies } from 'next/headers';
import clients from './clients.json';





interface Project {
  id: string;
  title: string;
  description: string;
  travel: boolean;
}


interface ProjectDetail{
  id : string;
  title : string;
  description : string;
  start_date : string;
  end_date : string;
  travel : string;
  finished : string;

}

// data.ts
export async function fetchHoursByTaskId(task_id: string): Promise<FormattedHourData[] | null> {
  try {
    const hours = await sql<FormattedHourData[]>`
      SELECT hours.id, hours.user_id AS user_id, users.fullname AS fullname, hours.amount, hours.description, hours.type
      FROM hours
      INNER JOIN users ON hours.user_id = users.id
      WHERE task_id=${task_id}
    `;

    //console.log(hours);
    return hours;


  } catch (err) {
    console.log(`Erro ao recuperar horas para a tarefa: ${task_id}`, err);
    throw err;

  }
}

export async function fetchProjectParam(projectId: string): Promise<ProjectParam[]>{
  try {
    const promise = await sql`SELECT * FROM project_settings where project_id = ${projectId}`;


    const formattedData = promise.map((row: any) => ({
        id: row.id,
        project_id: row.project_id,
        param_name: row.param_name,
        value: row.value
    }))


    return formattedData;
  } catch (error) {
    console.log('Falha ao recuperar parametros do projeto ');
    throw(error);
  }
}


import {ReportUserData} from "@/app/lib/definitions";

export async function fetchUsersReportData(projectId: string, date1: string, date2: string): Promise<ReportUserData[]> {
  try {
      const userNamesAndRolesPromise = sql`
          SELECT 
              u.id,
              u.fullname AS txt_user_name,
              u.display_role AS txt_user_role
          FROM 
              public.users u
          JOIN 
              public.relation_projects_users rpu ON u.id = rpu.user_id
          WHERE 
              rpu.project_id = ${projectId}
              AND u.role != 'admin'
      `;

      const userHoursPromise = sql`
          SELECT 
              u.id,
              COALESCE(SUM(h.amount), 0) AS txt_user_hours
          FROM 
              public.users u
          JOIN 
              public.relation_projects_users rpu ON u.id = rpu.user_id
          LEFT JOIN 
              public.tasks t ON t.project_id = ${projectId} AND t.status = 'done'
          LEFT JOIN 
              public.hours h ON t.id = h.task_id and h.user_id = u.id and h.type != 'travel'
          WHERE 
              rpu.project_id = ${projectId}
              AND u.role != 'admin'
              AND h.modified_at BETWEEN ${date1} AND ${date2}
          GROUP BY 
              u.id;
      `;

      const userTravelTasksPromise = sql`
          SELECT u.id, 
          (
              SELECT SUM(hours.amount) 
              FROM hours
              JOIN tasks ON hours.task_id = tasks.id
              JOIN projects ON tasks.project_id = projects.id
              WHERE projects.id = ${projectId} 
              AND tasks.status = 'done'
              AND hours.type = 'travel'
              AND hours.user_id = u.id
              AND hours.modified_at BETWEEN ${date1} AND ${date2}
          ) AS txt_user_travel_tasks
          FROM users u
          JOIN relation_projects_users rpu ON u.id = rpu.user_id
          WHERE rpu.project_id = ${projectId}
          AND u.role != 'admin';
      `;

      const userHoursCostPromise = sql`
          SELECT 
              u.id,
              COALESCE((
                  SELECT ps.value::numeric 
                  FROM public.project_settings ps 
                  WHERE ps.project_id = ${projectId} 
                  AND ps.param_name = u.display_role || '_cost'
              ), 0) AS txt_hours_cost
          FROM 
              public.users u
          JOIN 
              public.relation_projects_users rpu ON u.id = rpu.user_id
          WHERE 
              rpu.project_id = ${projectId}
              AND u.role != 'admin';
      `;

      const userHoursTotalCostPromise = sql`
          SELECT 
              u.id,
              COALESCE(SUM(h.amount), 0) * COALESCE((
                  SELECT ps.value::numeric 
                  FROM public.project_settings ps 
                  WHERE ps.project_id = ${projectId} 
                  AND ps.param_name = u.display_role || '_cost'
              ), 0) AS txt_hours_total_cost
          FROM 
              public.users u
          JOIN 
              public.relation_projects_users rpu ON u.id = rpu.user_id
          LEFT JOIN 
              public.tasks t ON u.id = t.user_id AND t.project_id = ${projectId} AND t.status = 'done'
          LEFT JOIN 
              public.hours h ON t.id = h.task_id
          WHERE 
              rpu.project_id = ${projectId}
              AND u.role != 'admin'
              AND h.modified_at BETWEEN ${date1} AND ${date2}
          GROUP BY 
              u.id;
      `;

      const userTravelCountPromise = sql`
          SELECT u.id,
          (
              SELECT COUNT(hours.id) 
              FROM hours
              JOIN tasks ON hours.task_id = tasks.id
              JOIN projects ON tasks.project_id = projects.id
              WHERE projects.id = ${projectId} 
              AND tasks.status = 'done'
              AND hours.type = 'travel'
              AND hours.user_id = u.id
              AND hours.modified_at BETWEEN ${date1} AND ${date2}
          ) AS txt_travel_count
          FROM users u
          JOIN relation_projects_users rpu ON u.id = rpu.user_id
          WHERE rpu.project_id = ${projectId}
          AND u.role != 'admin';
      `;

      const userTravelCostTotal = sql`
          SELECT 
              u.id,
              COALESCE(SUM(h.cost), 0) AS txt_travel_cost
          FROM 
              public.users u
          JOIN 
              public.relation_projects_users rpu ON u.id = rpu.user_id
          JOIN 
              public.tasks t ON t.project_id = rpu.project_id
          JOIN 
              public.hours h ON h.task_id = t.id
          WHERE 
              rpu.project_id = ${projectId}
              AND h.type = 'travel'
              AND h.user_id = u.id
              AND t.status = 'done'
              AND u.role != 'admin'
              AND h.modified_at BETWEEN ${date1} AND ${date2}
          GROUP BY 
              u.id;
      `;

      const results = await Promise.all([
          userNamesAndRolesPromise,
          userHoursPromise,
          userTravelTasksPromise,
          userTravelCountPromise, 
          userHoursCostPromise,
          userHoursTotalCostPromise,
          userTravelCostTotal
      ]);
      
      const [namesAndRoles, userHours, travelTasks, travelCounts, hoursCost, totalCost, travelCost] = results;
      
      const formattedData: ReportUserData[] = namesAndRoles.map((user: any) => {
          const hours = userHours.find((h: any) => h.id === user.id);
          const travel = travelTasks.find((t: any) => t.id === user.id);
          const travelCount = travelCounts.find((tc: any) => tc.id === user.id); // Retrieve travel count
          const cost = hoursCost.find((c: any) => c.id === user.id);
          const total = totalCost.find((tc: any) => tc.id === user.id);
          const travel_cost = travelCost.find((trv: any) => trv.id === user.id);
      
          return {
              txt_user_name: user.txt_user_name,
              txt_user_role: user.txt_user_role,
              txt_user_hours: hours ? hours.txt_user_hours : 0,
              txt_user_travel_tasks: travel ? travel.txt_user_travel_tasks : 0,
              txt_travel_count: travelCount ? travelCount.txt_travel_count : 0, 
              txt_hours_cost: cost ? cost.txt_hours_cost : 0,
              txt_hours_total_cost: total ? total.txt_hours_total_cost : 0,
              txt_travel_cost : travel_cost ? travel_cost.txt_travel_cost : 0,
          };
      });
      
      return formattedData;
  
  } catch (error) {
      console.log(error);
      throw error;
  }
}


export async function fetchProjectReportData(projectid: string, date1: string, date2: string){

  try {
    const promise = await sql`SELECT 
    p.client_id AS txt_costumer,
    p.title AS txt_project,
    COALESCE(SUM(CASE WHEN t.status = 'done' AND t.end_date >= ${date1} AND t.end_date <= ${date2} THEN h.amount ELSE 0 END), 0) AS txt_horas,
    (SELECT COUNT(*) FROM public.relation_projects_users rpu WHERE rpu.project_id = p.id) AS txt_members,
    p.travel AS txt_travel
        FROM 
            public.projects p
        LEFT JOIN 
            public.tasks t ON p.id = t.project_id
        LEFT JOIN 
            public.hours h ON t.id = h.task_id
        WHERE 
            p.id = ${projectid}
        GROUP BY 
          p.id;`;


    const formattedData = promise.map((row: any) => ({
      txt_costumer : row.txt_costumer,
      txt_docnum: '2222',
      txt_project: row.txt_project,
      txt_horast: row.txt_horas,
      txt_maxmember: row.txt_members,
      txt_travel: row.txt_travel,

    }));

    return formattedData;

    
  } catch (error) {
    console.log(error);
    throw error;
  }
    

}

export async function fetchTaskById(id: string): Promise<Task | null> {
  try {
    const tasks = await sql<Task[]>`
      SELECT * FROM tasks WHERE id=${id}
    `;

    if (tasks.length > 0) {
      return tasks[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch task by ID: ${error}`);
    return null;
  }
}

type UserD = {
  user_id?: string;
  fullname?: string;
  role?: string;
};

type UserD2 = {
  user_id: string;
  fullname: string;
  role: string;
};


export async function fetchMyData(): Promise<UserD2> {
  const cookieStore = cookies();

  const user_id = cookieStore.get("uinf_id");

  if (user_id){
    const fullname= cookieStore.get("uinf_name");
    const roles = cookieStore.get('uinf_srole');
    if (fullname){
      if (roles){
        return {
          user_id: user_id.value,
          fullname: fullname.value,
          role: roles.value
        }
      }
     
    }
  }
  return {
    user_id: '',
    fullname:'',
    role: ''
  }
}



export async function fetchTimesheetData(projectid: string, date1: string, date2: string) {
  try {

    const promise0 = sql`SET timezone = 'America/Sao_Paulo';`;
    const promise1 = sql`SELECT 
          u.fullname AS user_fullname,
          t.summary AS task_summary,
          SUM(h.amount) AS total_amount,
          TO_CHAR(MAX(h.modified_at), 'DD/MM/YYYY') AS date
      FROM 
          public.users u
      JOIN 
          public.relation_projects_users rpu ON u.id = rpu.user_id
      JOIN 
          public.tasks t ON t.project_id = rpu.project_id
      JOIN 
          public.hours h ON h.task_id = t.id AND h.user_id = u.id
      WHERE 
          rpu.project_id = ${projectid}
          AND h.modified_at BETWEEN ${date1} AND ${date2}
      GROUP BY 
          u.id, u.fullname, t.id, t.summary
      ORDER BY 
          u.fullname, t.summary;
    `;

    const promise2 = sql`SELECT DISTINCT TO_CHAR(h.modified_at, 'DD/MM/YYYY') AS formatted_date
      FROM public.hours h
      JOIN public.tasks t ON h.task_id = t.id
      JOIN public.projects p ON t.project_id = p.id
      WHERE t.end_date >= ${date1}
        AND t.end_date <= ${date2}
        AND p.id = ${projectid}
      ORDER BY formatted_date;
    `;

    const [data_rows, columns] = await Promise.all([promise1, promise2, promise0]);

    const formattedDataRows = data_rows.map((row: any) => ({
      user_fullname: row.user_fullname,
      task_summary: row.task_summary,
      total_amount: row.total_amount,
      date: row.date,
    }));

    return { data_rows: formattedDataRows, columns: columns.map((row: any) => row.formatted_date) };
  } catch (error) {
    console.log(`Can't fetch timesheet data: ${error}`);
    return { data_rows: [], columns: [] };
  }
}



export async function fetchProjectById(projectid : string){
  
  try{
    const promise = await sql`SELECT * FROM projects WHERE id = ${projectid}`;

  const formattedData = promise.map((row: any) => ({
    id : row.id,
    title : row.title,
    description: row.description ,
    start_date: row.start_date ,
    end_date : row.end_date,
    travel : row.travel,
    finished: row.finished,
    client_id: row.client_id
  }));
  


  return formattedData;
  }
  catch(err){
    console.log(`erro ao recuperar projeto com id: ${projectid}`);
  }

}

export async function fetchRoleData(projectid : string) : Promise<string[]>{
  
  let roles : string[] = [];

  const promise = await sql`SELECT 
    DISTINCT u.display_role 
    FROM 
        public.users u
    JOIN 
        public.relation_projects_users rpu ON u.id = rpu.user_id
    WHERE 
        rpu.project_id = ${projectid};`
  
  promise.forEach(row => {
      roles.push(row.display_role);
  });


  return roles;
}


export async function fetchProjectsData(isAdmin : boolean): Promise<Project[]> {
  const cookieStore = cookies();

  const id = cookieStore.get("uinf_id");

  if (id) {
    try {

      let projects : Project[] = []

      if (isAdmin){
        projects = await sql<Project[]>`SELECT id, title, description, travel
        FROM projects;`;
        //console.log('is admin1');
      }
      else {
      projects = await sql<Project[]>`SELECT p.id, p.title, p.description, p.travel
                                            FROM Projects p
                                            JOIN Relation_Projects_Users rpu ON p.id = rpu.project_id
                                            WHERE rpu.user_id = ${id.value};`;
      }



      return projects;  // Access the rows property which contains the result set
  
    } catch (error) {
      console.error('Failed to fetch projects for this user', error);
      return [];
    }
  } else {
    throw new Error('User ID cookie not found');
  }
}


export async function fetchOverviewData({ projectId, userId }: { projectId: string , userId: string}) {
  noStore();

  
  try {
    const totalHoursPromise = await sql`
      SELECT SUM(h.amount) as total_hours
      FROM hours h
      JOIN tasks t ON h.task_id = t.id
      WHERE t.project_id = ${projectId};
    `;
      
    const avgHoursPromise = await sql`
      SELECT AVG(h.amount) as avg_hours
      FROM hours h
      JOIN tasks t ON h.task_id = t.id
      WHERE t.project_id = ${projectId};
    `;
      
    const fyHoursPromise = sql`
      SELECT SUM(h.amount) as fy_hours
      FROM tasks t
      JOIN hours h ON t.id = h.task_id
      WHERE t.project_id = ${projectId} AND h.user_id = ${userId} ;
    `;



    const data = await Promise.all([
      totalHoursPromise,
      avgHoursPromise,
      fyHoursPromise
    ]);
      

    const row0 = data[0];
    const totalHours = data[0][0].total_hours;

    //console.log(totalHours);

    const avgHours = parseFloat(data[1][0].avg_hours);
    let fyHours = data[2][0].fy_hours;
    //console.log("TYPE = " + typeof(avgHours));

    const formmatedAVG = avgHours.toFixed(2).toString();
    //console.log(projects[0]);
    return {
      totalHours,
      formmatedAVG,
      fyHours

      
    }
  } catch (error) {
    console.error('Failed to fetch projects for this user', error);
    throw new Error('Failed to fetch projects for this user');
  }
}


export async function fetchCollaborationData({ projectId }: { projectId: string }) {
  noStore();
  const collaborationData = await sql`
    SELECT u.fullname, SUM(h.amount) as hours
    FROM users u
    JOIN hours h ON u.id = h.user_id
    JOIN tasks t ON h.task_id = t.id
    WHERE t.project_id = ${projectId}
    GROUP BY u.fullname;
  `;

  const formattedData = collaborationData.map((row: any) => ({
    fullname: row.fullname,
    hours: row.hours
  }));

  return formattedData;
}


export async function fetchLastestHours({ projectId }: { projectId: string }) {
  noStore();

  //console.log(`PROJECT ID FOR LTSH ${projectId}`);
  
  const lastestHoursData = await sql`
      SELECT
          u.fullname AS author,
          t.summary AS task,
          p.title AS description,
          h.amount AS hours,
          to_char(h.modified_at, 'DD/MM/YYYY HH24:MI') AS date
      FROM
          hours h
      JOIN
          tasks t ON h.task_id = t.id
      JOIN
          users u ON h.user_id = u.id
      JOIN
          projects p ON t.project_id = p.id
      WHERE
          p.id = ${projectId}
      ORDER BY
          h.modified_at DESC
      LIMIT 3;
  `;

  const formattedData = lastestHoursData.map((row: any) => ({
      author: row.author,
      task: row.task,
      description: row.description,
      hours: row.hours,
      date: row.date
  }));

  return formattedData;
}

export async function getCookie(name : string) {
  const cookieStore = cookies();
  if (cookieStore.has(name)){
    let request = cookieStore.get(name);
    if (request) return request.value;
  }

  return '';
}

export async function getUserCookies() {
  const cookieStore = cookies();
  const userCookies: Record<string, string | null> = {};

  if (cookieStore.has('uinf_email')) {
      const emailCookie = cookieStore.get('uinf_email');
      const nameCookie = cookieStore.get('uinf_name');
      const imagePathCookie = cookieStore.get('uinf_image_path');

      userCookies.email = emailCookie ? emailCookie.value.toString() : null;
      userCookies.name = nameCookie ? nameCookie.value.toString() : null;
      userCookies.image_path = imagePathCookie ? imagePathCookie.value.toString() : null;
  }

  return userCookies;
}

export async function getUserIdFromCookie() {
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get('uinf_id');
  return userIdCookie ? userIdCookie.value : null;
}


export interface ProjectMember {
  id : string,
  fullname: string,
  aintAllow: boolean
}

export async function getUserFromCookie(){
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get('uinf_id');
  const userNameCookie = cookieStore.get('uinf_name');
  let member : ProjectMember = {
    id: '',
    fullname:'',
    aintAllow: false
  };
  if ((userIdCookie && userNameCookie)){
    member.id = userIdCookie.value;
    member.fullname = userNameCookie.value;
    member.aintAllow = false;

  }
  return member;
}


export async function fetchTaskData(project_id:string) {
  const taskPromise = await sql`SELECT tasks.*, users.fullname 
  FROM tasks 
  JOIN users ON tasks.user_id = users.id 
  WHERE tasks.project_id = ${project_id}`;

  const formattedData = taskPromise.map((row: any) => ({
    id: row.id,
    title: row.summary,
    task: row.task,
    start_date: row.start_date,
    end_date: row.end_date,
    status: row.status,
    owner: row.fullname
  }));

  const todo = formattedData.filter(task => task.status === 'todo');
  const pending = formattedData.filter(task => task.status === 'pending');
  const done = formattedData.filter(task => task.status === 'done');

  return {
    todo,
    pending,
    done
  };
}


export async function fetchProjectMembersData(projectid : string){
  let formattedData : ProjectMember[] = [];
  try {
    const promise = await sql`select u.id, u.fullname
    from users u
    join relation_projects_users rpu on u.id = rpu.user_id
    where rpu.project_id= ${projectid};`;

    //console.log(`fine4: ${projectid}`);
  formattedData = promise.map((row: any) => ({
    id: row.id,
    fullname: row.fullname,
    aintAllow: true
  }));
  //const data = await sql<Revenue>`SELECT * FROM revenue`;
  
  } catch (error) {
    console.log(`erro ao recuperar membros do projeto: ${projectid}: \n${error}`);
   
  }

  return formattedData;

}


export async function fetchUsersData(){
  const userPromise = await sql`SELECT * from users; `;
  return userPromise;
}

export async function fetchUsersDataByProject(projectId: string) {
  const userPromise = await sql`
    SELECT users.*
    FROM relation_projects_users
    JOIN users ON relation_projects_users.user_id = users.id
    WHERE relation_projects_users.project_id = ${projectId};
  `;
  return userPromise;
}

export async function fetchUserById(){
  noStore();

  const cookieStore = cookies()

  const hasCookie = (cookieStore.has('uinf_id'));
  const id = cookieStore.get("uinf_id")

  if (id){
    const userPromise = await sql`SELECT * from users WHERE id=${id.value.toString()}; `;

    return userPromise;
  }
}


export async function fetchUserByIdValue(id : string){

  if (id){
    const userPromise = await sql`SELECT * from users WHERE id=${id}; `;

    return userPromise;
  }
}


/*
import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    /*console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    */
    //const data = await sql<Revenue>`SELECT * FROM revenue`;

    //console.log('Data fetch completed after 3 seconds.');
/*
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}



export async function fetchLatestInvoices() {
  noStore();
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const hoursCountTotal = sql`SELECT SUM()  from Hours as "total_hours"`



    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  noStore();
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}






*/

export async function getUser(email: string) {

  let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;


  const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: "require",
  });

  try {
    const user = await sql`SELECT * FROM Users WHERE email=${email}`;
    return user[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
