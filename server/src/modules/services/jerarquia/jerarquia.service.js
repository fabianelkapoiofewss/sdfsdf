import { mongooseErrorHandler } from "../../../utils/handleError.js";
import { coordinadorJurisdiccionModel } from "../../models/coordinadorJurisdiccion.js";
import { dirigenteModel } from "../../models/dirigente.js";
import { adherenteModel } from "../../models/adherente.js";
import { obtenerJurisdiccionPersona } from "../../../helpers/obtenerJurisdiccion.js";
import { obtenerCoordinador } from "../../../helpers/obtenerCoordinador.js";
import { obtenerAdherentes } from "../../../helpers/obtenerAdherentes.js";

export const jerarquiaService = {
    async getAllPersonasConCargo(collections) {
        try {
            const personasConCargo = await Promise.all(collections.map(async (collection) => {
                let populateConfig = [
                    {
                        path: 'persona',
                        select: 'nombre apellido dni cargo barrio ubicacion -_id',
                        match: { 
                            cargo: { $exists: true, $ne: null, $ne: "", $ne: "Sin cargo" },
                        },
                        populate: { path: 'barrio', select: 'nombreBarrio' }
                    }
                ];

                // Configuración de populate según el modelo
                if (collection === coordinadorJurisdiccionModel) {
                    populateConfig.push(
                        { path: 'jurisdiccionACargo', select: 'nombreJurisdiccion _id' },
                        { path: 'personasACargo', select: 'dni nombre apellido cargo ubicacion' }
                    );

                    const coordinadores = await collection.find({}, '-__v').populate(populateConfig).lean();

                    const coordinadoresConJerarquia = await obtenerAdherentes(coordinadores);
                    return coordinadoresConJerarquia;

                } else if (collection === dirigenteModel) {
                    populateConfig.push(
                        { path: 'barriosACargo', select: 'nombreBarrio' },
                        { path: 'personasACargo', select: 'dni nombre apellido cargo ubicacion' },
                        { path: 'superioresACargo', select: 'nombre apellido cargo dni ' }
                    );
                } else if (collection === adherenteModel) {
                    populateConfig.push(
                        { path: 'barriosACargo', select: 'nombreBarrio' },
                        { path: 'superioresACargo', select: 'nombre apellido cargo dni' }
                    );

                    const adherentes = await collection.find({}, '-__v').populate(populateConfig).lean();

                    const adherentesConJerarquia = await obtenerCoordinador(adherentes);
                    return adherentesConJerarquia;
                }

                const personas = await collection
                    .find({ }, '-__v')
                    .sort({ _id: -1 })
                    .populate(populateConfig)
                    .lean();

                return personas.filter(persona => persona.persona);
            }));

            const personasFlat = personasConCargo.flat();
            const personasConJurisdiccion = await obtenerJurisdiccionPersona(personasFlat);

            return personasConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    }
};