import multer from "multer";
import path from "path"
import {generarId} from "../helpers/tokens.js"

const storage = multer.diskStorage({
    destination: function(req,file,cd){
        cd(null,'./public/uploads/')
    },
    filename:function(req,file,cd){
        cd(null, generarId() + path.extname(file.originalname))   
    }
})



const upload = multer({ storage })


export default upload