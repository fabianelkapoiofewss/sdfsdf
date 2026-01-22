export const responseHandler = (res, status, data) => {
    res.status(status).json({ success: true, data });
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Ocurrió un error en el servidor.',
    });
};