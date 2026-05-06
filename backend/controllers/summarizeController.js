const { generateSummary } = require("../services/aiServices");

// Character limit configuration
const MAX_CHARACTERS = 50000;
const MIN_CHARACTERS = 20;

exports.summarizeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }
        
        if (text.length < MIN_CHARACTERS) {
            return res.status(400).json({ error: `Text must be at least ${MIN_CHARACTERS} characters long` });
        }
        
        if (text.length > MAX_CHARACTERS) {
            return res.status(413).json({ error: `Text exceeds maximum limit of ${MAX_CHARACTERS.toLocaleString()} characters` });
        }

        const summary = await generateSummary(text);

        res.json({ summary });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};