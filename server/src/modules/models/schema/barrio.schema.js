import { body } from "express-validator";

export const barrioValidationRules = [
    body('nombreBarrio')
        .exists().withMessage('El nombre del barrio es obligatorio')
        .notEmpty().withMessage('El nombre del barrio no puede estar vacío')
        .isString().withMessage('El nombre del barrio debe ser un string')
]