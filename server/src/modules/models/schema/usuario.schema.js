import { body } from "express-validator";

export const usuarioValidationRuler = [
    body('nombreUsuario')
        .exists().withMessage('El nombre de usuario es requerido')
        .isString().withMessage('El nombre de usuario no es válido')
        .notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasena')
        .exists()
        .notEmpty().withMessage("La contraseña es obligatoria")
        .isLength({ min: 8 }).withMessage("La contraseña debe contener al menos 8 caracteres")
        .isString().withMessage('La contraseña no es válida')
];
