import { body } from 'express-validator';

export const validacionFiltros = [
    body().custom((filtros) => {
        if (typeof filtros !== 'object' || Array.isArray(filtros)) {
            throw new Error("El cuerpo de la solicitud debe ser un objeto con los filtros.");
        }
        return true;
    }),
    body('nombre').optional().isString().withMessage('El nombre debe ser un texto.'),
    body('apellido').optional().isString().withMessage('El apellido debe ser un texto.'),
    body('dni').optional().isString().withMessage('El DNI debe ser un texto.'),
    body('sexo').optional().isIn(['Masculino', 'Femenino']).withMessage('El sexo debe ser Masculino o Femenino.'),
    body('fechaNacimiento')
        .optional()
        .custom((fecha) => {
            if (typeof fecha !== 'object' || (!fecha.desde && !fecha.hasta)) {
                throw new Error("El filtro de fecha debe contener los campos 'desde' y/o 'hasta'.");
            }
            return true;
        }),
    body('estadoCivil')
        .optional()
        .isIn(['Soltero', 'Casado', 'Viudo', 'Divorciado'])
        .withMessage('El estado civil debe ser válido.'),
    body('paisNacimiento').optional().isString().withMessage('El país de nacimiento debe ser un texto.'),
    body('provinciaNacimiento').optional().isString().withMessage('La provincia de nacimiento debe ser un texto.'),
    body('ciudadNacimiento').optional().isString().withMessage('La ciudad de nacimiento debe ser un texto.'),
    body('direccion').optional().isString().withMessage('La dirección debe ser un texto.'),
    body('ocupacion').optional().isString().withMessage('La ocupación debe ser un texto.'),
    body('barrio').optional().isMongoId().withMessage('El ID del barrio debe ser un ObjectId válido.'),
    body('cargo')
        .optional()
        .isIn(['Coordinador de Jurisdicción', 'Dirigente', 'Adherente', 'Asistente', 'Sin cargo'])
        .withMessage('El cargo debe ser válido.'),
    body('ubicacion')
        .optional()
        .custom((ubicacion) => {
            if (!ubicacion.longitud || !ubicacion.latitud || !ubicacion.radio) {
                throw new Error("La ubicación debe incluir longitud, latitud y radio.");
            }
            return true;
        })
];