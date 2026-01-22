import { dirigenteModel } from "../models/dirigente.js";
import { adherenteModel } from "../models/adherente.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { personaModel } from "../models/persona.js";
import { coordinadorJurisdiccionModel } from "../models/coordinadorJurisdiccion.js";
import { removerSuperioresDeAdherentes, validatePersonasDisponiblesParaDirigente } from "../../helpers/validateCargo.js";
import { adherenteService } from "./adherente.service.js";
import { obtenerJurisdiccionPorBarriosACargo } from "../../helpers/obtenerJurisdiccion.js";
import { deleteById, getForId } from "../../utils/getRegisters.js";


export const dirigenteService = {
    async crearDirigente(dirigente) {
        try {
            const { personasACargo, superioresACargo } = dirigente;
            const persona = await personaModel.findById(dirigente.persona);
            if (!persona) {
                throw new AppError(`La persona con ID ${dirigente.persona} no existe.`, 404);
            }
            if (persona.cargo !== 'Sin cargo') {
                throw new AppError(`La persona seleccionada para Dirigente ya tiene un cargo asignado: ${persona.cargo}. No puede ser registrado.`, 400);
            }
            const superiorId = superioresACargo[0];
            console.log(superiorId);
            const coordinadorSuperior = await coordinadorJurisdiccionModel.findOne({ persona: superiorId });
            if (!coordinadorSuperior) {
                throw new AppError(`La persona con ID ${superiorId} no es un Coordinador de Jurisdicción, por lo que no puede ser superior de un Dirigente.`, 400);
            }
            if (!Array.isArray(personasACargo)) {
                console.error('Las personas a cargo deben ser un arreglo de IDs de personas');
            } else if (personasACargo.length > 0) {

                await validatePersonasDisponiblesParaDirigente(personasACargo);

                const nuevoDirigente = await dirigenteModel.create({
                    ...dirigente,
                    personasACargo: []
                });

                await adherenteService.crearAdherentes(personasACargo, dirigente.persona);

                await dirigenteModel.findByIdAndUpdate(
                    nuevoDirigente._id,
                    { personasACargo },
                    { new: true }
                );

                await coordinadorJurisdiccionModel.findByIdAndUpdate(
                    coordinadorSuperior._id,
                    { $addToSet: { personasACargo: nuevoDirigente.persona } }
                );
                await personaModel.findByIdAndUpdate(nuevoDirigente.persona, { cargo: "Dirigente" });
                
                return nuevoDirigente;
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async crearDirigentes(personas, superiorId) {
        try {
            for (const personaId of personas) {
                const persona = await getForId(personaModel, personaId);

                if (persona.cargo === 'Sin cargo' || !persona.cargo) {
                    const nuevoDirigente = new dirigenteModel({
                        persona: personaId,
                        superioresACargo: [superiorId],
                        estado: 'Activo',
                    });
                    await nuevoDirigente.save();

                    await personaModel.findByIdAndUpdate(personaId, { cargo: 'Dirigente' });
                } else if (persona.cargo === 'Dirigente') {
                    const dirigente = await dirigenteModel.findOne({ persona: personaId });

                    if (!dirigente) {
                        throw new AppError(`La persona con ID ${personaId} figura como dirigente pero no tiene registro.`, 400);
                    }

                    if (!dirigente.superioresACargo || dirigente.superioresACargo.length === 0) {
                        dirigente.superioresACargo = [superiorId];
                        await dirigente.save();
                    }
                }
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerDirigentePorId(id) {
        try {
            const dirigente = await dirigenteModel
                .findById(id)
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni _id'
                })
                .populate({
                    path: 'barriosACargo',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'personasACargo',
                    select: 'dni nombre apellido cargo _id'
                })
                .populate({
                    path: 'superioresACargo',
                    select: 'nombre apellido cargo -_id'
                });
            if (!dirigente) {
                throw new AppError('No se encontró el dirigente', 404);
            }
            return dirigente;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerDirigentes() {
        try {
            const dirigentes = await dirigenteModel
                .find()
                .sort({ _id: -1 })
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni'
                })
                .populate({
                    path: 'barriosACargo',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'personasACargo',
                    select: 'dni nombre apellido cargo'
                })
                .populate({
                    path: 'superioresACargo',
                    select: 'nombre apellido cargo'
                })

            const dirigentesConJurisdiccion = await obtenerJurisdiccionPorBarriosACargo(dirigentes);

            return dirigentesConJurisdiccion;

        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async getAllDirigentesByPage(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const dirigentes = await dirigenteModel
                .find()
                .sort({ _id: -1 })
                .populate({
                    path: 'persona',
                    select: 'nombre apellido dni'
                })
                .populate({
                    path: 'barriosACargo',
                    select: 'nombreBarrio'
                })
                .populate({
                    path: 'personasACargo',
                    select: 'dni nombre apellido cargo'
                })
                .populate({
                    path: 'superioresACargo',
                    select: 'nombre apellido cargo'
                })

            const dirigentesConJurisdiccion = await obtenerJurisdiccionPorBarriosACargo(dirigentes);

            const totalDirigentes = await dirigenteModel.countDocuments();

            return {
                data: dirigentesConJurisdiccion,
                currentPage: page,
                totalPages: Math.ceil(totalDirigentes / PAGE_SIZE),
                totalRecords: totalDirigentes
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async actualizarDirigente(id, dirigente) {
        try {
            const { personasACargo = [], barriosACargo = [], estado, fechaDesde, fechaHasta } = dirigente;
    
            const dirigenteActual = await getForId(dirigenteModel, id);
            const superiorId = dirigente.persona;
            
            const actuales = dirigenteActual.personasACargo.map(id => id.toString());
            const actualizadas = dirigente.personasACargo.map(id => id.toString());
            
            const nuevasPersonas = actualizadas.filter(id => !actuales.includes(id));
            const personasRemovidas = actuales.filter(id => !actualizadas.includes(id));
            
            await validatePersonasDisponiblesParaDirigente(nuevasPersonas);
            
            await adherenteService.crearAdherentes(personasACargo, superiorId);
            
            await removerSuperioresDeAdherentes(personasRemovidas, superiorId);
    
            await personaModel.findByIdAndUpdate(superiorId, { cargo: 'Dirigente' });
    
            const dirigenteActualizado = await dirigenteModel.findByIdAndUpdate(
                id,
                {
                    personasACargo: actualizadas,
                    barriosACargo,
                    estado,
                    fechaDesde,
                    fechaHasta
                },
                { new: true }
            );
    
            return dirigenteActualizado;
    
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async eliminarDirigente(dirigenteId) {
        try {
            const dirigenteEliminado = await deleteById(dirigenteModel, dirigenteId);
            if (dirigenteEliminado) {
                await personaModel.findByIdAndUpdate(dirigenteEliminado.persona, { cargo: 'Sin cargo' });
                await coordinadorJurisdiccionModel.updateMany(
                    { personasACargo: dirigenteEliminado.persona },
                    { $pull: { personasACargo: dirigenteEliminado.persona } }
                )
                await adherenteModel.updateMany(
                    { superioresACargo: dirigenteEliminado.persona },
                    { $pull: { superioresACargo: dirigenteEliminado.persona } }
                )
                return dirigenteEliminado;
            }
        } catch (error) {
            mongooseErrorHandler(error);
        }
    }
};