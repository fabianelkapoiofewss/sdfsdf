import { useState } from "react";

export const useModalPersonaMapa = () => {
    const [isOpenModalPersona, setIsOpenModalPersona] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(false)

    const openModalPersona = (persona) => {
        setSelectedPersona(persona);
        setIsOpenModalPersona(true);
    };

    const closeModalPersona = () => {
        setSelectedPersona(null);
        setIsOpenModalPersona(false);
    };

    return {
        isOpenModalPersona,
        selectedPersona,
        openModalPersona,
        closeModalPersona
    }
}