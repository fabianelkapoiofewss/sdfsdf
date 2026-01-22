import { useSelector, useDispatch } from 'react-redux';

import yourTablesApi from '../api/yourTablesApi.js';

import { useTablesStore } from '../hooks/useTableStore.js';

import { toast } from 'sonner';
import { handleApiError } from '../api/handleApiError.js';


export const useCoordinadorStore = () => {


  const { activeCoordinadores } = useTablesStore();

  const crearCoordinador = async ({
    persona,
    jurisdiccionACargo,
    personasACargo,
    fechaDesde
  }) => {
    try {
      const { data } = await yourTablesApi.post('/coordinador', {
        persona,
        jurisdiccionACargo,
        personasACargo,
        estado: 'Activo',
        fechaDesde,
      })
      if (data) {
        activeCoordinadores();
        toast.success('Se registro un Coordinador exitosamente', {
          description: 'Coordinador creado',
          duration: 2500
        })
        console.log('se creo coordinador', data);
      }
      return data.data
    } catch (error) {
      handleApiError(error, "Error al registrar Coordinador");
    }
  }

  const eliminarCoordinador = async (coordinadorId) => {
    try {
      const { data } = await yourTablesApi.delete(`/coordinador/${coordinadorId}`);
      activeCoordinadores();
      toast.success('Se elimino el Coordinador exitosamente', {
        duration: 2500
      });
      return data.data;
    } catch (error) {
      handleApiError(error, "Error al eliminar Coordinador");
    }
  }

  const obtenerCoordinador = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/coordinador/${id}`);
      return data.data;
    } catch (error) {
      handleApiError(error, "Error al obtener Coordinador");
    }
  }

  const editarCoordinador = async (
    {
      id,
      persona,
      jurisdiccionACargo,
      personasACargo,
      fechaDesde,
      fechaHasta,
    }) => {
    try {
      const { data } = await yourTablesApi.put(`/coordinador/${id}`, {
        persona,
        jurisdiccionACargo,
        personasACargo,
        fechaDesde,
        fechaHasta,
      })
      if (data) {
        activeCoordinadores();
        toast.success('Se edito un Coordinador exitosamente', {
          description: 'Coordinador editado',
          duration: 2500
        })
      }
      return data.data

    } catch (error) {
      handleApiError(error, "Error al editar Coordinador");
    }
  }


  return {

    // * Propiedades

    // * Metodos
    crearCoordinador,
    eliminarCoordinador,
    editarCoordinador,
    obtenerCoordinador

  }
}
