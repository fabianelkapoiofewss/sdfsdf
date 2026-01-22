import { adherenteModel } from "../models/adherente.js";
import { personaModel } from "../models/persona.js";
import { dirigenteModel } from "../models/dirigente.js";
import { deleteById, getForId } from "../../utils/getRegisters.js";
import { mongooseErrorHandler } from "../../utils/handleError.js";
import { obtenerJurisdiccionYJerarquia } from "../../helpers/obtenerJurisdiccion.js";


export const adherenteService = {
    async crearAdherente(adherente) {
        try {
            const { superioresACargo } = adherente;
            const persona = await personaModel.findById(adherente.persona);
            if (!persona) {
                throw new AppError(`La persona con ID ${adherente.persona} no existe.`, 404);
            }
            if (persona.cargo !== 'Sin cargo') {
                throw new AppError(`La persona seleccionada para Adherente ya tiene un cargo asignado: ${persona.cargo}. No puede ser Adherente.`, 400);
            }
            const superiorId = superioresACargo[0];
            const dirigenteSuperior = await dirigenteModel.findOne({ persona: superiorId });
            if (!dirigenteSuperior) {
                throw new AppError(`La persona con ID ${superiorId} no es un Dirigente, por lo que no puede ser superior de un Adherente.`, 400);
            }

            const nuevoAdherente = await adherenteModel.create({
                ...adherente
            });

            await dirigenteModel.findByIdAndUpdate(
                dirigenteSuperior._id,
                { $addToSet: { personasACargo: nuevoAdherente.persona } }
            );
            await personaModel.findByIdAndUpdate(nuevoAdherente.persona, { cargo: 'Adherente' });
            return nuevoAdherente;

        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async crearAdherentes(personas, superiorId) {
        try {
            for (const personaId of personas) {
                const persona = await getForId(personaModel, personaId);
                if (persona.cargo === 'Sin cargo' || !persona.cargo) {
                    const nuevoAdherente = new adherenteModel({
                        persona: personaId,
                        superioresACargo: [superiorId],  // dirigente como superior
                        estado: 'Activo',
                    });
                    await nuevoAdherente.save();
                    await personaModel.findByIdAndUpdate(personaId, { cargo: 'Adherente' });
                } else if (persona.cargo === 'Adherente') {

                    const adherente = await adherenteModel.findOne({ persona: personaId });
                    if (!adherente) {
                        throw new AppError(`La persona con ID ${personaId} figura como adherente pero no tiene registro.`, 400);
                    }
                    if (!adherente.superioresACargo || adherente.superioresACargo.length === 0) {
                        adherente.superioresACargo = [superiorId];
                        await adherente.save();
                    }
                }
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerAdherentes() {
        try {
            const adherentes = await adherenteModel
                .find()
                .sort({ _id: -1 })
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni -_id'
                })
                .populate({
                    path: 'barriosACargo',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'superioresACargo', // traigo los dirigentes
                    select: 'nombre apellido cargo'
                })

            const adherentesCompleto = await obtenerJurisdiccionYJerarquia(adherentes);
            return adherentesCompleto;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async getAllAdherentesByPage(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const adherentes = await adherenteModel
                .find()
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ _id: -1 })
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni -_id'
                })
                .populate({
                    path: 'barriosACargo',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'superioresACargo', // traigo los dirigentes
                    select: 'nombre apellido cargo'
                })

            const adherentesCompleto = await obtenerJurisdiccionYJerarquia(adherentes);

            const totalAdherentes = await adherenteModel.countDocuments();

            return {
                data: adherentesCompleto,
                currentPage: page,
                totalPages: Math.ceil(totalAdherentes / PAGE_SIZE),
                totalRecords: totalAdherentes
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerAdherentePorId(id) {
        try {
            const adherente = await adherenteModel.findById(id)
                .populate({
                    path: 'barriosACargo',
                    select: 'nombreBarrio'
                });
            if (!adherente) {
                throw new Error('No se encontró el adherente');
            }
            return adherente;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async eliminarAdherentePorId(adherenteId) {
        try {
            const personaEliminada = await deleteById(adherenteModel, adherenteId)
            if (personaEliminada) {
                await personaModel.findByIdAndUpdate(personaEliminada.persona, { cargo: 'Sin cargo' });
                await dirigenteModel.updateMany(
                    { personasACargo: personaEliminada.persona },
                    {
                        $pull: { personasACargo: personaEliminada.persona }
                    });
                return personaEliminada
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async actualizarAdherente(id, adherente) {
        try {
            const { barriosACargo = [], estado, desde, hasta } = adherente;

            const adherenteActual = await adherenteModel.findById(id);
            if (!adherenteActual) {
                throw new Error('No se encontró el adherente');
            }

            // Mantener los existentes y agregar los nuevos sin duplicados
            const nuevosBarriosACargo = [
                ...new Set([...adherenteActual.barriosACargo.map(String), ...barriosACargo.map(String)])
            ];

            // Validaciones
            if (!Array.isArray(barriosACargo)) {
                console.error('Los barrios a cargo deben ser un arreglo de IDs de barrios');
            }

            const estadosValidos = ['Activo', 'Inactivo'];
            if (estado && !estadosValidos.includes(estado)) {
                throw new Error('Estado inválido');
            }

            if (desde && hasta && new Date(hasta) < new Date(desde)) {
                throw new Error('La fecha de finalización no puede ser anterior a la de inicio');
            }

            const updateData = {};
            if (estado) updateData.estado = estado;
            if (desde) updateData.desde = desde;
            if (hasta) updateData.hasta = hasta;

            const adherenteActualizado = await adherenteModel.findByIdAndUpdate(id,
                {
                    $set: updateData,
                    $addToSet: {
                        barriosACargo: { $each: nuevosBarriosACargo }
                    }
                },
                { new: true }
            );

            if (!adherenteActualizado) {
                throw new Error('No se encontró el adherente');
            }


            return adherenteActualizado;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    }
};