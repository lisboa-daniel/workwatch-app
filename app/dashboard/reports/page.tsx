'use client';

import { useEffect, useState } from "react";
import { generate } from '@pdfme/generator';
import { BLANK_PDF as pdf } from "@pdfme/common";
import { text, image, barcodes, readOnlyText } from '@pdfme/schemas';
import schemas from '@/app/lib/doc.json';
import PathBurguer from "@/app/ui/dashboard/path_burger";
import { inter } from "@/app/ui/fonts";
import UserHeader from "@/app/ui/dashboard/user-header";
import { Button } from "@mui/material";
import { fetchProjectReportData } from "@/app/lib/data";
import { useProject } from '@/app/context/ProjectContext';
import {Client, ReportUserData} from '@/app/lib/definitions';
import customers from '@/app/lib/clients.json';
import { custom } from "zod";
import {formatCurrencyBR, generateDocumentString} from "@/app/lib/utils";
import { fetchUsersReportData } from "@/app/lib/data";
import { ToastContainer, toast } from "react-toastify";
import {formatDateBR} from "@/app/lib/utils";

const getCustomerNameById = (id: string): string | undefined => {
  const customer = customers.find((customer: Client) => customer.id === id);
  return customer?.name;
};

function generateHandler(projectId : string, startDate : string, endDate: string, setGenerating : (set : boolean) => void) {

  console.log(`date1 == ${startDate}`);
  console.log(`date2 == ${endDate}`);

  const plugins = {
    text,
    readOnlyText
  };
  let template = {
    basePdf: schemas.basePdf,
    schemas: schemas.schemas
  };

  let customerId : string;
  let docNumber : string;
  let projectName : string;
  let totalHours : string;
  let maxMembers : string;
  let travel : boolean;
  
  const sucesssNotify = () => toast.success("Relatório gerado com sucesso");
  const errorNotifyInput = () => toast.error("Preencha todos os campos de data");
  const errorNotify= (err:string) => toast.error(err);
 
  if ((startDate == '' || !startDate) || (endDate == '' || !endDate)){
    errorNotifyInput();
    throw 'Erro: Alguns campos de data estão vazios';
  }

  setGenerating(true);

  fetchProjectReportData(projectId, startDate, endDate)
  .then((pData : any) => {
    
    customerId= pData[0].txt_costumer;
    docNumber= pData[0].txt_docnum;
    projectName= pData[0].txt_project;
    totalHours= pData[0].txt_horast;
    maxMembers = pData[0].txt_maxmember;
    travel = pData[0].txt_travel;
  

    let client = getCustomerNameById(customerId);
    let usr_data: ReportUserData[] = [];
    let inputs : any= [];
    let project_hours_cost = 0;
    fetchUsersReportData(projectId, startDate, endDate)
      .then((data: ReportUserData[]) => {
        usr_data = data;
        
        for (let i = 0; i < usr_data.length; i += 6) {
          // Object to store user data and general information for this group of six
          const groupData : any = {};
      
          // Push user data for this group of six into the groupData object
          for (let j = 0; j < 6 && i + j < usr_data.length; j++) {
              const user = usr_data[i + j];
              console.log(`dados do report usuario ${i+j}: ${user}`);
              groupData[`txt_user${j + 1}_name`] = user.txt_user_name;
              groupData[`txt_user${j + 1}_role`] = user.txt_user_role;
              groupData[`txt_user${j + 1}_hours`] = `${user.txt_user_hours}`;
              groupData[`txt_user${j + 1}_ch`] = `${formatCurrencyBR(user.txt_hours_cost)}`;
              groupData[`txt_user${j + 1}_ct`] = `${formatCurrencyBR(user.txt_hours_cost * user.txt_user_hours)}`;
              groupData[`txt_user${j + 1}_travel`] = user.txt_user_travel_tasks
              groupData[`txt_user${j + 1}_travelam`] = user.txt_travel_count;
              groupData[`txt_user${j + 1}_travelc`] = `${formatCurrencyBR(user.txt_travel_cost)}`;
              project_hours_cost += (user.txt_hours_cost * user.txt_user_hours) + parseFloat(user.txt_travel_cost.toString());
              console.log(`+ txt_hours_total_cost:${user.txt_hours_cost * user.txt_user_hours} + travel:${user.txt_travel_cost} = ${project_hours_cost}`);
              
           
          }
      
          // Add general information for this group of six into the groupData object
          groupData.txt_costumer = client ? client : 'not found';
          groupData.txt_docnum = docNumber;
          groupData.txt_project = projectName;
          groupData.txt_horast = totalHours;
          groupData.txt_maxmember = maxMembers;
          groupData.txt_travel = travel ? "Sim" : 'Não';
          groupData.txt_log = generateDocumentString();
          groupData.txt_totalhours = `${formatCurrencyBR(project_hours_cost)}`;
          groupData.txt_period = ` de ${formatDateBR(startDate)} até ${formatDateBR(endDate)}`;
      
          // Push the groupData object into the inputs array
          console.log(groupData);
          inputs.push(groupData);
      }

      generate({ template, inputs, plugins }).then((pdf) => {
        const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
        window.open(URL.createObjectURL(blob));
        setGenerating(false);
        sucesssNotify();
      });
  
    })
    .catch((error: any) => {
      if (error instanceof RangeError) {

      }
      setGenerating(false);
      console.error(error);
    })
    .finally( () => {
      
    })
  
  })

}

export default function Page() {
  const { projectId } = useProject();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [generating, setGenerating] = useState(false);

  return (
    <main>
      <UserHeader />
      <PathBurguer nextpath={'Relatórios'} />
      <p className={`${inter.className} mt-3 mb-2 text-xl md:text-2xl font-extrabold text-dashTitleColor-400`}>
        Relatórios
      </p>

      <div className="mt-8 flex-wrap md:flex">
        <div className="mb-4 ml-2">
          <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">Tipo </label>
          <select className="shadow appearance-none border rounded py-2 px-2 text-gray-700 w-52 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400">
            <option>Custo Horas Finais</option>
          </select>
        </div>

        <div className="mb-4 ml-2">
          <label htmlFor="start_date" className="block text-gray-700 text-sm font-bold mb-2">De:</label>
          <input
            onChange={(e) => setStartDate(e.target.value)}
            required
            id="start_date"
            name="start_date"
            type="date"
            alt="Insira a data de inicio"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
          />
        </div>

        <div className="mb-4 ml-2">
          <label htmlFor="end_date" className="block text-gray-700 text-sm font-bold mb-2">Até </label>
          <input
            onChange={(e) => setEndDate(e.target.value)}
            id="end_date"
            name="end_date"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-gray-400"
            required
          />
        </div>

        <Button className='flex items-center justify-between bg-activeColor-400 mt-5 ml-4 h-12' onClick={() => generateHandler(projectId, startDate, endDate, setGenerating)}>
          <p className={`${inter.className} text-sm text-defaultColor-100`}>Gerar</p>
        </Button>
      </div>
      {generating && (<p>Gerando seu relátorio</p>)}
      <ToastContainer position="top-right" />
    </main>
  );
}
