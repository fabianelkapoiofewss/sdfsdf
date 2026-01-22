import { toast } from 'sonner';
import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from './useTableStore.js';
import { handleApiError } from '../api/handleApiError.js';

export const useJurisdiccionStore = () => {

    const { activeJurisdicciones } = useTablesStore();

    const crearJurisdiccion = async ({
        nombreJurisdiccion,
        barrios
    }) => {
        try {
            const { data } = await yourTablesApi.post('/jurisdiccion', {
                nombreJurisdiccion,
                barrios
            });
            activeJurisdicciones();
            toast.success('Se registró una nueva Jurisdiccion exitosamente', {
                description: 'Jurisdiccion Creada',
                duration: 2500
            })
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al crear Jurisdicción");
        }
    }

    const obtenerJurisdiccionPorId = async (jurisId) => {
        try {
            const { data } = await yourTablesApi.get(`/jurisdiccion/${jurisId}`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    }

    const editarJurisdiccion = async ({
        id,
        nombreJurisdiccion,
        barrios
    }) => {
        try {
            const { data } = await yourTablesApi.put(`/jurisdiccion/${id}`, {
                nombreJurisdiccion,
                barrios
            });
            if (data) {
                activeJurisdicciones();
                toast.success('Se editó la Jurisdiccion exitosamente', {
                    duration: 2500
                })
            }
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al editar Barrio");
        }
    }

    const eliminarJurisdiccion = async (jurisId) => {
        try {
            const { data } = await yourTablesApi.delete(`/jurisdiccion/${jurisId}`);
            activeJurisdicciones();
            toast.success('Se elimino el Registro de Jurisdiccion', {
                duration: 2500
            });
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al eliminar Jurisdiccion");
        }
    }

    return {

        // * Propiedades

        // * Metodos
        crearJurisdiccion,
        obtenerJurisdiccionPorId,
        editarJurisdiccion,
        eliminarJurisdiccion
    }
}