import { body } from "express-validator";

export const loginValidationRules = [
    body('identificador')
        .exists().withMessage('El correo electronico es requerido')
        .notEmpty().withMessage('El correo electronico es requerido')
        .isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('contrasena')
        .exists()
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres")
        .isString().withMessage('La contraseña no es válida')
];
