import { useUiStore } from "../useUiStore";
import { useUsuarioStore } from "../useUsuarioStore";
import { useEffect, useState } from "react";

export const useEditUsuario = (id) => {
    
    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarUsuario, obtenerUsuarioId } = useUsuarioStore();

    const [nombreUsuario, setNombreUsuario] = useState('');
    const [contrasena, setContrasena] = useState('')

    const fetchUsuario = async () => {
        try {
            const usuario = await obtenerUsuarioId(id);
            if (usuario) {
                setNombreUsuario(usuario.nombreUsuario);
                setContrasena(usuario.contrasena)
            }
        } catch (error) {
            console.error("Error obteniendo el usuario:", error);
        }
    };

    const handleEditUsuario = async (e) => {
        e.preventDefault();

        try {
            const response = await editarUsuario({
                id,
                nombreUsuario, 
                contrasena
            });

            if (response) {
                cerrarModal();
            }
        } catch (error) {
            console.error("Error al editar el usuario:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === "EditUsuario" && id) {
            fetchUsuario();
        }
    }, [modalAbierto, id]);

    return {
        modalAbierto,
        cerrarModal,
        handleEditUsuario,
        nombreUsuario,
        setNombreUsuario,
        contrasena,
        setContrasena,
    };
};