import { toast } from 'sonner';
import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from './useTableStore.js';
import { handleApiError } from '../api/handleApiError.js';

export const useBarrioStore = () => {

    const { activeBarrios } = useTablesStore();

    const crearBarrio = async ({
        nombreBarrio,
    }) => {
        try {
            const { data } = await yourTablesApi.post('/barrio', {
                nombreBarrio,
            });
            if (data) {
                activeBarrios();
                toast.success('Se registró una nuevo Barrio exitosamente', {
                    description: 'Barrio Creado',
                    duration: 2500
                })
            }
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al registrar Barrio");
        }
    }

    const eliminarBarrio = async (barrioId) => {
        try {
            const { data } = await yourTablesApi.delete(`/barrio/${barrioId}`);
            activeBarrios();
            toast.success('Se elimino el Barrio exitosamente', {
                duration: 2500
            })
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al eliminar Barrio");
        }
    }

    const editarBarrio = async ({
        id,
        nombreBarrio
    }) => {
        try {
            const { data } = await yourTablesApi.put(`/barrio/${id}`, {
                nombreBarrio
            });
            if (data) {
                activeBarrios();
                toast.success('Se editó el Barrio exitosamente', {
                    duration: 2500
                })
            }
            return data.data;
        } catch (error) {
            console.log(error)
            handleApiError(error, "Error al editar Barrio");
        }
    }

    const obtenerBarrioById = async (barrioId) => {
        try {
            const { data } = await yourTablesApi.get(`/barrio/${barrioId}`);
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al obtener Barrio");
        }
    }

    return {

        // * Propiedades

        // * Metodos
        crearBarrio,
        eliminarBarrio,
        editarBarrio,
        obtenerBarrioById,
    }
}