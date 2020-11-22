
// https://borapraticar-backend.herokuapp.com
// http://localhost:3333

require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const routes = require('./routes');

const app = express();

// Mongo URI
const mongoURI = process.env.MONGO_URL;

const conn2 = mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Create mongo connection
const conn = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(cors());
app.use(express.json());

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));

// Init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage, limits: {fileSize: 100000000} });


// @route POST /upload
// @desc  Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
  return res.json({ filenameHex: req.file.filename });
});

// @route GET /files
// @desc  Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: 'No files exist'
      });
    }

    // Files exist
    return res.json(files);
  });
});

// @route GET /files/:filename
// @desc  Display single file object
app.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

app.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      let data = [];
      // Read output to browser
      const rr = gfs.createReadStream(file.filename);

      rr.on('data', function(chunk) {
        data.push(chunk);
      });

      rr.on('end', function() {
        data = Buffer.concat(data);
        let img = 'data:image/png;base64,' + Buffer(data).toString('base64');
        res.json({ base64: img });
      });

    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete('/files/:id', (req, res) => {
  gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ err: err });
    }

    res.json({ ok: true });
  });
});

app.use(routes);

app.listen(process.env.PORT || 3333);
