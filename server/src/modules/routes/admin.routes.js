import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { loginValidationRules } from "../models/schema/admin.schema.js";
import { validate } from "../../middlewares/validationError.js";
import { authentication } from "../../middlewares/authentication.js";

const adminRouter = Router();

adminRouter.post('/login', loginValidationRules, validate, adminController.login);
adminRouter.get('/me', authentication, adminController.me);
adminRouter.get('/logout', authentication, adminController.logout);


export { adminRouter }