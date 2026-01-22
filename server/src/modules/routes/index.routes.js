import { Router } from "express";
import { personaRouter } from "./persona.routes.js";
import { localidadRouter } from "./localidad.routes.js";
import { accionRouter } from "./accion.routes.js";
import { coordinadorRouter } from "./coordinador.routes.js";
import { dirigenteRouter } from "../routes/dirigente.routes.js";
import { adherenteRouter } from "../routes/adherente.routes.js";
import { jurisdiccionRouter } from "../routes/jurisdiccion.routes.js";
import { adminRouter } from "./admin.routes.js";
import { barrioRouter } from "./barrio.routes.js";
import { eventoRouter } from "./evento.routes.js";
import { institucionRouter } from "./institucion.routes.js";
import { jerarquiaRouter } from "./jerarquia.routes.js";
import { usuarioRouter } from "./usuario.routes.js";
import { authentication } from "../../middlewares/authentication.js";

const router = Router();

router.use('/api/auth', adminRouter);
router.use(authentication);
router.use('/usuario', usuarioRouter);
router.use('/persona', personaRouter);
router.use('/barrio', barrioRouter);
router.use('/jurisdiccion', jurisdiccionRouter);
router.use('/accion', accionRouter);
router.use('/evento', eventoRouter)
router.use('/coordinador', coordinadorRouter);
router.use('/dirigente', dirigenteRouter);
router.use('/adherente', adherenteRouter);
router.use('/localidad', localidadRouter);
router.use('/institucion', institucionRouter);
router.use('/jerarquia', jerarquiaRouter);

export { router };
