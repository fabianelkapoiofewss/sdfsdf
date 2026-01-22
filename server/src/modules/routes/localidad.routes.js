import { Router } from "express";
import { localidadController } from '../controllers/localidad.controller.js';

const localidadRouter = Router();

localidadRouter.get('/', localidadController.getAllLocalidades);
localidadRouter.get('/by-page', localidadController.getLocalidadesByPage);
localidadRouter.get('/:id', localidadController.obtenerLocalidad);
localidadRouter.post('/', localidadController.crearLocalidad);
localidadRouter.put('/:id', localidadController.editarLocalidad);
localidadRouter.delete('/:id', localidadController.eliminarLocalidad);

export { localidadRouter };