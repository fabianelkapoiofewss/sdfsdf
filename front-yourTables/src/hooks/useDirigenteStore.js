import { useDispatch } from 'react-redux';

import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from '../hooks/useTableStore.js';

import { toast } from 'sonner';
import { handleApiError } from '../api/handleApiError.js';

export const useDirigenteStore = () => {
  const dispatch = useDispatch();

  const { activeDirigentes } = useTablesStore();

  const crearDirigente = async ({
    persona,
    superioresACargo,
    barriosACargo,
    personasACargo,
    fechaDesde,
    fechaHasta,
  }) => {
    try {
      const { data } = await yourTablesApi.post('/dirigente', {
        persona,
        superioresACargo,
        barriosACargo,
        personasACargo,
        estado: 'Activo',
        fechaDesde,
        fechaHasta,
      });
      if (data) {
        activeDirigentes();
        toast.success('Se registró un Dirigente exitosamente', {
          description: 'Dirigente creado',
          duration: 2500,
        });
      }
      return data.data
    } catch (error) {
      handleApiError(error, "Error al registrar Dirigente");
    }
  };

  const editarDirigente = async (
    {
      id,
      persona,
      superioresACargo,
      barriosACargo,
      personasACargo,
      fechaDesde,
      fechaHasta,
    }) => {
    try {
      const { data } = await yourTablesApi.put(`/dirigente/${id}`, {
        persona,
        superioresACargo,
        barriosACargo,
        personasACargo,
        fechaDesde,
        fechaHasta,
      });
      if (data) {
        activeDirigentes();
        toast.success('Se editó un Dirigente exitosamente', {
          description: 'Dirigente editado',
          duration: 2500,
        });
      }
      return data.data
    } catch (error) {
      handleApiError(error, "Error al editar Dirigente");
    }
  };

  const eliminarDirigente = async (id) => {
    try {
      const { data } = await yourTablesApi.delete(`/dirigente/${id}`);
      activeDirigentes();
      toast.success('Se elimino el Dirigente exitosamente', {
        duration: 2500,
      });
      return data.data
    } catch (error) {
      handleApiError(error, "Error al eliminar Dirigente");
    }
  };

  const obtenerDirigente = async (id) => {
    try {
      const { data } = await yourTablesApi.get(`/dirigente/${id}`);
      console.log('Se obtuvo el dirigente:', data.data);
      return data.data;
    } catch (error) {
      console.log('Error al obtener el dirigente:', error);
    }
  };

  return {

    crearDirigente,
    editarDirigente,
    eliminarDirigente,
    obtenerDirigente

  };
};