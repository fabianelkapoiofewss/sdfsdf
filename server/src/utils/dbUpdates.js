import { adherenteModel } from "../modules/models/adherente.js";
import { dirigenteModel } from "../modules/models/dirigente.js";
import { personaModel } from "../modules/models/persona.js";

export const updateSubordinates = async (subordinates, superiorId, field) => {
    if (!Array.isArray(subordinates) || subordinates.length === 0) {
        console.error(`No se recibieron subordinados para actualizar.`);
        return;
    }

    const validSubordinates = subordinates.filter(id => id);
    for (const subordinateId of validSubordinates) {
        try {
            const { model, registroId } = await identifyModel(subordinateId);

            if (model && registroId) {
                const updateResult = await model.findByIdAndUpdate(
                    registroId,
                    { $addToSet: { [field]: superiorId } },
                    { new: true }
                );

                if (!updateResult) {
                    console.error(`Fallo al actualizar el registro con ID ${registroId}: No se encontró el documento.`);
                } else {
                    console.log(`Registro actualizado exitosamente`);
                }
            }
        } catch (err) {
            console.error(`Error al actualizar el subordinado con ID de persona: ${subordinateId}`, err.message);
        }
    }
};



export const updateSuperiors = async (superiorId, newSubordinates, field, currentModel) => {
    const existing = await currentModel.findById(superiorId).populate(field);

    if (existing) {
        const existingIds = existing[field].map(doc => doc._id.toString());
        const removedSubordinates = existingIds.filter(id => !newSubordinates.includes(id));

        for (const removedId of removedSubordinates) {
            const model = await identifyModel(removedId);
            if (model) {
                await model.findByIdAndUpdate(removedId, {
                    $pull: { superioresACargo: superiorId }
                });
            }
        }
    }
};

const identifyModel = async (id) => {
    if (!id) {
        console.error(`ID de persona inválido: ${id}`);
        return null;
    }

    const persona = await personaModel.findById(id);
    if (!persona) {
        console.error(`No se encontró una persona con ID ${id}`);
        return null;
    }

    const dirigente = await dirigenteModel.findOne({ persona: persona._id });
    if (dirigente) {
        return { model: dirigenteModel, registroId: dirigente._id };
    }

    let adherente = await adherenteModel.findOne({ persona: persona._id });
    if (adherente) {
        return { model: adherenteModel, registroId: adherente._id };
    }

    try {
        adherente = new adherenteModel({ persona: persona._id, estado: 'Activo' });
        await adherente.save();
        console.log(`Nuevo adherente creado para la persona ${id}`);
        return { model: adherenteModel, registroId: adherente._id };
    } catch (error) {
        console.error(`Error al crear adherente para la persona ${id}:`, error);
        return null;
    }
};