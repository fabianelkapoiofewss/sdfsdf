import yourTablesApi from '../api/yourTablesApi.js';
import { useTablesStore } from './useTableStore.js';
import { toast } from 'sonner';
import { handleApiError } from '../api/handleApiError.js';

export const useAdherenteStore = () => {

    const { activeAdherentes } = useTablesStore();

    const crearAdherente = async ({
        persona,
        superioresACargo,
        barriosACargo,
        fechaDesde,
        fechaHasta,
    }) => {
        try {
            const { data } = await yourTablesApi.post('/adherente', {
                persona,
                superioresACargo,
                barriosACargo,
                estado: 'Activo',
                fechaDesde,
                fechaHasta,
            });
            if (data) {
                activeAdherentes();
                toast.success('Se registró un Adherente exitosamente', {
                    description: 'Adherente creado',
                    duration: 2500,
                });
            }
            return data.data
        } catch (error) {
            handleApiError(error, "Error al registrar Adherente");
        }
    };

    const eliminarAdherente = async (idAdherente) => {
        try {
            const { data } = await yourTablesApi.delete(`/adherente/${idAdherente}`);
            activeAdherentes();
            toast.success('Se elimino el Adherente exitosamente', {
                duration: 2500
            });
            return data.data
        } catch (error) {
            handleApiError(error, "Error al eliminar Adherente");
        }
    }

    const editarAdherente = async ({
        id,
        persona,
        superioresACargo,
        barriosACargo,
        fechaDesde,
        fechaHasta,
    }) => {
        try {
            const { data } = await yourTablesApi.put(`/adherente/${id}`, {
                persona,
                superioresACargo,
                barriosACargo,
                fechaDesde,
                fechaHasta,
            });
            if (data) {
                activeAdherentes();
                toast.success('Se editó un Adherente exitosamente', {
                    description: 'Adherente editado',
                    duration: 2500,
                });
            }
            return data.data
        } catch (error) {
            handleApiError(error, "Error al editar Adherente");
        }
    };

    const obtenerAdherente = async (id) => {
        try {
            const { data } = await yourTablesApi.get(`/adherente/${id}`);
            return data.data;
        } catch (error) {
            console.log('Error al obtener el dirigente:', error);
        }
    };

    return {
        crearAdherente,
        eliminarAdherente,
        editarAdherente,
        obtenerAdherente
    }
}