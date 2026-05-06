# SkySummarizer 🌟

A clean, modern web application for text summarization with a beautiful UI. Built with vanilla HTML, CSS, and JavaScript for fast, responsive performance.

![SkySummarizer Preview](https://via.placeholder.com/800x400/2563eb/ffffff?text=SkySummarizer+Preview)

## ✨ Features

- **🔊 Text-to-Speech**: Convert summarized text to speech in English
- **🎨 Clean Design**: Modern, subtle styling with smooth animations
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **⚡ Fast Performance**: Lightweight vanilla JavaScript with no dependencies
- **🔄 Demo Functionality**: Basic text summarization (extracts first 2 sentences)
- **🧭 Easy Navigation**: Seamless navigation between home and summarization pages
- **🎯 User-Friendly**: Intuitive interface with clear call-to-actions

## 📁 Project Structure

```
frontend/
├── index.html          # Landing page with hero section
├── getstarted.html     # Text summarization interface
├── index.css           # Main page styles
├── styles.css          # Get started page styles
├── script.js           # Basic summarization logic
├── summarize.js        # API integration (for future backend)
└── README.md           # This file
```

## 🚀 Quick Start

### Local Development

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Navigate** to getstarted.html for the summarization tool

No server or build process required!

### Online Demo

Visit the live demo: [https://yourusername.github.io/skysummarizer/](https://yourusername.github.io/skysummarizer/)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with:
  - CSS Grid and Flexbox for layouts
  - Custom properties for theming
  - Smooth transitions and animations
  - Mobile-first responsive design
- **Vanilla JavaScript** - DOM manipulation and functionality
- **Google Fonts (Inter)** - Clean, modern typography

## 📦 Deployment

This project is ready for static hosting on any platform.

### GitHub Pages (Recommended)

1. **Create Repository**
   ```bash
   # Create a new repository on GitHub
   # Name it 'skysummarizer' or similar
   ```

2. **Upload Files**
   - Upload all files from the `frontend` folder
   - Ensure all files are in the root of your repository

3. **Enable Pages**
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/` folder
   - Click Save

4. **Access Your Site**
   ```
   https://yourusername.github.io/repository-name/
   ```

### Other Platforms

- **Netlify**: Drag & drop the `frontend` folder
- **Vercel**: Connect your GitHub repository
- **Firebase**: Use Firebase Hosting CLI

### Text-to-Speech

After generating a summary, users can click the "🔊 Speak" button to hear the summarized text read aloud in English.

- **English**: Uses `en-US` voices with natural pronunciation

**Features:**
- Click once to start speaking, click again to stop
- Visual feedback with button state changes
- Works offline (no internet required for speech)

**Browser Support:** Modern browsers with Web Speech API support (Chrome, Firefox, Safari, Edge)

### Troubleshooting Speech

1. **Check Voice Installation:** Ensure your system has an English speech voice available
   - Windows: Install the English language pack if needed
   - macOS: English voices are usually pre-installed
   - Linux: Install speech synthesis packages

2. **Browser Settings:**
   - Chrome: Ensure "Enhanced Speech" is enabled in settings
   - Firefox: Check about:config for media.webspeech.synth.enabled

3. **Debug Voices:** Open the browser console and run `debugVoices()` to see available voices

### Customization

#### Colors
The design uses a subtle blue color scheme. To customize:

```css
/* Primary colors in index.css */
:root {
  --primary-blue: #2563eb;
  --primary-blue-hover: #1d4ed8;
  --text-dark: #111827;
  --text-light: #475569;
}
```

#### Fonts
Currently uses Inter from Google Fonts. Replace in HTML head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Adding More Languages

To add additional languages, update the `translations` object in `script.js`:

```javascript
const translations = {
    en: { /* English translations */ },
    es: { /* Spanish translations */ },
    // Add more languages here
};
```

## 🔮 Future Enhancements

- [ ] **AI Integration**: Connect to OpenAI, Hugging Face, or custom ML models
- [ ] **File Upload**: Support for PDF, Word, and text file uploads
- [ ] **Advanced Summarization**: Multiple summary lengths and styles
- [ ] **User Authentication**: Account system with saved summaries
- [ ] **Export Options**: Download summaries as PDF, Word, or text
- [ ] **API Endpoints**: RESTful API for third-party integrations
- [ ] **Progressive Web App**: Offline functionality and app-like experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from modern SaaS applications
- Icons and illustrations from Unsplash
- Typography from Google Fonts

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code comments

---

**Built with ❤️ for the 2026 Summer Project**