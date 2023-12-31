import express from "express";
import { filesService } from "../services/filesService.js";

const path = "./photos/";
const router = express.Router();

// GET photos fileNames
router.get('/', function(req, res, next) {
  filesService.getFiles(path).then(files => {
    res.json(files.map(file => {
      const url = path + file;
      return {file, url};
    }));
  }).catch(err => {
    res.status(500).end();
  })
});

// GET photos exifs
router.get('/all', function(req, res, next) {
  try {
    filesService.getFiles(path).then(files => {
      const promises = files.map(file => {
        return filesService.getExifs(path + file).then(exifs => {
          const url = path + file;
          return {file, url, exifs };
        })
      });
      Promise.all(promises).then(exifs => {
        res.json(exifs);
      })
    })
  } catch (error) {
    res.status(500).end();
  }
});

// GET photo exifs
router.get('/:fileName/exifs', function(req, res, next) {
  filesService.getExifs(path + req.params.fileName).then(exifs => {
    res.json(exifs);
  }).catch(err => {
    res.status(404).end();
  })
});

// GET photo
router.get('/:fileName', function(req, res, next) {
  if (!req.params.fileName) {
    return res.status(400).end();
  }
  filesService.getFile(path + req.params.fileName, req.query.size).then(file => {
    res.send(file);
  }).catch(err => {
    res.status(404).end();
  });
});

export default router;
