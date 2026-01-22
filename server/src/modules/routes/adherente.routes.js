import { Router } from "express";
import { adherenteController } from '../controllers/adherente.controller.js';

const adherenteRouter = Router();

adherenteRouter.get('/', adherenteController.getAllAdherentes);
adherenteRouter.get('/by-page', adherenteController.getAllAdherentesByPage);
adherenteRouter.get('/:id', adherenteController.getAdherenteById);
adherenteRouter.post('/', adherenteController.registrarAdherente);
adherenteRouter.put('/:id', adherenteController.editarAdherente);
adherenteRouter.delete('/:id', adherenteController.eliminarAdherente);

export { adherenteRouter };