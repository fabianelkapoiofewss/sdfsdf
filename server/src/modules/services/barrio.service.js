import { capitalizarNombre } from "../../utils/capitalizarString.js";
import { create, getAll, deleteById, updateById, getForId, getAllByPage } from "../../utils/getRegisters.js";
import { AppError, mongooseErrorHandler } from "../../utils/handleError.js";
import { barrioModel } from "../models/barrio.js";
import { jurisdiccionModel } from "../models/jurisdiccion.js";

export const barrioService = {

    async obtenerBarrios() {
        try {
            const barrios = await barrioModel
                .find({}, '-__v')
                .sort({ nombreBarrio: 1 })
                .lean();
            return barrios
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async obtenerBarriosPorPagina(page = 1) {
        try {
            const PAGE_SIZE = 10;
            const skip = (page - 1) * PAGE_SIZE;
            const registros = await barrioModel
                .find({}, '-__v')
                .skip(skip)
                .limit(PAGE_SIZE)
                .sort({ nombreBarrio: 1 })
                .lean();
            const totalRegistros = await barrioModel.countDocuments();
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

    async obtenerBarrio(id) {
        return await getForId(barrioModel, id);
    },

    async registrarBarrio(barrio) {
        try {
            const nombreFormateado = capitalizarNombre(barrio.nombreBarrio);
            const barrioExistente = await barrioModel.findOne({ nombreBarrio: nombreFormateado });
            if (barrioExistente) {
                throw new AppError(`El barrio ${nombreFormateado} ya existe, ingrese otro nombre.`, 400);
            }
            return await create(barrioModel, { ...barrio, nombreBarrio: nombreFormateado });
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async eliminarBarrio(id) {
        try {
            await jurisdiccionModel.updateMany(
                { barrios: id },
                { $pull: { barrios: id } }
            );
            return await deleteById(barrioModel, id);
        } catch (error) {
            mongooseErrorHandler(error);
        }
    },

    async editarBarrio(id, barrio) {
        try {
            const nombreFormateado = capitalizarNombre(barrio.nombreBarrio);
            const barrioExistente = await barrioModel.findOne({ nombreBarrio: nombreFormateado });
            if (barrioExistente) {
                throw new AppError(`El barrio ${nombreFormateado} ya existe, ingrese otro nombre.`, 400);
            }
            return await updateById(barrioModel, id, { ...barrio, nombreBarrio: nombreFormateado });
        } catch (error) {
            mongooseErrorHandler(error)
        }
    }
}