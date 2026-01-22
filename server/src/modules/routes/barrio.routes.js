import { Router } from "express";
import { barrioController } from "../controllers/barrio.controller.js";
import { barrioValidationRules } from "../models/schema/barrio.schema.js";
import { validate } from "../../middlewares/validationError.js";

const barrioRouter = Router();

barrioRouter.get('/', barrioController.getAllBarrios);
barrioRouter.get('/by-page', barrioController.getBarriosByPage);
barrioRouter.get('/:id', barrioController.getOneBarrio);
barrioRouter.post('/', barrioValidationRules, validate, barrioController.registrarBarrio);
barrioRouter.delete('/:id', barrioController.eliminarBarrio);
barrioRouter.put('/:id', barrioValidationRules, validate, barrioController.editarBarrio);

export { barrioRouter }