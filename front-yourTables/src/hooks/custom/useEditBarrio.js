import { useUiStore } from "../useUiStore";
import { useBarrioStore } from "../useBarrioStore";
import { useEffect, useState } from "react";

export const useEditBarrio = (id) => {
    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarBarrio, obtenerBarrioById } = useBarrioStore();

    const [nombreBarrio, setNombreBarrio] = useState('');

    const fetchBarrio = async () => {
        try {
            const barrio = await obtenerBarrioById(id);
            if (barrio) {
                setNombreBarrio(barrio.nombreBarrio);
            }
        } catch (error) {
            console.error("Error obteniendo el barrio:", error);
        }
    };

    const handleEditBarrio = async (e) => {
        e.preventDefault();

        try {
            const response = await editarBarrio({
                id,
                nombreBarrio, 
            });

            if (response) {
                cerrarModal();
            }
        } catch (error) {
            console.error("Error al editar el barrio:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === "EditBarrio" && id) {
            fetchBarrio();
        }
    }, [modalAbierto, id]);

    return {
        modalAbierto,
        cerrarModal,
        handleEditBarrio,
        nombreBarrio,
        setNombreBarrio
    };
};