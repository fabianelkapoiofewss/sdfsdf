import { Router } from "express";
import { usuarioController } from "../controllers/usuario.controller.js";
import { usuarioValidationRuler } from "../models/schema/usuario.schema.js";
import { validate } from "../../middlewares/validationError.js";

const usuarioRouter = Router();

usuarioRouter.get('/', usuarioController.obtenerUsuarios);
usuarioRouter.get('/:id', usuarioController.obtenerUsuario);
usuarioRouter.post('/', usuarioValidationRuler, validate, usuarioController.registrarUsuario);
usuarioRouter.put('/:id', usuarioValidationRuler, validate, usuarioController.editarUsuario);
usuarioRouter.delete('/:id', usuarioController.eliminarUsuario);

export { usuarioRouter };