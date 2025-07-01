import multer from 'multer'
import path from 'path'

// console.log(process.cwd())
// console.log(import.meta.url)

// // let picPath = process.cwd() + '/' + 'temp-pic'
// // console.log('picPath', picPath) for mac
// picPath C:\cc20\cc20-fb-api/temp-pic

// //for windows
// let picPath2 = path.join(process.cwd(),'temp-pic')
// console.log('picPath2', picPath2)
// picPath2 C:\cc20\cc20-fb-api\temp-pic


const dest = path.join(process.cwd(), 'temp-pic')

const storage = multer.diskStorage({
  destination : (req,file,cb)=>cb(null, dest),
  filename : (req,file,cb)=>{
    let fileExt = path.extname(file.originalname)
    let fileName = `pic_${Date.now()}_${Math.round(Math.random()*100)}${fileExt}}`
    cb(null,fileName)
  }
})



export default multer({storage:storage})