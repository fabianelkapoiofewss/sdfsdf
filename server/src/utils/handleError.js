export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}

export const mongooseErrorHandler = (error) => {
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(e => e.message).join(', ');
        throw new AppError(`Error de validación: ${messages}`, 400);
    }

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new AppError(`El ID proporcionado no es válido: ${error.value}`, 400);
    }

    if (error.code === 11000) {
        console.log(error);
        const valorDuplicado = Object.values(error.keyValue)[0];
        throw new AppError(`Ya existe un registro con el valor ${valorDuplicado}. Ingrese otro valor.`, 409);
    }
    throw new AppError(`${error.message}`, 500);
};