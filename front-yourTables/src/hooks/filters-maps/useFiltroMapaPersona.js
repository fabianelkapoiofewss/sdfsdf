import { useState } from "react";
import { usePersonaStore } from "../usePersonaStore";
import { useTablesStore } from "../useTableStore";
import { toast } from "sonner";

export const useFiltroMapaPersona = () => {

    const { buscarPersonas } = usePersonaStore();
    const { getOrganizadorEventos } = useTablesStore();

    const [personas, setPersonas] = useState([]);
    const [selectedPartPolitico, setSelectedPartPolitico] = useState([]);
    const [inputBusqueda, setInputBusqueda] = useState('');
    const [selectedOption, setSelectedOption] = useState('dni');
    const [searchPerformed, setSearchPerformed] = useState(false);
    const [resultadoBusqueda, setResultadoBusqueda] = useState([]);
    const [errorBusqueda, setErrorBusqueda] = useState(null);

    const handleOptionClick = (type) => {
        setSelectedOption(type);
        setInputBusqueda("");
        setSearchPerformed(false);
        setResultadoBusqueda([]);
        setErrorBusqueda(null);
    }

    const handleBuscar = async (e) => {
        e.preventDefault();
        setErrorBusqueda(null);

        if (!selectedOption || !inputBusqueda.trim()) {
            alert("Por favor complete todos los campos.");
            return;
        }

        try {
            const resultado = await buscarPersonas({ campo: selectedOption, valor: inputBusqueda.trim() });

            if (resultado.length > 0) {
                setResultadoBusqueda(resultado);
                setInputBusqueda('');
                setSearchPerformed(true);
                // console.log('se encontraron resultados', resultado);
            } else {
                setInputBusqueda('');
                setResultadoBusqueda([]);
                toast.error("No se encontró ninguna persona con esos datos.");
                setErrorBusqueda("No se encontró ninguna persona con esos datos.");
            }
        } catch (error) {
            console.error("Error al buscar:", error);
            setErrorBusqueda("Ocurrió un error en la búsqueda.");
        }
    }

    const handleBuscarOrganizador = async (e) => {
        e.preventDefault();
        setErrorBusqueda(null);

        const dni = inputBusqueda.trim();
        if (!dni) {
            alert("Por favor ingrese un DNI.");
            return;
        }

        try {
            
            const resultado = await buscarPersonas({ campo: "dni", valor: dni });

            if (resultado.length > 0) {
                const organizador = resultado[0];
                await getOrganizadorEventos(organizador._id);
                setInputBusqueda('');
            } else {
                toast.error("No se encontró ninguna persona con ese DNI.");
                setErrorBusqueda("No se encontró ninguna persona con ese DNI.");
            }
        } catch (error) {
            console.error("Error al buscar organizador:", error);
            setErrorBusqueda("Ocurrió un error en la búsqueda del organizador.");
        }
    };

    const getPlaceholder = () => {
        switch (selectedOption) {
            case "dni": return "Ingrese DNI";
            case "apellido": return "Ingrese Apellido";
            case "nombre": return "Ingrese Nombre";
            default: return "Ingrese valor";
        }
    };

    const filtroPartPolitico = Array.isArray(personas) ? personas.filter((persona) => {
        const cumplePartPolitico =
            selectedPartPolitico.length > 0
                ? selectedPartPolitico.includes(persona.votaPor)
                : true;

        return cumplePartPolitico;
    }) : [];

    return {
        handleOptionClick,
        handleBuscar,
        handleBuscarOrganizador,
        getPlaceholder,
        inputBusqueda,
        setInputBusqueda,
        resultadoBusqueda,
        searchPerformed,
        errorBusqueda,
        selectedOption,
        filtroPartPolitico,
        selectedPartPolitico, 
        setSelectedPartPolitico,
        personas, setPersonas
    };
}