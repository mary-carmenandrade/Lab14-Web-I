const express = require('express');
const multer = require('multer');
const app = express();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos JPEG, PNG o PDF'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2880
  },
  fileFilter: fileFilter
}).array('files');

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).send(err.message);
    } else {
      const filesInfo = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      }));
      res.send(filesInfo);
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
