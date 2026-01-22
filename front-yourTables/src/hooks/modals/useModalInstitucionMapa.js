import { useState } from "react";

export const useModalInstitucionMapa = () => {
    const [isOpenModalInstitucion, setIsOpenModalInstitucion] = useState(false);
    const [selectedInstitucion, setSelectedInstitucion] = useState(false)

    const openModalInstitucion = (institucion) => {
        setSelectedInstitucion(institucion);
        setIsOpenModalInstitucion(true);
    };

    const closeModalInstitucion = () => {
        setSelectedInstitucion(null);
        setIsOpenModalInstitucion(false);
    };

    return {
        isOpenModalInstitucion,
        selectedInstitucion,
        openModalInstitucion,
        closeModalInstitucion
    }
}