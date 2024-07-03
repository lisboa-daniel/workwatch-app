import { Revenue } from './definitions';

import { selectedProject, setSelectedProject, getSelectedProject } from '@/globals';


export async function fetchPdfAsArrayBuffer() {
  const response = await fetch(`/sample.pdf`); // Adjust the path as needed
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}




export function formatDate(dateString: string ): string   {
  const date = new Date(dateString);
  const isoString = date.toISOString(); // Converts to UTC and returns in ISO 8601 format
  return isoString.split('T')[0]; // Extracts the date part (YYYY-MM-DD)

}


// utils/delay.ts
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCurrentDate = (): string => {
  const dataAtual = new Date();
  const options = { timeZone: 'America/Sao_Paulo' };

  return dataAtual.toLocaleDateString('pt-BR', options);
};

export const generateDocumentString = (): string => {
  const dataAtual = new Date();
  const options = { timeZone: 'America/Sao_Paulo' };
  
  const dateStr = getCurrentDay();
  const timeStr = dataAtual.toLocaleTimeString('pt-BR', options);

  return `Documento gerado por workwatch em ${dateStr} às ${timeStr}`;
};

export const formatDateBR = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

export const getCurrentDay = () => {
    // Dias da semana em Português
    const diasSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    // Meses do ano em Português
    const mesesAno = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  
    // Obter a data atual
    const dataAtual = new Date();
    
    // Configurar o timezone para Brasília (BRT)
    const options = { timeZone: 'America/Sao_Paulo' };
  
    // Obter o dia da semana e o número do dia
    const dataString = dataAtual.toLocaleString('pt-BR', options);
    const diaSemana = diasSemana[dataAtual.getDay()];
    const dia = dataAtual.getDate();
  
    // Obter o mês e o ano
    const mes = mesesAno[dataAtual.getMonth()];
    const ano = dataAtual.getFullYear();
  
    // Montar a string formatada
    const dataFormatada = `${diaSemana}, ${dia} de ${mes} de ${ano}`;
  
    // Retornar a data formatada
    return dataFormatada;
  };
  
  export function formatCurrencyBR(numberValue: number | string): string {
    // Ensure the input is a number
    const numericValue = typeof numberValue === 'number' ? numberValue : parseFloat(numberValue.replace(',', '.'));
  
    if (isNaN(numericValue)) {
      return ''; // Return an empty string or placeholder for invalid inputs
    }
  
    // Format the number to two decimal places and replace the dot with a comma
    const formattedNumber = numericValue.toFixed(2).replace('.', ',');
    return `R$ ${formattedNumber}`;
  }
  


export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`${i / 1000}h`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
