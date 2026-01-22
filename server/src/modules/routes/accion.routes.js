import { Router } from "express";
import { accionController } from '../controllers/accion.controller.js';
import { accionValidationRuler } from "../models/schema/accion.schema.js";
import { validate } from "../../middlewares/validationError.js";

const accionRouter = Router();

accionRouter.post('/', accionValidationRuler, validate, accionController.registrarAccion);
accionRouter.get('/', accionController.obtenerAcciones);
accionRouter.get('/by-page', accionController.getAllAccionesByPage);
accionRouter.get('/:id', accionController.getAccionById);
accionRouter.put('/:id', accionValidationRuler, validate, accionController.editarAccion);
accionRouter.delete('/:id', accionController.eliminarAccion);

export { accionRouter };