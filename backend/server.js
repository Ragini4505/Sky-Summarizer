require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const { TranslateClient, TranslateTextCommand } = require('@aws-sdk/client-translate');
const path = require('path');
const summarizeRouter = require('./routes/summarize');

const app = express();
const PORT = process.env.PORT || 5000;

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.warn('⚠️ AWS credentials are not configured. Speech synthesis will fail until AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set.');
}

// Middleware
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));
app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/summarize', summarizeRouter);

// AWS Polly client
const pollyClient = new PollyClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

const translateClient = new TranslateClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

async function translateToHindi(text) {
    const command = new TranslateTextCommand({
        Text: text,
        SourceLanguageCode: 'en',
        TargetLanguageCode: 'hi'
    });

    const response = await translateClient.send(command);
    return response.TranslatedText || text;
}

// Speech synthesis endpoint
app.post('/api/speech', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    try {
        const { text, language = 'en' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        console.log(`Synthesizing speech for language: ${language}`);
        console.log(`Text: ${text.substring(0, 100)}...`);

        const voiceMap = {
            en: { VoiceId: 'Joanna', LanguageCode: 'en-US' },
            hi: { VoiceId: 'Aditi', LanguageCode: 'hi-IN' }
        };

        const voiceConfig = voiceMap[language] || voiceMap.en;
        const speechText = language === 'hi' ? await translateToHindi(text) : text;

        console.log(`Speech text length: ${speechText.length}`);
        if (language === 'hi') {
            console.log(`Translated text preview: ${speechText.substring(0, 100)}...`);
        }

        const command = new SynthesizeSpeechCommand({
            OutputFormat: "mp3",
            Text: speechText,
            ...voiceConfig
        });

        console.log('Sending request to AWS Polly with config:', voiceConfig);

        const response = await pollyClient.send(command);

        // Set appropriate headers
        const headers = {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'no-cache'
        };

        if (response.AudioStream && response.AudioStream.length) {
            headers['Content-Length'] = response.AudioStream.length;
        }

        res.set(headers);

        // Stream the audio data
        response.AudioStream.pipe(res);

    } catch (error) {
        console.error('Error synthesizing speech:', error);
        res.status(500).json({
            error: 'Speech synthesis failed',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'SkySummarizer backend is running' });
});

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/getstarted.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/getstarted.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 SkySummarizer backend running on port ${PORT}`);
    console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
    console.log(`🔗 Access at: http://localhost:${PORT}`);
});

module.exports = app;