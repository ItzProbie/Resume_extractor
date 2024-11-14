const express = require('express');
const pdfparse = require("pdf-parse");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a PDF file.' });
        }

        const data = await pdfparse(req.file.buffer);

        const lines = data.text.split('\n');
        const filteredText = [];
        let prev = null;

        lines.forEach(line => {
            if (line !== prev) {
                filteredText.push(line);
                prev = line;
            }
        });

        res.json({
            info: data.info,
            content: filteredText.join('\n'),
        });
    } catch (error) {
        res.status(500).json({ message: 'Error parsing PDF', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
