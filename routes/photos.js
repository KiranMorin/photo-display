import express from "express";
import fs from "fs/promises";
import exifr from 'exifr';

const path = "./photos/";
const router = express.Router();

// GET photos fileNames
router.get('/', function(req, res, next) {
  fs.readdir(path).then((files) => {
    res.json(files.reduce((acc, file) => {
      // only read jpeg files
      if (file.endsWith(".jpeg") || file.endsWith(".jpg")) {
        acc.push( file);
      }
      return acc;
    }, []));
  });
});

// GET photos exifs
router.get('/all', function(req, res, next) {
  fs.readdir(path).then((files) => {
    Promise.all(files.reduce((acc, file) => {
      if (!acc) {
        acc = [];
      }
      // only read jpeg files
      if (file.endsWith(".jpeg") || file.endsWith(".jpg")) {
        acc.push(fs.readFile(path + file).then(async content => {
          const exifs = await exifr.parse(content);
          return { file, exifs };
        }));
        return acc;
      }
    }, [])).then(files => {
      res.json(files);
    });
  })
});

// GET photo exifs
router.get('/:fileName/exifs', function(req, res, next) {
  fs.readFile(path + req.params.fileName).then(content => {
    exifr.parse(content).then(exifs => {
      res.json(exifs);
    });
  });
});

// GET photo
router.get('/:fileName', function(req, res, next) {
  fs.readFile(path + req.params.fileName).then(content => {
    res.send(content);
  });
});

export default router;
