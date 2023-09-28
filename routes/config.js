import express from "express";
import { configService } from "../services/configService.js";

const router = express.Router();

// Get the config as JSON
router.get("/", (req, res) => {
    configService.getConfig().then(config => {
        res.json(config);
    })
});

// Show the config page
router.get("/edit", (req, res) => {
    res.render("config");
});

export default router;