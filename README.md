# SkySummarizer

A simple web application for text summarization with AWS Polly speech synthesis capabilities.

## Features

- **Text Summarization**: Paste your text and get a concise summary
- **Bilingual Speech Synthesis**: High-quality speech synthesis in both English and Hindi
- **Language Selection**: Choose between English and Hindi for speech playback
- **Automatic Translation**: Summaries are automatically translated to Hindi before voice synthesis
- **Clean Interface**: Simple, modern design with easy-to-use controls
- **Responsive**: Works on desktop and mobile devices
- **Download Summaries**: Export summaries as text files

## Setup Instructions

### 1. AWS Polly & Translate Configuration

This app uses AWS Polly for speech synthesis and AWS Translate for Hindi text generation. You'll need AWS credentials with appropriate permissions:

#### Create AWS Account & IAM User
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create an AWS account if you don't have one
3. Go to IAM → Users → Create user
4. Give it a name like "skysummarizer-user"
5. Attach these policies:
   - `AmazonPollyFullAccess` (for speech synthesis)
   - `TranslateFullAccess` (for Hindi translation)
6. Create access keys and note them down

#### Configure Environment Variables
1. Copy `backend/.env.example` to `backend/.env`
2. Replace the placeholder values:
   ```
   AWS_ACCESS_KEY_ID=your_actual_access_key
   AWS_SECRET_ACCESS_KEY=your_actual_secret_key
   AWS_REGION=us-east-1
   ```

### 2. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend is static, no installation needed
```

### 3. Start the Application

```bash
# From the backend directory
cd backend
npm start
```

The app will be available at `http://localhost:3000`

## How to Use

1. **Summarize Text**:
   - Paste your text in the textarea (up to 50,000 characters)
   - Click "Summarize" to generate a summary

2. **Select Speech Language**:
   - Choose between "English" or "Hindi" from the dropdown
   - For Hindi, the summary will be automatically translated

3. **Listen to Summary**:
   - Click "🔊 Speak" to hear the summary in your selected language
   - AWS Polly synthesizes high-quality speech
   - Click "⏹️ Stop" to stop playback
   - Browser fallback available if AWS service is unavailable

4. **Download Summary**:
   - Click "⬇️ Download" to save the summary as a `.txt` file

## Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express, AWS SDK v3
- **Speech API**: AWS Polly with neural voices (English & Hindi)
- **Translation API**: AWS Translate for English-to-Hindi conversion
- **Storage**: LocalStorage for language preference persistence

## AWS Services Used

### Voices
- **English**: Joanna (Neural voice, `en-US`)
- **Hindi**: Aditi (Neural voice, `hi-IN`)

### Translation
- English summaries are automatically translated to Hindi using AWS Translate before voice synthesis

## Troubleshooting

### Speech Synthesis Not Working
- Ensure your AWS credentials are correctly set in `backend/.env`
- Verify the IAM user has both `AmazonPollyFullAccess` and `TranslateFullAccess` permissions
- Check the backend console for AWS error messages
- If AWS is unavailable, the app will attempt browser-based speech synthesis as fallback

### Hindi Speech Not Working
- Make sure AWS Translate permission is enabled in your IAM user policy
- Check that the AWS region is set to `us-east-1` or another region supporting both Polly and Translate
- Verify the AWS credentials in `backend/.env`

### AWS Credentials Issues
- Never commit real credentials to version control; use `backend/.env` (excluded by `.gitignore`)
- Use `backend/.env.example` as a template for new setups
- Regenerate AWS access keys if they were ever exposed
- Ensure the IAM user has the correct permissions

## Development

To run in development mode:
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

## Security Notes

- Never commit AWS credentials to version control
- Use IAM roles in production environments
- Consider using AWS Cognito for temporary credentials
- The backend serves the frontend statically for demo purposes
=======
# Sky-Summarizer
>>>>>>> bbe3812884d45f533e63783eca2e8f7a80ec24ae
