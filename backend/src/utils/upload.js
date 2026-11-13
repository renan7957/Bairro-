import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import multer from 'multer';

export const uploadsDir = fileURLToPath(new URL('../../uploads/', import.meta.url));

mkdirSync(uploadsDir, { recursive: true });

const extensoesPermitidas = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp'
};

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadsDir),
    filename: (_req, file, callback) => {
        callback(null, `${randomUUID()}${extensoesPermitidas[file.mimetype]}`);
    }
});

export const uploadFoto = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!extensoesPermitidas[file.mimetype]) {
            callback(new Error('Envie uma imagem JPG, PNG, GIF ou WebP.'));
            return;
        }

        callback(null, true);
    }
});

export function caminhoFoto(foto) {
    if (!foto || !foto.startsWith('/uploads/')) return null;

    const nomeArquivo = path.basename(foto);
    return path.join(uploadsDir, nomeArquivo);
}
