import { AppError, mongooseErrorHandler } from "./handleError.js";

export const create = async (model, data) => {
    try {
        return await model.create(data);
    } catch (error) {
        mongooseErrorHandler(error);
    }
};

export const getForId = async (model, id) => {
    try {
        const data = await model.findById(id);
        if (!data) throw new AppError('No se encontró un registro con el ID proporcionado.', 404);
        return data;
    } catch (error) {
        mongooseErrorHandler(error);
    }
};

export const getAll = async (model) => {
    try {
        const registros = await model.find();
        return registros;
    } catch (error) {
        mongooseErrorHandler(error);
    }
};

export const updateById = async (model, id, data) => {
    try {
        const registro = await model.findByIdAndUpdate(id, data, { new: true });
        if (!registro) throw new AppError('No se encontró registro para actualizar', 404);
        return registro
    } catch (error) {
        mongooseErrorHandler(error)
    }
}

export const deleteById = async (model, id) => {
    try {
        const registro = await model.findByIdAndDelete(id);
        if (!registro) throw new AppError('No se encontró registro para eliminar', 404);
        return registro;
    } catch (error) {
        mongooseErrorHandler(error)
    }
}

export const getAllByPage = async (page, model) => {
    try {
        const PAGE_SIZE = 10;
        const skip = (page - 1) * PAGE_SIZE;
        const registros = await model
            .find({}, '-__v')
            .skip(skip)
            .limit(PAGE_SIZE)
            .sort({ _id: -1 })
            .lean();
        const totalRegistros = await model.countDocuments();
        return {
            data: registros,
            currentPage: page,
            totalPages: Math.ceil(totalRegistros / PAGE_SIZE),
            totalRecords: totalRegistros
        };
    } catch (error) {
        mongooseErrorHandler(error);
    }
};