import { body } from 'express-validator';

export const institucionValidationRules = [
    body('nombreInstitucion')
        .exists().withMessage('El nombre de la institución es obligatorio.')
        .notEmpty().withMessage('El nombre de la institución es obligatorio.')
        .isString().withMessage('El nombre de la institución debe ser una cadena de texto.')
        .isLength({ max: 100 }).withMessage('El nombre de la institución no debe exceder los 100 caracteres.'),
    body('encargadoODirector')
        .optional()
        .isString().withMessage('El encargado o director debe ser una cadena de texto.'),
    body('localidad')
        .notEmpty().withMessage('La localidad es obligatoria.')
        .isMongoId().withMessage('El ID de la localidad debe ser un identificador válido de MongoDB.'),
    body('barrio')
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null) return true;
            if (typeof value === 'string' && /^[a-fA-F\d]{24}$/.test(value)) return true;
            throw new Error('El barrio debe ser un ObjectId válido o null.');
        }),
    body('direccion')
        .exists().withMessage('La dirección es obligatoria.')
        .notEmpty().withMessage('La dirección es obligatoria.')
        .isString().withMessage('La dirección debe ser una cadena de texto.')
        .isLength({ max: 200 }).withMessage('La dirección no debe exceder los 200 caracteres.'),
    body('ubicacion.type')
        .notEmpty().withMessage('El tipo de ubicación es obligatorio.')
        .isString().withMessage('El tipo de ubicación debe ser una cadena de texto.')
        .equals('Point').withMessage('El tipo de ubicación debe ser "Point".'),
    body('ubicacion.coordenadas')
        .notEmpty().withMessage('Las coordenadas son obligatorias.')
        .isArray({ min: 2, max: 2 }).withMessage('Las coordenadas deben ser un arreglo de longitud 2.')
        .custom(([longitud, latitud]) => {
            if (
                typeof longitud !== 'number' ||
                typeof latitud !== 'number' ||
                longitud < -180 || longitud > 180 ||
                latitud < -90 || latitud > 90
            ) {
                throw new Error('Las coordenadas deben contener valores válidos de longitud y latitud.');
            }
            return true;
        }),
];