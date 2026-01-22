import { body } from "express-validator";

export const accionValidationRuler = [
    body('nombreAccion')
        .exists().withMessage('El nombre de la accion es obligatorio')
        .notEmpty().withMessage('El nombre de la accion no puede estar vacío')
        .isString().withMessage('El nombre de la accion debe ser un string'),
]