import { getDirname } from "./getDirname.js";
import multer from "multer";
import path from "path";
import fs from 'node:fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(getDirname(), '../data/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // guarda el archivo con el mismo nombre que el original
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /xlsx|xls|csv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
        return cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos Excel (.xlsx) o CSV (.csv)'));
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});