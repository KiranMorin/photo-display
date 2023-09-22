import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        layout: {
            direction: "horizontal",
            cellRatio: "1/1", // or 2/3 or 16/9 
            cellNumber: 3,
            imageFit: "cover" // or contain or fill
        }
    });
})

export default router;