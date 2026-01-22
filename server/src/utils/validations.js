import { personaModel } from "../modules/models/persona.js";
import { AppError } from "./handleError.js";

export const validateHierarchy = async (subordinates, validModels = []) => {
    for (const subordinateId of subordinates) {
        const persona = await personaModel.findById(subordinateId);
        if (!persona) {
            throw new Error(`La persona con ID ${subordinateId} no existe.`);
        }

        for (const exclusionModel of validModels) {
            const isExcluded = await exclusionModel.findOne({ persona: subordinateId });
            if (isExcluded) {
                throw new Error(`La persona con ID ${subordinateId} ya está registrada en ${exclusionModel.collection.collectionName} y no puede ser agregada.`);
            }
        }
    }
};

export const preventCycles = async (id, subordinates, currentModel) => {
    const coordinador = await currentModel.findById(id).populate("personasACargo");
    if (coordinador) {
        const checkCycle = (nodeId, visited) => {
            if (visited.has(nodeId)) return true;
            visited.add(nodeId);
            return nodeId === id;
        };

        for (const subordinateId of subordinates) {
            const persona = await personaModel.findById(subordinateId);
            if (persona) {
                const visited = new Set();
                if (checkCycle(persona._id, visited)) {
                    throw new Error("Se detectó un ciclo en la jerarquía.");
                }
            }
        }
    }
};