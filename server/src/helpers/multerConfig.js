import { getDirname } from '../utils/getDirname.js';
import multer from 'multer';
import path from "path";
import fs from 'node:fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(getDirname(), '../../public/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
        cb(null, uniqueName);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|jfif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Solo se permiten imágenes'));
    }
}).array('archivos', 10);