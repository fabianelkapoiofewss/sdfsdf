import { model, Schema } from "mongoose";
import cargarJurisdicciones from "../cargaCSV/addJurisdicciones.js";


const jurisdiccionSchema = new Schema({
    nombreJurisdiccion: {
        type: String,
        required: true,
    },
    barrios: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Barrio',
            required: true
        }
    ]
}, {
    collection: 'jurisdicciones',
    timestamps: false,
});

// jurisdiccionSchema.statics.initializeJurisdicciones = async function () {
//     try {
//         await cargarJurisdicciones();
//     } catch (error) {
//         console.error("Error al inicializar las jurisdicciones:", error);
//     }
// };

export const jurisdiccionModel = model('Jurisdiccion', jurisdiccionSchema);

// (async () => {
//     try {
//         await jurisdiccionModel.initializeJurisdicciones();
//     } catch (error) {
//         console.error("Error al ejecutar la inicialización de jurisdicciones:", error);
//     }
// })();