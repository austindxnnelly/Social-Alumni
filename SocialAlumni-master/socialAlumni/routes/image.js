const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

/* Routes image URLs */
router.get('/:filename?', (req, res) => {
    const filename = req.params.filename;
    var image_path = path.resolve(__dirname, `../public/profilePictures/${filename}`);

    if (!fs.existsSync(image_path)) { //if the image doesn't exist/one isn't uploaded, use the default image.
        console.error(`Error image file not found: ${filename}`);
        image_path = path.resolve(__dirname, '../public/profilePictures/default.jpg');
    }

    res.sendFile(image_path);
});

module.exports = router; // export the router
