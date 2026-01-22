import { toast } from 'sonner';
import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from './useTableStore.js';
import { handleApiError } from '../api/handleApiError.js';

export const useLocalidadStore = () => {

    const { activeLocalidades } = useTablesStore();

    const crearLocalidad = async ({
        nombreLocalidad,
        departamento
    }) => {
        try {
            const { data } = await yourTablesApi.post('/localidad', {
                nombreLocalidad,
                departamento
            });
            activeLocalidades();
            toast.success('Se registró una nueva Localidad exitosamente', {
                description: 'Localidad Creado',
                duration: 2500
            })
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al crear la Localidad");
        }
    }

    const eliminarLocalidad = async (localId) => {
        try {
            const { data } = await yourTablesApi.delete(`/localidad/${localId}`);
            activeLocalidades();
            toast.success('Se elimino la localidad exitosamente', {
                duration: 2500
            })
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al eliminar la Localidad");
        }
    }

    const editarLocalidad = async ({
        id,
        nombreLocalidad,
        departamento
    }) => {
        try {
            const { data } = await yourTablesApi.put(`/localidad/${id}`, {
                nombreLocalidad,
                departamento
            });
            if (data) {
                activeLocalidades();
                toast.success('Se editó la Localidad exitosamente', {
                    duration: 2500
                })
            }
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al editar Localidad");
        }
    }

    const obtenerLocalidadById = async (localId) => {
        try {
            const { data } = await yourTablesApi.get(`/localidad/${localId}`);
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al obtener la Localidad");
        }
    }

    return {

        // * Propiedades

        // * Metodos
        crearLocalidad,
        eliminarLocalidad,
        editarLocalidad,
        obtenerLocalidadById,
    }
}