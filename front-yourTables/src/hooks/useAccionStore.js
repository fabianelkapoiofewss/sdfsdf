import { handleApiError } from '../api/handleApiError.js';
import yourTablesApi from '../api/yourTablesApi.js';

import { useTablesStore } from '../hooks/useTableStore.js';

import { toast } from 'sonner';


export const useAccionStore = () => {

  const { activeAcciones } = useTablesStore();

  const crearAccion = async ({
    nombreAccion,
  }) => {
    try {
      const { data } = await yourTablesApi.post('/accion', {
        nombreAccion,
      })
      if (data) {
        activeAcciones();
        toast.success('Acción registrada exitosamente', {
          duration: 2500
        })
      }
      return data.data
    } catch (error) {
      handleApiError(error, "Error al registrar Acción");
    }
  }

  const editarAccion = async ({
    id,
    nombreAccion
  }) => {
    try {
      const { data } = await yourTablesApi.put(`/accion/${id}`, {
        nombreAccion
      });
      if (data) {
        activeAcciones();
        toast.success('Se editó la Acción exitosamente', {
          duration: 2500
        })
      }
      return data.data;
    } catch (error) {
      handleApiError(error, "Error al editar Acción");
    }
  }

  const eliminarAccion = async (accionId) => {
    try {
      const { data } = await yourTablesApi.delete(`/accion/${accionId}`);
      activeAcciones();
      toast.success('Se elimino el Registro de Accion', {
        duration: 2500
      });
      return data.data;
    } catch (error) {
      console.log('soy un error del front', error);
    }
  }

  const obtenerAccionById = async (accionId) => {
    try {
        const { data } = await yourTablesApi.get(`/accion/${accionId}`);
        return data.data;
    } catch (error) {
        handleApiError(error, "Error al obtener Acción");
    }
}


  return {
    crearAccion,
    eliminarAccion,
    editarAccion,
    obtenerAccionById
  }
};