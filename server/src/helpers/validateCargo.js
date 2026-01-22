import { adherenteModel } from "../modules/models/adherente.js";
import { dirigenteModel } from "../modules/models/dirigente.js";
import { personaModel } from "../modules/models/persona.js";
import { getForId } from "../utils/getRegisters.js";
import { AppError } from "../utils/handleError.js";

export const validatePersonasSinCargo = async (personas) => {
    for (const personaId of personas) {
        const persona = await personaModel.findById(personaId);
        if (!persona) {
            throw new AppError(`La persona con ID ${personaId} no existe.`, 404);
        }
        if (persona.cargo !== 'Sin cargo') {
            throw new AppError(`La persona con ID ${personaId} ya tiene un cargo asignado: ${persona.cargo}`, 400);
        }
    }
};

export const validatePersonasDisponiblesParaCoordinador = async (personas) => {
    for (const personaId of personas) {
        const persona = await getForId(personaModel, personaId);
        if (persona.cargo === 'Sin cargo' || !persona.cargo) {
            continue; 
        }
        if (persona.cargo === 'Dirigente') {
            const dirigente = await dirigenteModel.findOne({ persona: personaId });
            if (!dirigente) {
                throw new AppError(`La persona con ID ${personaId} figura como Dirigente pero no tiene registro como tal.`, 400);
            }
            if (dirigente.superioresACargo && dirigente.superioresACargo.length > 0) {
                throw new AppError(`El Dirigente ${persona.apellido}, ${persona.nombre} ya tiene un Superior asignado. Selecciona una persona sin cargo o un Dirigente sin Superior.`, 400);
            }
            continue; 
        }

        throw new AppError(`La persona ${persona.apellido}, ${persona.nombre} tiene un cargo no permitido: ${persona.cargo}`, 400);
    }
};

export const validatePersonasDisponiblesParaDirigente = async (personas) => {
    for (const personaId of personas) {
        const persona = await getForId(personaModel, personaId);
        if (persona.cargo === 'Sin cargo' || !persona.cargo) {
            continue;
        }
        if (persona.cargo === 'Adherente') {
            const adherente = await adherenteModel.findOne({ persona: personaId });
            if (!adherente) {
                throw new AppError(`La persona con ID ${personaId} figura como Adherente pero no tiene registro como tal.`, 400);
            }
            if (adherente.superioresACargo && adherente.superioresACargo.length > 0) {
                throw new AppError(`El Adherente ${persona.apellido}, ${persona.nombre} ya tiene un Superior asignado. Selecciona una persona sin cargo o un Adherente sin Superior.`, 400);
            }
            continue;
        }
        throw new AppError(`La persona ${persona.apellido}, ${persona.nombre} tiene un cargo no permitido: ${persona.cargo}`, 400);
    }
}

export const removerSuperioresDeDirigentes = async(personasIds, superiorId) => {
    for (const personaId of personasIds) {
        const dirigente = await dirigenteModel.findOne({ persona: personaId });

        if (dirigente) {
            dirigente.superioresACargo = dirigente.superioresACargo.filter(id => id.toString() !== superiorId.toString());
            await dirigente.save();
        }
    }
}

export const removerSuperioresDeAdherentes = async(personasIds, superiorId) => {
    for (const personaId of personasIds) {
        const adherente = await adherenteModel.findOne({ persona: personaId });

        if (adherente) {
            adherente.superioresACargo = adherente.superioresACargo.filter(id => id.toString() !== superiorId.toString());
            await adherente.save();
        }
    }
}