import { capitalizarNombre } from "../../utils/capitalizarString.js";
import { create, deleteById, getAll, getAllByPage, getForId, updateById } from "../../utils/getRegisters.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { localidadModel } from "../models/localidad.js";

export const localidadService = {
    async getAllLocalidades() {
        return await getAll(localidadModel);
    },

    async obtenerLocalidad(id) {
        return await getForId(localidadModel, id);
    },

    async getLocalidadesPorPagina(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;
            const registros = await localidadModel
            .find({}, '-__v')
            .skip(skip)
            .limit(PAGE_SIZE)
            .sort({ nombreLocalidad: 1 })
            .lean();
            const totalRegistros = await localidadModel.countDocuments();
            return {
                data: registros,
                currentPage: page,
                totalPages: Math.ceil(totalRegistros / PAGE_SIZE),
                totalRecords: totalRegistros
            };
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async crearLocalidad(local) {
        try {
            const nombreFormateado = capitalizarNombre(local.nombreLocalidad);
            const localidadExistente = await localidadModel.findOne({ nombreLocalidad: nombreFormateado });
            if (localidadExistente) {
                throw new AppError(`La localidad ${nombreFormateado} ya existe, ingrese otro nombre.`, 400);
            }
            return await create(localidadModel, { ...local, nombreLocalidad: nombreFormateado });
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async eliminarLocalidad(id) {
        try {
            return await deleteById(localidadModel, id);
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async actualizarLocalidad(id, local) {
        try {
            const nombreFormateado = capitalizarNombre(local.nombreLocalidad);
            const localidadExistente = await localidadModel.findOne({ nombreLocalidad: nombreFormateado });
            if (localidadExistente) {
                throw new AppError(`La localidad ${nombreFormateado} ya existe, ingrese otro nombre.`, 400);
            }
            return await updateById(localidadModel, id, { ...local, nombreLocalidad: nombreFormateado });
        } catch (error) {
            mongooseErrorHandler(error)
        }
    },
};