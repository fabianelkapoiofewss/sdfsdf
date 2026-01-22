import { create, updateById, deleteById } from "../../utils/getRegisters.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { obtenerJurisdiccionPorBarrio } from "../../helpers/obtenerJurisdiccion.js";
import { institucionModel } from "../models/institucion.js";

export const institucionService = {

    async registrarInstitucion(institucion) {
        return await create(institucionModel, institucion);
    },

    async obtenerInstituciones() {
        try {
            const instituciones = await institucionModel
                .find()
                .sort({ _id: -1 })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio',
                    model: 'Barrio'
                })

            const institucionesConJurisdiccion = await obtenerJurisdiccionPorBarrio(instituciones);

            return institucionesConJurisdiccion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async getAllInstitucionesByPage(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;

            const instituciones = await institucionModel
                .find({}, '-__v')
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ _id: -1 })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio',
                    model: 'Barrio'
                })
                .lean();

            const institucionesConJurisdiccion = await obtenerJurisdiccionPorBarrio(instituciones);

            const totalInstituciones = await institucionModel.countDocuments();

            return {
                data: institucionesConJurisdiccion,
                currentPage: page,
                totalPages: Math.ceil(totalInstituciones / PAGE_SIZE),
                totalRecords: totalInstituciones
            };
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async buscarInstituciones(nombre) {
        try {
            const instituciones = await institucionModel.find({
                nombreInstitucion: { $regex: nombre, $options: 'i' }, // Buscamos ignorando mayúsculas/minúsculas
            }).populate({
                path: 'localidad',
                select: 'nombreLocalidad -_id'
            });
            return instituciones;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async editarInstitucion(id, institucion) {
        try {
            const {
                nombreInstitucion,
                encargadoODirector,
                localidad,
                barrio,
                direccion,
                ubicacion
            } = institucion;

            const institucionEditada = await updateById(institucionModel, id, {
                nombreInstitucion,
                encargadoODirector,
                localidad,
                barrio,
                direccion,
                ubicacion
            })

            return institucionEditada;

        } catch (error) {
            mongooseErrorHandler(error);
        }
        // return await updateById(institucionModel, id, institucion);
    },

    async eliminarInstitucion(id) {
        return await deleteById(institucionModel, id);
    },

    async obtenerInstitucionPorNombre(nombreInstitucion) {
        try {
            const institucion = await institucionModel
                .findOne({ nombreInstitucion })
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad -_id'
                });
            if (!institucion) {
                throw new AppError('No se encontró la institución', 404);
            }
            return institucion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerInstitucionPorId(id) {
        try {
            const institucion = await institucionModel
                .findById(id)
                .populate({
                    path: 'localidad',
                    select: 'nombreLocalidad'
                })
                .populate({
                    path: 'barrio',
                    select: 'nombreBarrio',
                    model: 'Barrio'
                })
            return institucion;
        } catch (error) {
            mongooseErrorHandler(error);
        }
    }
}