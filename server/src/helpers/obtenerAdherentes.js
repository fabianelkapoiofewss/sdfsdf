import { adherenteModel } from "../modules/models/adherente.js";

export const obtenerAdherentes = async (coordinadores) => {
    const dirigentesIds = coordinadores
        .flatMap(d => d.personasACargo.map(d => d._id)); // Extraigo los IDs de los dirigentes
    
    const adherentes = await adherenteModel   
        .find({ superioresACargo: { $in: dirigentesIds } }) // Busco los adherentes relacionados con los dirigentes
        .populate({
            path: 'persona',
            select: 'nombre apellido dni cargo ubicacion'
        })
        .lean(); // Importante para trabajar con objetos planos de Mongoose

    // Mapeo de dirigentes a sus adherentes
    const adherenteMap = {};
    adherentes.forEach(adherente => {
        adherente.superioresACargo.forEach(dirigenteId => {
            const dirigenteKey = dirigenteId.toString();
            if (!adherenteMap[dirigenteKey]) {
                adherenteMap[dirigenteKey] = []; // Inicializo array si no existe
            }
            adherenteMap[dirigenteKey].push(adherente.persona);
        });
    });

    // Agregar adherentes a los dirigentes dentro de los coordinadores
    const coordinadoresConJerarquia = coordinadores.map(coord => {
        const coordObj = { ...coord }; // Copia del coordinador

        coordObj.personasACargo = coordObj.personasACargo.map(dirigente => {
            return {
                ...dirigente,
                Adherentes: adherenteMap[dirigente._id.toString()] || [] // Agrego todos los adherentes
            };
        });

        return coordObj;
    });

    return coordinadoresConJerarquia;
};