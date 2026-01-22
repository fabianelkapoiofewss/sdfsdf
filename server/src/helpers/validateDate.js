import { AppError } from "../utils/handleError.js";

export const validateFecha = (model, updateModel) => {
    if (updateModel.fechaDesde !== undefined) {
        const hoy = new Date();
        if (new Date(updateModel.fechaDesde) > hoy) {
            throw new AppError("fechaDesde no puede ser una fecha futura.", 400);
        }
        model.fechaDesde = updateModel.fechaDesde;
    }

    if ("fechaHasta" in updateModel) {
        if (updateModel.fechaHasta !== null) {
            const hoy = new Date();
            if (new Date(updateModel.fechaHasta) > hoy) {
                throw new AppError("fechaHasta no puede ser una fecha futura.", 400);
            }
            model.fechaHasta = updateModel.fechaHasta;
        } else {
            model.fechaHasta = null;
        }
    }

    return model;
}