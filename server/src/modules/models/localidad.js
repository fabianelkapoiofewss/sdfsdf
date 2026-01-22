import { model, Schema } from "mongoose";
import { cargarLocalidades } from "../cargaCSV/addLocalidad.js";

const localidadSchema = new Schema({
    nombreLocalidad: {
        type: String,
        required: true,
    },
    departamento: {
        type: String,
        required: true,
        enum: [
            'Bermejo',
            'Formosa',
            'Laishí',
            'Matacos',
            'Patiño',
            'Pilagás',
            'Pilcomayo',
            'Pirané',
            'Ramón Lista',
        ],
    },
}, {
    collection: 'localidades',
    timestamps: false,
});

// localidadSchema.statics.initializeLocalidades = async function () {
//     try {
//         const count = await this.countDocuments();
//         if (count === 0) {
//             console.log("La colección está vacía, cargando localidades...");
//             await cargarLocalidades();
//         } else {
//             console.log("Localidades ya existentes en la colección.");
//         }
//     } catch (error) {
//         console.error("Error al inicializar las localidades:", error);
//     }
// };

const localidadModel = model('Localidad', localidadSchema);
export { localidadModel };


// (async () => {
//     try {
//         await localidadModel.initializeLocalidades();
//     } catch (error) {
//         console.error("Error al ejecutar la inicialización de localidades:", error);
//     }
// })();