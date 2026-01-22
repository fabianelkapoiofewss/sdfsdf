import { useUiStore } from "../useUiStore";
import { useLocalidadStore } from "../useLocalidadStore";
import { useEffect, useState } from "react";

export const useEditLocalidad = (id) => {
    const { modalAbierto, cerrarModal } = useUiStore();
    const {  editarLocalidad, obtenerLocalidadById } = useLocalidadStore();

    const [nombreLocalidad, setNombreLocalidad] = useState('');
    const [departamento, setDepartamento] = useState('');

    const fetchLocalidad = async () => {
        try {
            const localidad = await obtenerLocalidadById(id);
            console.log('Se obtuvo la localidad:', localidad);
            if (localidad) {
                setNombreLocalidad(localidad.nombreLocalidad);
                setDepartamento(localidad.departamento);
            }
        } catch (error) {
            console.error("Error obteniendo la localidad:", error);
        }
    };

    const handleEditLocalidad = async (e) => {
        e.preventDefault();

        try {
            const response = await editarLocalidad({
                id,
                nombreLocalidad,
                departamento 
            });

            if (response) {
                cerrarModal();
            }
        } catch (error) {
            console.error("Error al editar la localidad:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === "EditLocalidad" && id) {
            fetchLocalidad();
        }
    }, [modalAbierto, id]);

    return {
        modalAbierto,
        cerrarModal,
        handleEditLocalidad,
        nombreLocalidad,
        setNombreLocalidad,
        departamento,
        setDepartamento
    };
};