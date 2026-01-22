import { useDispatch } from 'react-redux';
import { institucionesEncontradas } from '../store/tables/datosSlice.js'
import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from '../hooks/useTableStore.js';

import { toast } from 'sonner';
import { handleApiError } from '../api/handleApiError.js';


export const useInstitucionStore = () => {

  const { activeInstituciones } = useTablesStore();
  const dispatch = useDispatch();

  const crearInstitucion = async ({
    nombreInstitucion,
    encargadoInstitucion,
    localidadInstitucion,
    barrioInstitucion,
    direccionInstitucion,
    ubicacion }) => {
    try {
      const { data } = await yourTablesApi.post('/institucion', {
        nombreInstitucion: nombreInstitucion,
        encargadoODirector: encargadoInstitucion,
        localidad: localidadInstitucion,
        barrio: barrioInstitucion || null,
        direccion: direccionInstitucion,
        ubicacion
      });
      activeInstituciones();
      toast.success('Se registro una Institución exitosamente', {
        description: 'Institución Creada',
        duration: 2500
      })

      return data.data;

    } catch (error) {
      handleApiError(error, "Error al registrar Institución");
    }
  }

  const buscarInstituciones = async ({ valor }) => {

    try {
      const { data } = await yourTablesApi.get(`/institucion/buscar?nombre=${valor}`);
      if (!data || !data.data) {
        toast.warning("No se encontraron instituciones");
        return [];
      }
      dispatch(institucionesEncontradas({ instituciones: data.data }));
      return data.data

    } catch (error) {
      console.log('Error al buscar instituciones:', error);
      toast.error('Hubo un problema al buscar las instituciones');
    }
  }

  const eliminarInstitucion = async (idInstitucion) => {
    try {
      const { data } = await yourTablesApi.delete(`/institucion/${idInstitucion}`)
      activeInstituciones();
      toast.success('Se eliminó el registro de Institución', {
        duration: 2500
      })
      console.log('se elimino institucion', data);
      return data.data
    } catch (error) {
      console.log('soy un error del front', error);
    }
  }

  const editarInstitucion = async ({
    id,
    nombreInstitucion,
    encargadoODirector,
    localidad,
    barrio,
    direccion,
    ubicacion
  }) => {
    try {
      const { data } = await yourTablesApi.put(`/institucion/${id}`, {
        nombreInstitucion,
        encargadoODirector,
        localidad,
        barrio,
        direccion,
        ubicacion
      });
      if (data) {
        activeInstituciones();
        toast.success('Se edito la Institución correctamente', {
          duration: 2500
        })
      }
      return data.data;
    } catch (error) {
      handleApiError(error, "Error al editar Institución");
    }
  }

  const buscarInstitucionPorId = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/institucion/${id}`);
      return data.data;
    } catch (error) {
      console.log('Error al obtener una Institución')
    }
  }

  return {

    // * Propiedades

    // * Metodos
    crearInstitucion,
    buscarInstituciones,
    eliminarInstitucion,
    editarInstitucion,
    buscarInstitucionPorId

  }
}