import multer from "multer";

const storage = multer.memoryStorage();

export const singleUpload = multer({ storage }).single('file');

export const multipleUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB (optional)
    }
}).fields([
    { name: 'file', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
])