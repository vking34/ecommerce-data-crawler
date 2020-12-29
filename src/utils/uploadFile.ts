import multer from 'multer';
import util from 'util'
const maxSize: number = 2 * 1024 * 1024;
const baseDir = process.env.PWD;

let storage = multer.diskStorage({
    destination: (file, cb) => {
        console.log(file.originalName);
        cb(null, baseDir + "/assets/uploads/");
    },
    filename: (file, cb) => {
        console.log(file.originalName);
        cb(null, file.originalName);
    }
});

let upload = multer({
    storage: storage,
    limits: { fileSize: maxSize }
}).single("file");

let uploadFileMiddleware = util.promisify(upload);


export default async (req) => {
    try {
        await uploadFileMiddleware(req)
        if (req.file == undefined) {
           console.log(req.file)
        }
        return { message: "Uploaded the file successfully: " + req.file.originalname, }
    }
    catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return {
                message: "File size cannot be larger than 2MB!",
            };
        }
        return {
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        };

    }
} 