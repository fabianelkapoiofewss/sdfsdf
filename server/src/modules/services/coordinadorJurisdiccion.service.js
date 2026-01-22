import { coordinadorJurisdiccionModel } from "../models/coordinadorJurisdiccion.js";
import { personaModel } from "../models/persona.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { validatePersonasDisponiblesParaCoordinador, removerSuperioresDeDirigentes } from "../../helpers/validateCargo.js";
import { dirigenteService } from "./dirigente.service.js";
import { dirigenteModel } from "../models/dirigente.js";
import { deleteById, getForId } from "../../utils/getRegisters.js";
import { validateFecha } from "../../helpers/validateDate.js";


export const coordinadorJurisdiccionService = {

    async obtenerCoordinador(id) {
        return await getForId(coordinadorJurisdiccionModel, id);
    },

    async crearCoordinadorJurisdiccion(coordinador) {
        try {
            const { personasACargo } = coordinador;

            const persona = await personaModel.findById(coordinador.persona);

            if (!persona) {
                throw new AppError(`La persona con ID ${coordinador.persona} no existe.`, 404);
            }
            if (persona.cargo !== 'Sin cargo') {
                throw new AppError(`La persona seleccionada para Coordinador ya tiene un cargo asignado: ${persona.cargo}. No puede ser registrado.`, 400);
            }
            if (!Array.isArray(personasACargo)) {
                console.error('Las personas a cargo deben ser un arreglo de IDs de personas');
            } else if (personasACargo.length > 0) {

                await validatePersonasDisponiblesParaCoordinador(personasACargo);

                const coordinadorJurisdiccion = await coordinadorJurisdiccionModel.create({
                    ...coordinador,
                    personasACargo: []
                });

                const superiorPersonaId = coordinadorJurisdiccion.persona;

                await dirigenteService.crearDirigentes(personasACargo, superiorPersonaId);

                await coordinadorJurisdiccionModel.findByIdAndUpdate(
                    coordinadorJurisdiccion._id,
                    { personasACargo },
                    { new: true }
                );

                await personaModel.findByIdAndUpdate(superiorPersonaId, { cargo: "Coordinador de Jurisdicción" });

                return coordinadorJurisdiccion;
            }

        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerCoordinadoresJurisdiccion() {
        try {
            const coordinadoresJurisdiccion = await coordinadorJurisdiccionModel
                .find({ persona: { $type: "objectId" } }) // Asegura que persona sea un ObjectId válido
                .sort({ _id: -1 })
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni -_id',
                    match: { $expr: { $ne: ["$persona", null] } }, // Excluye documentos donde persona sea null
                })
                .populate({
                    path: 'jurisdiccionACargo',
                    select: 'nombreJurisdiccion -_id'
                })
                .populate({
                    path: 'personasACargo',
                    select: 'dni nombre apellido cargo -_id'
                });

            const resultadosFiltrados = coordinadoresJurisdiccion.filter(coord => coord.persona !== null);

            return resultadosFiltrados
        } catch (error) {
            throw new AppError(error.message, 500);
        }
    },

    async getAllCoordinadoresByPage(page = 1) {
        try {

            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const coordinadoresJurisdiccion = await coordinadorJurisdiccionModel
                .find({ persona: { $type: "objectId" } }) // Asegura que persona sea un ObjectId válido
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ _id: -1 })
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni -_id',
                    match: { $expr: { $ne: ["$persona", null] } }, // Excluye documentos donde persona sea null
                })
                .populate({
                    path: 'jurisdiccionACargo',
                    select: 'nombreJurisdiccion -_id'
                })
                .populate({
                    path: 'personasACargo',
                    select: 'dni nombre apellido cargo -_id'
                });

            const resultadosFiltrados = coordinadoresJurisdiccion.filter(coord => coord.persona !== null);
            const totalCoordinadores = await coordinadorJurisdiccionModel.countDocuments()
            return {
                data: resultadosFiltrados,
                currentPage: page,
                totalPages: Math.ceil(totalCoordinadores / PAGE_SIZE),
                totalRecords: totalCoordinadores
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerCoordinadorJurisdiccionPorId(id) {
        try {
            const coordinadorJurisdiccion = await coordinadorJurisdiccionModel
                .findById(id)
                .populate('personasACargo')
                .populate({
                    path: 'jurisdiccionACargo',
                    select: 'nombreJurisdiccion _id'
                });
            if (!coordinadorJurisdiccion) {
                throw new Error('No se encontro el coordinadorJurisdiccion');
            }
            return coordinadorJurisdiccion;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async eliminarCoordinadorJurisdiccion(coordinadorId) {
        try {
            const coordinadorEliminado = await deleteById(coordinadorJurisdiccionModel, coordinadorId);
            if (coordinadorEliminado) {
                await personaModel.findByIdAndUpdate(coordinadorEliminado.persona, { cargo: 'Sin cargo' });
                await dirigenteModel.updateMany(
                    { superioresACargo: coordinadorEliminado.persona },
                    { $pull: { superioresACargo: coordinadorEliminado.persona } }
                )
                return coordinadorEliminado;
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerCoordinadorConPersonasACargo(dni) {
        try {
            const persona = await personaModel.findOne({ dni });
            if (!persona) {
                throw new AppError('No se encontro la persona', 404);
            }

            const coordinadorJurisdiccion = await coordinadorJurisdiccionModel.findOne()
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni -_id',
                    match: { dni },
                })
                .populate({
                    path: 'personasACargo',
                    select: 'dni nombre apellido cargo ubicacion -_id',
                });

            if (!coordinadorJurisdiccion || !coordinadorJurisdiccion.persona) {
                throw new AppError('No se encontró el coordinador o la persona asociada', 404);
            }

            return coordinadorJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async actualizarCoordinadorJurisdiccion(coordinadorId, coordinadorActualizado) {
        try {
            const coordinador = await getForId(coordinadorJurisdiccionModel, coordinadorId);

            if ("jurisdiccionACargo" in coordinadorActualizado) {
                if (
                    Array.isArray(coordinadorActualizado.jurisdiccionACargo) &&
                    coordinadorActualizado.jurisdiccionACargo.length > 0
                ) {
                    if (coordinadorActualizado.jurisdiccionACargo.length > 2) {
                        throw new AppError("jurisdiccionACargo no puede tener más de 2 valores.", 400);
                    }
                    coordinador.jurisdiccionACargo = coordinadorActualizado.jurisdiccionACargo;
                }
            }

            if (coordinadorActualizado.fechaDesde || coordinadorActualizado.fechaHasta) {
                await validateFecha(coordinador, coordinadorActualizado);
            }

            if ("personasACargo" in coordinadorActualizado) {
                if (!Array.isArray(coordinadorActualizado.personasACargo)) {
                    throw new AppError("personasACargo debe ser un array.", 400);
                }

                const actuales = coordinador.personasACargo.map(id => id.toString());
                const actualizadas = coordinadorActualizado.personasACargo.map(id => id.toString());

                const nuevasPersonas = actualizadas.filter(id => !actuales.includes(id));
                const personasRemovidas = actuales.filter(id => !actualizadas.includes(id));

                await validatePersonasDisponiblesParaCoordinador(nuevasPersonas);

                await dirigenteService.crearDirigentes(nuevasPersonas, coordinador.persona);

                await removerSuperioresDeDirigentes(personasRemovidas, coordinador.persona);

                coordinador.personasACargo = actualizadas;
            }

            await coordinador.save();
            return coordinador;

        } catch (error) {
            mongooseErrorHandler(error);
        }
    }
};