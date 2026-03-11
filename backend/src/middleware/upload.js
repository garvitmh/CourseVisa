const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'resume') {
      cb(null, 'public/uploads/resumes');
    } else if (file.fieldname === 'image') {
      cb(null, 'public/uploads/images');
    } else {
      cb(null, 'public/uploads/misc');
    }
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check File Type
function checkFileType(file, cb) {
  let filetypes;
  if (file.fieldname === 'resume') {
    filetypes = /pdf|doc|docx/;
  } else {
    filetypes = /jpeg|jpg|png|webp/;
  }
  
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Invalid file type!');
  }
}

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB max
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
