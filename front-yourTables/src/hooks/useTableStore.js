import { useSelector, useDispatch } from 'react-redux';

import { localidades, personas, usuarios, coordinadores, dirigentes, adherentes, asistentes, barrios, jurisdicciones, acciones, eventos, instituciones, EventosPersona, PersonasEncontradas } from '../store/tables/tablesSlice';
import yourTablesApi from '../api/yourTablesApi.js';
import { formatKeyToTitle } from "../helpers/filteredTables.js";
import { collectionFields } from '../helpers/getTitles.js';


export const useTablesStore = () => {

  const { activeTable, titles, tableContent, currentPage, totalPages, totalRecords } = useSelector(state => state.tables)
  const dispatch = useDispatch();

  const handleResponse = (data, data2, action, nombreDeTabla) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      dispatch(action({
        titles: [],
        tableContent: [],
        currentPage: 1,
        totalPages: 0,
        totalRecords: 0
      }));
      return;
    }
  
    const dataArray = Array.isArray(data) ? data : [data];
  
    const fields = collectionFields[nombreDeTabla];
    if (!fields) {
      console.warn(`No hay campos definidos para la colección "${nombreDeTabla}".`);
      return;
    }
  
    const titulosObtenidos = fields.map(title => formatKeyToTitle(title));
  
    const formattedContent = dataArray.map(item => {
      const formattedItem = {};
      fields.forEach(key => {
        const formattedKey = formatKeyToTitle(key);
        formattedItem[formattedKey] = item[key] ?? "";
      });
      return formattedItem;
    });
  
    const paginaActual = data2?.currentPage ?? 1;
    const paginasTotales = data2?.totalPages ?? 1;
    const totalRegistros = data2?.totalRecords ?? dataArray.length;
  
    dispatch(action({
      titles: titulosObtenidos,
      tableContent: formattedContent,
      currentPage: paginaActual,
      totalPages: paginasTotales,
      totalRecords: totalRegistros
    }));
  };
  
  

  const activeUsuarios = async () => {
    try {
      const { data } = await yourTablesApi.get('/usuario');
      handleResponse(data.data, null, usuarios, 'usuarios');
    } catch (error) {
      console.log(error);
    }
  }

  const activePersonas = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/persona?page=${page}`, {withCredentials: true});
      handleResponse(data.data.data, data.data, personas, 'personas');
    } catch (error) {
      console.log(error);
    }
  }
  const activeCoordinadores = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/coordinador/by-page?page=${page}`);

      handleResponse(data.data.data, data.data, coordinadores, 'coordinadores');
    } catch (error) {
      console.log(error);
    }
  }

  const activeDirigentes = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/dirigente/by-page?page=${page}`);
      handleResponse(data.data.data, data.data, dirigentes, 'dirigentes');

    } catch (error) {
      console.log(error);
    }
  }

  const activeAdherentes = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/adherente/by-page?page=${page}`);
      handleResponse(data.data.data, data.data, adherentes, 'adherentes');

    } catch (error) {
      console.log(error);
    }
  }

  const activeLocalidades = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/localidad/by-page?page=${page}`);

      handleResponse(data.data.data, data.data, localidades, 'localidades');
    } catch (error) {
      console.log(error);
    }
  }
  const activeBarrios = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/barrio/by-page?page=${page}`);
      handleResponse(data.data.data, data.data, barrios, 'barrios');
    } catch (error) {
      console.log(error);
    }
  }

  const activeJurisdicciones = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/jurisdiccion/by-page?page=${page}`);

      handleResponse(data.data.data, data.data, jurisdicciones, 'jurisdicciones');
    } catch (error) {
      console.log(error);
    }
  }
  const activeAcciones = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/accion/by-page?page=${page}`);

      handleResponse(data.data.data, data.data, acciones, 'acciones');
    } catch (error) {
      console.log(error);
    }
  }

  const activeEventos = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/evento/by-page?=${page}`);

      handleResponse(data.data.data, data.data, eventos, 'eventos');
    } catch (error) {
      console.log(error);
    }
  }

  const activeInstituciones = async (page = 1) => {

    try {
      const { data } = await yourTablesApi.get(`/institucion/by-page?page=${page}`);

      handleResponse(data.data.data, data.data, instituciones, 'instituciones');
    } catch (error) {
      console.log(error);
    }
  }

  // Funciones para obtener registros de las tablas
  const getUsuarios = async () => {
    try {
      const { data } = await yourTablesApi.get('/usuario');
      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getBarrios = async () => {

    try {
      const { data } = await yourTablesApi.get('/barrio');

      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getJurisdicciones = async () => {

    try {
      const { data } = await yourTablesApi.get('/jurisdiccion');

      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getAcciones = async () => {

    try {
      const { data } = await yourTablesApi.get('/accion');

      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getInstituciones = async () => {
    try {
      const { data } = await yourTablesApi.get('/institucion');

      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getLocalidades = async () => {
    try {
      const { data } = await yourTablesApi.get('/localidad');

      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getUbiEventos = async () => {
    try {
      const { data } = await yourTablesApi.get('/evento');
      // console.log(data.data);
      return data.data;
    } catch (error) {
      console.log(error);
    }
  }
  const getUbiPersonas = async () => {
    try {
      const { data } = await yourTablesApi.get('/persona');
      return data.data;
    } catch (error) {
      console.log(error)
    }
  }
  const getPersonasConCargo = async () => {
    try {
      // const { data } = await yourTablesApi.get('/persona/con-cargo');
      const { data } = await yourTablesApi.get('/jerarquia');
      return data.data;
    } catch (error) {
      console.log(error)
    }
  }
  const getAllPersonas = async () => {
    try {
      const { data } = await yourTablesApi.get('/persona/ubiPersonas');
      return data.data;
    } catch (error) {
      console.log(error)
    }
  };
  const getEventosByPersona = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/persona/buscar-persona/${id}`);
      handleResponse(data.data, null, EventosPersona, 'EventosPersona');
    } catch (error) {
      console.log(error);
    }
  };
  const buscadorPersona = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/persona/encontrar/${id}`);
      console.log(data.data);
      handleResponse(data.data, null, PersonasEncontradas, 'PersonasEncontradas');
    } catch (error) {

    }
  };
  const getOrganizadorEventos = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/persona/buscar-organizador/${id}`);
      return (data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return {

    // * Propiedades
    activeTable,
    titles,
    tableContent,
    currentPage,
    totalPages,
    totalRecords,

    // * Metodos
    activeUsuarios,
    activePersonas,
    activeLocalidades,
    activeCoordinadores,
    activeBarrios,
    activeJurisdicciones,
    activeDirigentes,
    activeAdherentes,
    activeEventos,
    getUsuarios,
    getBarrios,
    getJurisdicciones,
    getAcciones,
    getInstituciones,
    getUbiEventos,
    getUbiPersonas,
    getPersonasConCargo,
    getLocalidades,
    activeAcciones,
    activeInstituciones,
    getEventosByPersona,
    buscadorPersona,
    getAllPersonas,
    getOrganizadorEventos

  }
}