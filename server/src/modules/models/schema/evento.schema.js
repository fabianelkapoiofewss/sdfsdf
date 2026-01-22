import { body } from 'express-validator';

export const eventoValidationRules = [
    body('organizadorDelEvento')
        .optional()
        .isArray().withMessage('organizadorDelEvento debe ser un array.')
        .custom((organizadores) => {
            for (const id of organizadores) {
                if (!id.match(/^[a-fA-F0-9]{24}$/)) {
                    throw new Error(`El id ${id} en organizadorDelEvento no es válido.`);
                }
            }
            return true;
        }),
    body('fecha')
        .optional()
        .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD).'),
    body('accion')
        .optional()
        .isMongoId().withMessage('La acción debe ser un ObjectId válido.'),
    body('localidad')
        .optional({ nullable: true })
        .custom(value => {
            if (value === null) return true;
            if (typeof value === 'string' && /^[a-fA-F\d]{24}$/.test(value)) return true;
            throw new Error('La localidad debe ser un ObjectId válido o null.');
        }),
    body('barrio')
        .optional({ nullable: true })
        .customSanitizer(value => {
            return value === 'null' || value === '' ? null : value;
        })
        .custom((value) => {
            if (value === null) return true;
            if (/^[a-fA-F\d]{24}$/.test(value)) return true;
            throw new Error('El barrio debe ser un ObjectId válido o null.');
        }),
    body('direccion')
        .optional()
        .isString().withMessage('La dirección debe ser un texto válido.'),
    body('detalle')
        .optional()
        .isString().withMessage('El detalle debe ser un texto válido.'),
    body('beneficiariosOAsistentes')
        .optional()
        .isArray().withMessage('Los beneficiarios o asistentes deben ser un array.')
        .custom((beneficiarios) => {
            for (const beneficiario of beneficiarios) {
                if (!beneficiario.tipo || !['Persona', 'Institucion'].includes(beneficiario.tipo)) {
                    throw new Error('El tipo debe ser "Persona" o "Institucion".');
                }
                if (!beneficiario.referencia || !beneficiario.referencia.match(/^[a-fA-F0-9]{24}$/)) {
                    throw new Error('Cada referencia debe ser un ObjectId válido.');
                }
            }
            return true;
        }),
    body('ubicacion.type')
        .optional()
        .equals('Point').withMessage('El tipo de ubicación debe ser "Point".'),
    body('ubicacion.coordenadas')
        .optional()
        .isArray({ min: 2, max: 2 }).withMessage('Las coordenadas deben ser un array de 2 elementos [longitud, latitud].')
        .custom((coordenadas) => {
            if (coordenadas.some(coord => typeof coord !== 'number')) {
                throw new Error('Las coordenadas deben ser números.');
            }
            return true;
        }),
    body('archivos')
        .optional()
        .isArray().withMessage('Los archivos deben ser un array.')
        .custom((archivos) => {
            if (!archivos.every((archivo) => typeof archivo === 'string')) {
                throw new Error('Cada archivo debe ser una URL válida.');
            }
            return true;
        }),
];