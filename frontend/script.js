// Audio element for playing speech
let audioElement = null;
let isSpeaking = false;
let summaryGenerated = false;

// Use backend server if frontend is served from a different local port or file://
const API_BASE = (() => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const origin = window.location.origin;

    if (protocol === 'file:' || !host) {
        return 'http://localhost:5000';
    }

    return origin || 'http://localhost:5000';
})();

// Character limit configuration
const MAX_CHARACTERS = 50000;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize speak button state
    const speakButton = document.getElementById('speakButton');
    if (speakButton) {
        speakButton.disabled = true;
        speakButton.style.opacity = "0.5";
    }
    
    // Initialize character counter
    const inputText = document.getElementById('inputText');
    if (inputText) {
        inputText.addEventListener('input', updateCharacterCount);
        updateCharacterCount();
    }
});

// Update character count display
function updateCharacterCount() {
    const inputText = document.getElementById('inputText');
    const charCount = document.getElementById('charCount');
    const currentLength = inputText.value.length;
    charCount.textContent = currentLength.toLocaleString();
    
    // Change color if approaching limit
    if (currentLength > MAX_CHARACTERS * 0.8) {
        charCount.style.color = '#f97316';
    } else if (currentLength > MAX_CHARACTERS * 0.9) {
        charCount.style.color = '#ef4444';
    } else {
        charCount.style.color = '#6b7280';
    }
}

// Text summarization function
async function summarizeText() {
    const input = document.getElementById("inputText").value.trim();
    const output = document.getElementById("output");
    const speakButton = document.getElementById("speakButton");

    if (!input) {
        output.innerText = "Please enter some text.";
        return;
    }
    
    if (input.length > MAX_CHARACTERS) {
        output.innerText = `Text exceeds the maximum limit of ${MAX_CHARACTERS.toLocaleString()} characters. Please reduce the text length.`;
        return;
    }
    
    if (input.length < 20) {
        output.innerText = "Please enter at least 20 characters of text.";
        return;
    }

    output.innerText = "Summarizing...";
    if (speakButton) {
        speakButton.disabled = true;
        speakButton.style.opacity = "0.5";
    }

    const summaryEndpoint = `${API_BASE}/api/summarize`;

    try {
        const response = await fetch(summaryEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: input }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Summarization failed');
        }

        const data = await response.json();
        output.innerText = data.summary || fallbackSummary(input);
        summaryGenerated = true;
    } catch (error) {
        console.warn('Summarization error:', error);
        output.innerText = error.message || 'Summarization failed. Please try again.';
        summaryGenerated = false;
    }

    if (speakButton) {
        speakButton.disabled = false;
        speakButton.style.opacity = "1";
    }
}

function fallbackSummary(input) {
    const sentences = input.split(/[।.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('. ') + '.';
}

// Speak summary function using AWS Polly with browser fallback
function getSpeechLanguage() {
    const languageSelect = document.getElementById('speechLanguage');
    return languageSelect ? languageSelect.value : 'en';
}

function getAvailableVoice(lang) {
    const voiceCode = lang === 'hi' ? 'hi-IN' : 'en-US';
    const voices = window.speechSynthesis.getVoices();
    return voices.find(v => v.lang === voiceCode)
        || voices.find(v => v.lang.startsWith(voiceCode.split('-')[0]))
        || voices[0];
}

async function speakSummary() {
    const output = document.getElementById("output");
    const speakButton = document.getElementById("speakButton");
    const text = output && output.innerText ? output.innerText.trim() : "";
    const selectedLanguage = getSpeechLanguage();

    if (!text || !summaryGenerated) {
        alert("No summary available to speak.");
        return;
    }

    // Stop current speech if speaking
    if (isSpeaking) {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        isSpeaking = false;
        speakButton.innerHTML = "🔊 Speak";
        return;
    }

    try {
        speakButton.innerHTML = "⏳ Loading...";
        speakButton.disabled = true;

        console.log('Requesting speech synthesis for language:', selectedLanguage);

        const speechUrl = `${API_BASE}/api/speech`;
        console.log('Calling speech API at:', speechUrl);

        let backendFailed = false;

        try {
            const response = await fetch(speechUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    language: selectedLanguage
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                // If AWS not configured, use browser fallback
                if (response.status === 503 && errorData.useBrowserFallback) {
                    console.warn('AWS not configured, falling back to browser speech synthesis');
                    backendFailed = true;
                } else {
                    const details = errorData.details ? `: ${errorData.details}` : '';
                    throw new Error((errorData.error || 'Speech synthesis failed') + details);
                }
            } else {
                console.log('Received audio response from AWS Polly');
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);

                if (!audioElement) {
                    audioElement = new Audio();
                }

                audioElement.src = audioUrl;
                audioElement.onloadeddata = function() {
                    console.log('Audio loaded, starting playback');
                    isSpeaking = true;
                    speakButton.innerHTML = "⏹️ Stop";
                    speakButton.disabled = false;
                    audioElement.play();
                };

                audioElement.onended = function() {
                    console.log('Audio playback ended');
                    isSpeaking = false;
                    speakButton.innerHTML = "🔊 Speak";
                    URL.revokeObjectURL(audioUrl);
                };

                audioElement.onerror = function(error) {
                    console.error('Audio playback error:', error);
                    isSpeaking = false;
                    speakButton.innerHTML = "🔊 Speak";
                    speakButton.disabled = false;
                    alert("Error playing audio. Please try again.");
                    URL.revokeObjectURL(audioUrl);
                };

                return;
            }
        } catch (backendError) {
            backendFailed = true;
            console.warn('Backend speech request failed:', backendError);
        }

        if (backendFailed) {
            if (!('speechSynthesis' in window)) {
                throw new Error('Browser does not support speech synthesis');
            }

            const voice = getAvailableVoice(selectedLanguage);
            if (!voice) {
                if (selectedLanguage === 'hi') {
                    throw new Error('Hindi voice not available in this browser. Available voices: ' + window.speechSynthesis.getVoices().map(v => v.name).join(', '));
                }
                throw new Error('No speech synthesis voice was found for your browser.');
            }

            console.log(`Using browser Web Speech API with voice: ${voice.name}`);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';
            utterance.voice = voice;
            utterance.pitch = 1;
            utterance.rate = 1;

            utterance.onstart = function() {
                console.log('Browser TTS started');
                isSpeaking = true;
                speakButton.innerHTML = "⏹️ Stop";
                speakButton.disabled = false;
            };

            utterance.onend = function() {
                console.log('Browser TTS ended');
                isSpeaking = false;
                speakButton.innerHTML = "🔊 Speak";
            };

            utterance.onerror = function(event) {
                console.error('Browser TTS error:', event.error);
                isSpeaking = false;
                speakButton.innerHTML = "🔊 Speak";
                speakButton.disabled = false;
                alert("Speech synthesis failed: " + event.error);
            };

            window.speechSynthesis.speak(utterance);
            return;
        }
    } catch (error) {
        console.error('Speech synthesis error:', error);
        isSpeaking = false;
        speakButton.innerHTML = "🔊 Speak";
        speakButton.disabled = false;
        alert("Speech synthesis failed: " + error.message);
    }
}

// Download summary function
function downloadSummary() {
    if (!summaryGenerated) {
        alert("Summary not generated yet!");
        return;
    }

    const output = document.getElementById("output");
    const text = output && output.innerText ? output.innerText.trim() : "";

    // Create a blob from the text
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'summary.txt';

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(url);
}