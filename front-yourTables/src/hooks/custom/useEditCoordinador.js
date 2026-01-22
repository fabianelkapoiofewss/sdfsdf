import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUiStore } from '../../hooks/useUiStore';
import { usePersonaStore } from '../usePersonaStore';
import { useTablesStore } from '../useTableStore';
import { useCoordinadorStore } from '../useCoordinadorStore';

import { toast } from 'sonner';

export const useEditCoordinador = (id) => {

    const { modalAbierto, cerrarModal } = useUiStore();
    const { editarCoordinador, obtenerCoordinador } = useCoordinadorStore();
    const { getJurisdicciones } = useTablesStore();

    const { personas } = useSelector(state => state.datos);

    const [coordinadorData, setCoordinadorData] = useState(null);

    const [step, setStep] = useState(1);

    const [selectedPersonaId, setSelectedPersonaId] = useState(null);
    const [personasACargo, setPersonasACargo] = useState([]);

    const [jurisdicciones, setJurisdicciones] = useState([]);
    const [jurisdiccionesSeleccionadas, setJurisdiccionesSeleccionadas] = useState([]);

    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");

    const handleRemovePersona = (persona) => {
        setPersonasACargo(prev => prev.filter(p => p._id !== persona._id));
    }

    const handleSelectPersona = (persona) => {
        setPersonasACargo((prev) => {
            if (prev.some(p => p._id === persona._id)) {
                toast.error("Esta persona ya ha sido agregada.");
                return prev;
            }
            if (persona.cargo === "Coordinador de Jurisdicción" || persona.cargo === "Adherente") {
                toast.error("Error", {
                    description:`${persona.apellido} ${persona.nombre} tiene asignado el cargo de ${persona.cargo}. 
                        Selecciona una persona sin cargo o un Dirigente sin Superior`,
                    duration: 6000
                })
                return prev;
            }
            return [...prev, persona];
        });
    };

    const fetchCoordinador = async () => {
        try {
            const data = await obtenerCoordinador(id);
            setCoordinadorData(data);
            setSelectedPersonaId(data.persona._id);
            setPersonasACargo(data.personasACargo);
            setJurisdiccionesSeleccionadas(data.jurisdiccionACargo);
            setFechaDesde(data.fechaDesde ? new Date(data.fechaDesde).toISOString().split("T")[0] : "");
            setFechaHasta(data.fechaHasta ? new Date(data.fechaHasta).toISOString().split("T")[0] : "");
            console.log(data);
        } catch (error) {
            console.error("Error al obtener el coordinador:", error);
        }
    };

    useEffect(() => {
        if (modalAbierto === 'EditCoordinador' && id) {
            fetchCoordinador();
        }
    }, [modalAbierto, id]);


    useEffect(() => {
        const fetchJurisdicciones = async () => {
            try {
                const data = await getJurisdicciones();
                setJurisdicciones(data);
            } catch (error) {
                console.error("Error al obtener las jurisdicciones:", error);
            }
        };
        if (modalAbierto === 'EditCoordinador' && id) {
            fetchJurisdicciones();
        }
    }, [modalAbierto, id]);

    const handleSelectJurisdiccion = (e) => {
        const jurisdiccionSeleccionada = jurisdicciones.find(j => j._id === e.target.value);
        if (jurisdiccionSeleccionada && !jurisdiccionesSeleccionadas.some(j => j._id === jurisdiccionSeleccionada._id)) {
            setJurisdiccionesSeleccionadas(prev => [...prev, jurisdiccionSeleccionada]);
        }
    };

    const handleRemoveJurisdiccion = (jurisdicciones) => {
        setJurisdiccionesSeleccionadas(prev => prev.filter(j => j._id !== jurisdicciones._id));
    };

    const handleEditarCoordinador = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id,
                persona: selectedPersonaId,
                personasACargo: personasACargo.map(p => p._id).filter(Boolean),
                fechaDesde,
                fechaHasta,
                jurisdiccionACargo: jurisdiccionesSeleccionadas.length > 0
                ? jurisdiccionesSeleccionadas.map(j => j._id)
                : coordinadorData?.jurisdiccionACargo?.map(j => j._id) || [],
            };
    
            const response = await editarCoordinador(payload);
            console.log("Respuesta de la edición:", response);
            if (response) {
                setStep(1);
                cerrarModal();
            }
        } catch (error) {
            console.error("Error al editar el coordinador:", error);
        }
    };

    const handleNext = () => {
        setStep(step + 1);
    }

    const handlePrevious = () => {
        if (step >= 2) {
            setStep(step - 1);
        }
    }

    return {
        modalAbierto, cerrarModal,
        jurisdicciones, jurisdiccionesSeleccionadas,
        handleSelectJurisdiccion, handleRemoveJurisdiccion,
        handleSelectPersona,handleRemovePersona,
        handleEditarCoordinador,
        personas, personasACargo,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        step, handleNext, handlePrevious,
    }
}