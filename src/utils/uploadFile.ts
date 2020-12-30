
const baseDir = process.cwd() + '/uploads/';
export default (req) => {
    let file = req.files.file;
    file.mv(baseDir + file.name);
    return file.name;
}

