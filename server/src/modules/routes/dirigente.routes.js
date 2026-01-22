import { Router } from "express";
import { dirigenteController } from '../controllers/dirigente.controller.js';

const dirigenteRouter = Router();

dirigenteRouter.post('/', dirigenteController.crearDirigente);
dirigenteRouter.get('/', dirigenteController.getAllDirigentes);
dirigenteRouter.get('/by-page', dirigenteController.getAllDirigentesByPage);
dirigenteRouter.get('/:id', dirigenteController.getDirigenteById);
dirigenteRouter.put('/:id', dirigenteController.actualizarDirigente);
dirigenteRouter.delete('/:id', dirigenteController.eliminarDirigente);

export { dirigenteRouter };