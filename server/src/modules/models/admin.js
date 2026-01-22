import { Schema, model } from "mongoose";
import { hash } from "../../utils/hash.js";
import { envConfig } from "../../config/envConfig.js";

const adminSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    },
    apellido: {
        type: String,
        required: true,
    },
    correoElectronico: {
        type: String,
        required: true,
        unique: true,
    },
    contrasena: {
        type: String,
        required: true,
    }
}, {
    collection: 'admins',
    timestamps: false,
});

// adminSchema.statics.initializeAdmins = async function () {
//     const count = await this.countDocuments();
//     if (count === 0) {
//         const admins = [
//             {
//                 nombre: 'Victor',
//                 apellido: 'Colusso',
//                 correoElectronico: 'admin1@gmail.com',
//                 contrasena: await hash.hashPassword(envConfig.PASSWORD_ADMIN1),
//             },
//         ];
//         await this.insertMany(admins);
//         console.log('Admins por defecto creados');
//     }
// };

const AdminModel = model('Admin', adminSchema);
export { AdminModel };


// (async () => {
//     try {
//         await AdminModel.initializeAdmins();
//     } catch (error) {
//         console.error("Error al inicializar los admins:", error);
//     }
// })();