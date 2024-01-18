// const multer = require('multer')
import multer from "multer";

const storage = multer.diskStorage({
  destination (_req: any, _file: any, cb: any) {
    cb(null, 'public/uploads')
  },
  filename (_req: any, file: any, cb: any) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const allowedTypes: string[] = ['text/plain', 'text/html', 'application/pdf']

const fileFilter = (_req: any, file: any, cb: any) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export = multer({ storage, fileFilter })
