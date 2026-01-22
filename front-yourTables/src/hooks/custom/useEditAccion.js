import { useUiStore } from "../useUiStore";
import { useAccionStore } from "../useAccionStore";
import { useEffect, useState } from "react";

export const useEditAccion = (id) => {
    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarAccion, obtenerAccionById } = useAccionStore();

    const [nombreAccion, setNombreAccion] = useState('');

    const fetchAccion = async () => {
        try {
            const accion = await obtenerAccionById(id);
            console.log("Accion obtenida:", accion);
            if (accion) {
                setNombreAccion(accion.nombreAccion);
            }
        } catch (error) {
            console.error("Error obteniendo la accion:", error);
        }
    };

    const handleEditAccion = async (e) => {
        e.preventDefault();

        try {
            const response = await editarAccion({
                id,
                nombreAccion, 
            });

            if (response) {
                cerrarModal();
            }
        } catch (error) {
            console.error("Error al editar la acción:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === "EditAccion" && id) {
            fetchAccion();
        }
    }, [modalAbierto, id]);

    return {
        modalAbierto,
        cerrarModal,
        handleEditAccion,
        nombreAccion,
        setNombreAccion
    };
};