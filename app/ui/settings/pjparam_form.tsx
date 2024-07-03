import { fetchProjectParam, fetchProjectsData, fetchRoleData } from "@/app/lib/data";
import { useEffect, useState } from "react";

interface Project {
    id: string;
    title: string;
    description: string;
}


import CurrencyInput from 'react-currency-input-field';

import {ProjectParam} from '@/app/lib/definitions';
import { saveProjectParam } from "@/app/lib/actions";
import { ToastContainer, toast } from "react-toastify";
import { formatCurrencyBR } from "@/app/lib/utils";
import { number } from "zod";

export default function ProjectParamForm() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState('');
    const [roles, setRoles] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [paramFields, setParamFields] = useState<ProjectParam[]>([]);
    const [toSaveParam, setToSaveParam] = useState<ProjectParam[]>([]);

    const [loading, setLoading] = useState(true);
    const [projectSelected, setProjectSelected] = useState(false); // Track if a project is selected

    const handlerSetValue = (num : number | null | undefined, index:number) => {
        const newParamFields = [...paramFields];
        if (num) newParamFields[index].value = num;
        setParamFields(newParamFields)
    }

    

    const saveData = async () => {
        try {
            saveProjectParam(toSaveParam);
            
        } catch (error) {
            const errorNotify = () => toast.error("Falha ao salvar Parametros");
            errorNotify();
            throw error;
        }
        finally {
            const sucesssNotify = () => toast.success("Parametros salvos");
            sucesssNotify();
        }
    }

    const handlerFind = async () => {
        try {
            const rolesData = await fetchRoleData(projectId);
            if (rolesData) {
                setRoles(rolesData);
                setProjectSelected(true);
                const paramData = await fetchProjectParam(projectId);
                if (paramData){
                    setParamFields(paramData);
                }



            }
        } catch (err) {
            console.log(`Erro ao recuperar funções: ${err}`);
        }
    };

    

    const handleAddParam = () => {
        if (selectedRole && !paramFields.some(field => field.param_name === `${selectedRole}_cost`)) { 

            const newParam = { id:'', project_id: projectId,param_name: `${selectedRole}_cost`, value: 0 };
            setToSaveParam([...toSaveParam, newParam]);
            setParamFields([...paramFields, newParam]);

        }



    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projectsData = await fetchProjectsData(true);
                if (projectsData) setProjects(projectsData);
            } catch (err) {
                console.log(`Erro ao recuperar dados de projetos: ${err}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <main>
            {loading && <p>Carregando informações...</p>}
            {!loading && (
                <div>
                    <div className="flex mt-8">
                        <div className="mb-4 ml-2">
                            <label htmlFor="projeto" className="block text-gray-700 text-sm font-bold mb-2">
                                Projeto
                            </label>

                            <div className="flex items-center">
                                <select
                                    className="shadow appearance-none border rounded py-2 px-2 text-gray-700 w-[450px] text-sm leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={(e) => {
                                        setProjectId(e.target.value);
                                        setProjectSelected(false); // Reset projectSelected when a new project is selected
                                    }}
                                    value={projectId}
                                >
                                    <option value="" disabled>Selecione um projeto</option>
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.title}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    className="text-white font-extrabold rounded-lg p-2 flex items-center justify-center bg-activeColor-400 ml-4 h-10"
                                    onClick={handlerFind}
                                >
                                    Pesquisar
                                </button>
                            </div>

                            {projectSelected && ( // Render role selection section only if a project is selected
                                <>
                                    <label htmlFor="parametros_projeto" className="mt-4 block text-gray-700 text-sm font-bold mb-2">
                                       Parâmetros
                                    </label>

                                    <div className="mt-2 flex items-center">
                                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mr-2">
                                            Função
                                        </label>
                                        <select
                                            id="role"
                                            className="shadow appearance-none border rounded py-2 px-2 text-gray-700 text-sm leading-tight focus:outline-none focus:shadow-outline"
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            value={selectedRole}
                                        >
                                            <option value="" disabled>Selecione uma função</option>
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            className="text-white font-extrabold rounded-lg p-2 flex items-center justify-center bg-activeColor-400 ml-4 h-10"
                                            onClick={handleAddParam}
                                        >
                                            Adicionar
                                        </button>
                                    </div>

                                    {paramFields.map((field, index) => (
                                        <div key={index} className="mt-2 flex items-center">
                                            <label htmlFor={`param_${index}`} className="block text-gray-700 text-sm font-bold mr-2">
                                                Parâmetro
                                            </label>
                                            <input
                                                id={`param_${index}`}
                                                type="text"
                                                defaultValue={field.param_name}
                                                
                                                className="p-1 rounded text-xs mr-2 w-full"
                                            />
                                            <label htmlFor={`value_${index}`} className="block text-gray-700 text-sm font-bold mr-2">
                                                Valor
                                            </label>

                                            <CurrencyInput
                                            id="value"
                                            name="value"
                                            decimalsLimit={2}
                                            prefix='R$'
                                            placeholder="Entre com um valor"
                                            defaultValue={field.value}
                                           
                                            onValueChange={(value, name, values) => handlerSetValue(values?.float, index)}
                                             />
                                           
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        className="text-white font-extrabold rounded-lg p-4 flex items-center justify-center bg-activeColor-400 mt-5 ml-4 h-12"
                        onClick={saveData}
                    >
                        Salvar
                    </button>
                </div>
            )}

                <ToastContainer position="top-right" />
        </main>
    );
}
