import { useState } from "react";

export const useModalEstructuraMapa = () => {
    
    const [isOpenModalEstructura, setIsOpenModalEstructura] = useState(false);
    const [selectedEstructura, setSelectedEstructura] = useState(false)

    const openModalEstructura = (estructura) => {
        setSelectedEstructura(estructura);
        setIsOpenModalEstructura(true);
    };

    const closeModalEstructura = () => {
        setSelectedEstructura(null);
        setIsOpenModalEstructura(false);
    };

    return {
        isOpenModalEstructura,
        selectedEstructura,
        openModalEstructura,
        closeModalEstructura
    }
}