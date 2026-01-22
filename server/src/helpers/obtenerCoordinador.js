import { coordinadorJurisdiccionModel } from "../modules/models/coordinadorJurisdiccion.js";

export const obtenerCoordinador = async (adherentes) => {
    const dirigentesIds = adherentes
        .flatMap(d => d.superioresACargo.map(d => d._id)); 

    const coordinadores = await coordinadorJurisdiccionModel
        .find({ personasACargo: { $in: dirigentesIds } })
        .populate({
            path: 'persona',
            select: 'nombre apellido dni cargo'
        })
        .exec()

    const coordinadorMap = {};
    coordinadores.forEach(coord => {
        coord.personasACargo.forEach(dirigenteId => {
            coordinadorMap[dirigenteId.toString()] = coord.persona;
        });
    });

    const adherentesConJerarquia = adherentes.map(adherente => {
        
        const adherenteObj = { ...adherente };

        adherenteObj.superioresACargo = adherenteObj.superioresACargo.map(superior => {
            return {
                ...superior,
                Coordinador: coordinadorMap[superior._id.toString()]
            }
        });

        return adherenteObj;
    });

    return adherentesConJerarquia;
};