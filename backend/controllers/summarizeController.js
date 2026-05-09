const { generateSummary } = require('../services/aiServices');

exports.summarizeText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || typeof text !== 'string' || !text.trim()) {
            return res.status(400).json({ error: 'Text is required.' });
        }

        const summary = await generateSummary(text);
        return res.json({ summary });
    } catch (error) {
        console.error('Error in summarizeText:', error);
        return res.status(500).json({ error: 'Failed to generate summary.', details: error.message });
    }
};
