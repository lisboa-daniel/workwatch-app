// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: string;
  image_path: string;
  phone: string;
  display_role: string;
  enabled: boolean;

};

export interface ReportProject {
  txt_costumer : string,
  txt_docnum: string,
  txt_project: string,
  txt_horast: string,
  txt_maxmember: string,
  txt_travel: string
}

export type Client = {
  
  id: string,
  name: string,
  corporate_name: string,
  cnpj: string,
  address: string,
  email: string,
  website: string
}


export interface ReportUserData{
  txt_user_name : string
  txt_user_role : string
  txt_user_hours : number
  txt_user_travel_tasks : number
  txt_hours_cost : number
  txt_hours_total_cost : number
  txt_travel_count: number
  txt_travel_cost: number
}

export type UserInfo = {
  fullname: string;
  email: string;
  image_path : string;
}

export interface HourData{
  id: string,
  task_id: string,
  user_id: string,
  amount: string,
  type: string,
  modified_at: string,
}

export interface FormattedHourData {
  id : string ;
  user_id: string ;
  fullname: string ;
  amount: string;
  description: string;
  type: string ;
  cost : number;
}

export interface Task {
  id : string,
  project_id : string,
  user_id : string,
  type : string,
  summary : string,
  start_date : string,
  end_date : string,
  status : string


};

export interface ProjectSettings {
  allowTravel : boolean
}

export interface ProjectParam {
  id : string,
  project_id : string,
  param_name : string,
  value : number
}

export type Project = {
  id : string;
  title : string;
  description: string;
  start_date : string;
  end_date : string;
  travel: boolean;
  finished : boolean;
  client_id : string;

}

export type Navlinkt = {
  name: string;
  href: string;
  icon : string;
}



export type UserProfile = {
  name: string;
  image_path: string;
  email: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type CustomerField = {
  id: string;
  name: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};
