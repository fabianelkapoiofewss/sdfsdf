import { create, deleteById, getForId, updateById } from "../../utils/getRegisters.js";
import { jurisdiccionModel } from "../models/jurisdiccion.js";
import { barrioModel } from "../models/barrio.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";

export const jurisdiccionService = {
    async getJurisdicciones() {
        try {
            const jurisdicciones = await jurisdiccionModel
                .find()
                .sort({ _id: -1 })
                .populate({
                    path: 'barrios',
                    select: 'nombreBarrio -_id'
                });
            // if (!jurisdicciones) {
            //     throw new Error('No se encontraron jurisdicciones');
            // }
            return jurisdicciones;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async getAllJurisdiccionesByPage(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const jurisdicciones = await jurisdiccionModel
                .find({}, '-__v')
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ _id: -1 })
                .populate({
                    path: 'barrios',
                    select: 'nombreBarrio -_id'
                })
                .lean();

            const totalJurisdicciones = await jurisdiccionModel.countDocuments();
            return {
                data: jurisdicciones,
                currentPage: page,
                totalPages: Math.ceil(totalJurisdicciones / PAGE_SIZE),
                totalRecords: totalJurisdicciones
            };
        } catch (error) {
            mongooseErrorHandler(error)
        }
    },

    async obtenerJurisdiccion(id) {
        try {
            const jurisdiccion = await jurisdiccionModel
                .findById(id)
                .populate({
                    path: 'barrios',
                    select: 'nombreBarrio'
                })

            if (!jurisdiccion) {
                throw new AppError('No se encontraron jurisdicciones', 400);
            }
            return jurisdiccion;

        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async crearJurisdiccion(juris) {
        try {
            const { nombreJurisdiccion, barrios } = juris;
            const barriosExistentes = await barrioModel.find({ _id: { $in: barrios } });

            if (barriosExistentes.length !== barrios.length) {
                throw new AppError('Uno o mas barrios no existen', 400);
            }

            const jurisdiccionExistente = await jurisdiccionModel.findOne({ barrios: { $in: barrios } });

            if (jurisdiccionExistente) {
                throw new AppError('Uno o mas barrios ya existen en otra jurisdiccion', 400);
            }

            const nuevaJurisdiccion = new jurisdiccionModel({ nombreJurisdiccion, barrios });
            await nuevaJurisdiccion.save();

            return nuevaJurisdiccion;

        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async editarJurisdiccion(idJuris, dataJuris) {
        try {
            const { nombreJurisdiccion, barrios } = dataJuris;

            const barriosExistentes = await barrioModel.find({ _id: { $in: barrios } });
            if (barriosExistentes.length !== barrios.length) {
                throw new AppError('Uno o más barrios no existen', 400);
            }

            const jurisdiccionExistente = await jurisdiccionModel.findOne({
                _id: { $ne: idJuris },
                barrios: { $in: barrios }
            });

            if (jurisdiccionExistente) {
                throw new AppError('Uno o más barrios ya existen en otra jurisdicción', 400);
            }

            const jurisdiccionActualizada = await updateById(jurisdiccionModel, idJuris, { nombreJurisdiccion, barrios });

            return jurisdiccionActualizada;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async eliminarJurisdiccion(id) {
        return await deleteById(jurisdiccionModel, id);
    }
}