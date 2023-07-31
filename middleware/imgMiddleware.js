import fs from "fs"

export const imgMiddleware = async(req, res, next) => {
    try {
        if(!req.files){
            return res.status(400).json({message: "No files were choosen."})
        }
        let files = Object.values(req.files).flat();
        for(const file of files){
            if(file.mimetype!=="image/jpeg" && file.mimetype!=="image/png" && file.mimetype!=="image/webp" ){
                removeTmp(file.tempFilePath);
                return res.status(400).json({message: "File format is unsupported!, only jpeg, png, webp allowed."})
            }
            if(file.size>1024*1024*10){
                removeTmp(file.tempFilePath);
                return res.status(400).json({message: "File size is too large max 10mb allowed"})
            }
        }
        next();
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const removeTmp = (path) => {
    fs.unlink(path, (error)=>{
        if(err) throw err;
    })
}