import { model, Schema } from "mongoose";
import { cargarBarrios } from "../cargaCSV/addBarrio.js";

const barrioSchema = new Schema(
    {
        nombreBarrio: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        collection: "barrios",
        timestamps: false,
    }
);

// barrioSchema.statics.initializeBarrios = async function () {
//     try {
//         const count = await this.countDocuments();
//         if (count === 0) {
//             console.log("La colección está vacía, cargando barrios...");
//             await cargarBarrios();
//         } else {
//             console.log("Barrios ya existentes en la colección.");
//         }
//     } catch (error) {
//         console.error("Error al inicializar los barrios:", error);
//     }
// };

const barrioModel = model("Barrio", barrioSchema);
export { barrioModel };

// (async () => {
//     try {
//         await barrioModel.initializeBarrios();
//     } catch (error) {
//         console.error("Error al ejecutar la inicialización de barrios:", error);
//     }
// })();