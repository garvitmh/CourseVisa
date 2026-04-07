const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsRoot = path.join(__dirname, '..', '..', 'public', 'uploads');
const uploadPaths = {
  resume: path.join(uploadsRoot, 'resumes'),
  image: path.join(uploadsRoot, 'images'),
  misc: path.join(uploadsRoot, 'misc'),
};

const ensureDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Set storage engine
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'resume') {
      ensureDirectory(uploadPaths.resume);
      cb(null, uploadPaths.resume);
    } else if (file.fieldname === 'image') {
      ensureDirectory(uploadPaths.image);
      cb(null, uploadPaths.image);
    } else {
      ensureDirectory(uploadPaths.misc);
      cb(null, uploadPaths.misc);
    }
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check File Type
function checkFileType(file, cb) {
  if (file.fieldname === 'resume') {
    const allowedExt = /\.(pdf|doc|docx)$/i;
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const extOk = allowedExt.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedMimeTypes.includes(file.mimetype);
    if (extOk && mimeOk) {
      return cb(null, true);
    }
    return cb('Error: Invalid resume file type!');
  } else {
    const imageFiletypes = /jpeg|jpg|png|webp/;
    const extname = imageFiletypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = imageFiletypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb('Error: Invalid image file type!');
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
