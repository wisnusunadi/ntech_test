import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();


function checkFileType(file, cb) {
  const filetypes = /png|jpeg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

const upload = multer({storage, fileFilter: function(req, file, cb) {
  checkFileType(file, cb);
} })

export default upload