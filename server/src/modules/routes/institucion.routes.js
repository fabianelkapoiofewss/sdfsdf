import { Router } from "express";
import { institucionController } from "../controllers/institucion.controller.js";
import { institucionValidationRules } from "../models/schema/institucion.schema.js";
import { validate } from "../../middlewares/validationError.js";

const institucionRouter = Router();

institucionRouter.get('/', institucionController.obtenerInstituciones);
institucionRouter.get('/by-page', institucionController.getAllInstitucionesByPage);
institucionRouter.get('/buscar', institucionController.buscarInstituciones);
institucionRouter.get('/:id', institucionController.obtenerInstitucionPorId);
institucionRouter.post('/', institucionValidationRules, validate, institucionController.registrarInstitucion);
institucionRouter.delete('/:id', institucionController.eliminarInstitucion);
institucionRouter.put('/:id', institucionController.editarInstitucion);


export { institucionRouter }