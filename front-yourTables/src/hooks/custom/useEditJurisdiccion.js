import { useUiStore } from "../useUiStore";
import { useEffect, useState } from "react";
import { useJurisdiccionStore } from "../useJurisdiccionStore";
import { useTablesStore } from "../useTableStore";

export const useEditJurisdiccion = (id) => {
    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarJurisdiccion, obtenerJurisdiccionPorId } = useJurisdiccionStore();
    const { getBarrios } = useTablesStore();

    const [nombreJurisdiccion, setNombreJurisdiccion] = useState('');
    const [barriosData, setBarriosData] = useState([]);
    const [barriosSelect, setBarriosSelect] = useState([]);

    useEffect(() => {
        const fetchBarrios = async () => {
            try {
                const barrios = await getBarrios();
                setBarriosData(barrios);

                if (id) {
                    const jurisdiccion = await obtenerJurisdiccionPorId(id);
                    setNombreJurisdiccion(jurisdiccion.nombreJurisdiccion);
                    setBarriosSelect(jurisdiccion.barrios.map(b => b._id));
                }
            } catch (error) {
                console.error("Error obteniendo el barrio:", error);
            }
        };

        if (modalAbierto === "EditJurisdiccion" && id) {
            fetchBarrios();
        }

    }, [modalAbierto, id]);

    const toggleBarrio = (barrioId) => {
        setBarriosSelect((prev) =>
            prev.includes(barrioId)
                ? prev.filter((id) => id !== barrioId)
                : [...prev, barrioId]
        );
    };

    const handleEditJurisdiccion = async (e) => {
        e.preventDefault();
        try {
            const response = await editarJurisdiccion({
                id,
                nombreJurisdiccion,
                barrios: barriosSelect || [],
            });

            if (response) {
                cerrarModal();
            }
        } catch (error) {
            console.error("Error al editar Jurisdiccion:", error);
        }
    };

    return {
        modalAbierto,
        cerrarModal,
        nombreJurisdiccion,
        setNombreJurisdiccion,
        barriosData,
        barriosSelect,
        toggleBarrio,
        handleEditJurisdiccion
    };
};
