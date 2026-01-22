import { body } from "express-validator";
import mongoose from "mongoose";

export const personaValidationRules = [
    body('nombre')
        .exists({ checkFalsy: true }).withMessage('El nombre es obligatorio')
        .isString().withMessage('El nombre debe ser un texto'),
    body('apellido')
        .exists({ checkFalsy: true }).withMessage('El apellido es obligatorio')
        .isString().withMessage('El apellido debe ser un texto'),
    body('dni')
        .exists({ checkFalsy: true }).withMessage('El DNI es obligatorio')
        .isString()
        .isLength({ min: 8, max: 8 }).withMessage('El DNI debe tener exactamente 8 dígitos'),
    body('sexo')
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null) return true;
            if (value === 'Masculino' || value === 'Femenino') return true;
            throw new Error('El sexo debe ser "Masculino" o "Femenino"');
        }),
    body('fechaNacimiento')
        .optional({ nullable: true })
        .isISO8601().withMessage('La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)')
        .custom((value) => {
            const fecha = new Date(value);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fecha.setHours(0, 0, 0, 0);
            if (fecha > hoy) {
                throw new Error('La fecha de nacimiento no puede ser en el futuro');
            }
            return true;
        }),
    body('localidad')
        .optional({ nullable: true })
        .custom(value => {
            if (value === null) return true;
            if (typeof value === 'string' && /^[a-fA-F\d]{24}$/.test(value)) return true;
            throw new Error('La localidad debe ser un ObjectId válido o null.');
        }),
    body('barrio')
        .optional({ nullable: true })
        .custom((value) => {
            if (value === null) return true;
            if (typeof value === 'string' && /^[a-fA-F\d]{24}$/.test(value)) return true;
            throw new Error('El barrio debe ser un ObjectId válido o null.');
        }),

    body('estadoCivil')
        .optional({ nullable: true })
        .isIn(['Soltero', 'Casado', 'Viudo', 'Divorciado']).withMessage('El estado civil debe ser Soltero, Casado, Viudo o Divorciado'),
    body('numeroTelefono')
        .optional()
        .isString(),

    body('paisNacimiento')
        .optional({ nullable: true })
        .default('')
        .isString().withMessage('El país de nacimiento debe ser un texto'),
    body('provinciaNacimiento')
        .optional({ nullable: true })
        .default('')
        .isString().withMessage('La provincia de nacimiento debe ser un texto'),
    body('ciudadNacimiento')
        .optional({ nullable: true })
        .default('')
        .isString().withMessage('La ciudad de nacimiento debe ser un texto'),

    body('direccion')
        .optional({ nullable: true })
        .default('')
        .isString().withMessage('La dirección debe ser un texto'),
    body('ocupacion')
        .optional({ nullable: true })
        .default('')
        .isString().withMessage('La ocupación debe ser un texto'),

    body('votaPor')
        .optional({ nullable: true })
        .isIn(['PJ', 'UCR', 'LLA', 'PRO', 'Otros']).withMessage('La partido político debe ser PJ, UCR, LLA, PRO o Otros'),

    body('ubicacion')
        .optional()
        .custom((value) => {
            if (!value.type || value.type !== 'Point') {
                throw new Error('La ubicación debe tener un tipo válido (Point)');
            }
            if (!Array.isArray(value.coordenadas) || value.coordenadas.length !== 2) {
                throw new Error('La ubicación debe contener un array con dos coordenadas (latitud y longitud)');
            }
            if (!value.coordenadas.every(coord => typeof coord === 'number')) {
                throw new Error('Las coordenadas deben ser números válidos');
            }
            return true;
        }),
];