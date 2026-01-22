export const liberarColor = async function (doc, next) {
    try {
        if (!doc.colorMarcador) {
            throw new Error('No hay color asignado para liberar');
            return next();
        }
        console.log(`Color liberado: ${doc.colorMarcador}`);
    } catch (error) {
        console.error('Error al liberar color:', error);
    }
};