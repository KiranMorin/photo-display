import express from "express";
import { filesService } from "../services/filesService.js";

const path = "./photos/";
const router = express.Router();

// GET photos fileNames
router.get('/', function(req, res, next) {
  filesService.getFiles(path).then(files => {
    res.json(files);
  });
});

// GET photos exifs
router.get('/all', function(req, res, next) {
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
});

// GET photo exifs
router.get('/:fileName/exifs', function(req, res, next) {
  filesService.getExifs(path + req.params.fileName).then(exifs => {
    res.json(exifs);
  })
});

// GET photo
router.get('/:fileName', function(req, res, next) {
  filesService.getFile(path + req.params.fileName).then(file => {
    res.json(file);
  });
});

export default router;
