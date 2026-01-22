import yourTablesApi from '../api/yourTablesApi.js';

import { useTablesStore } from './useTableStore.js';
import { handleApiError } from '../api/handleApiError.js';
import { toast } from 'sonner';


export const useUsuarioStore = () => {

    const { activeUsuarios } = useTablesStore()

    const crearUsuario = async ({
        nombreUsuario,
        contrasena
    }) => {
        try {
            const { data } = await yourTablesApi.post('/usuario', {
                nombreUsuario,
                contrasena
            });
            if (data) {
                activeUsuarios()
                toast.success('Usuario registrado exitosamente', {
                    duration: 2500
                })

            }
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al registrar Usuario");
        }
    }

    const obtenerUsuarioId = async (id) => {
        try {
            const { data } = await yourTablesApi.get(`/usuario/${id}`);
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al obtener Usuario");
        }
    }

    const editarUsuario = async ({
        id,
        nombreUsuario,
        contrasena
    }) => {
        try {
            const { data } = await yourTablesApi.put(`/usuario/${id}`, {
                nombreUsuario,
                contrasena
            });
            if (data) {
                activeUsuarios()
                toast.success('Se editó el Usuario exitosamente', {
                    duration: 2500
                })
            }
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al editar Usuario");
        }
    }

    const eliminarUsuario = async (id) => {
        try {
            const { data } = await yourTablesApi.delete(`/usuario/${id}`);
            activeUsuarios()
            toast.success('Se elimino el Usuario exitosamente', {
                duration: 2500
            })
            return data.data;
        } catch (error) {
            handleApiError(error, "Error al eliminar Usuario");
        }
    }

    return {
        crearUsuario,
        editarUsuario,
        obtenerUsuarioId,
        eliminarUsuario
    }
}