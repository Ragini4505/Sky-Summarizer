exports.generateSummary = async (text) => {
    if (!text || text.trim().length === 0) {
        return "No text provided.";
    }

    // Split into sentences
    const sentences = text
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0);

    if (sentences.length <= 2) {
        return sentences.join(". ") + ".";
    }

    // Clean words & remove common stopwords
    const stopWords = new Set([
        "the","is","in","at","of","a","and","to","for","on","with","as","by","an","be","this","that","it","from","or","are"
    ]);

    const words = text.toLowerCase().match(/\w+/g) || [];

    // Word frequency
    const wordFreq = {};
    words.forEach(word => {
        if (!stopWords.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });

    // Score each sentence
    const sentenceScores = sentences.map((sentence, index) => {
        const sentenceWords = sentence.toLowerCase().match(/\w+/g) || [];
        let score = 0;

        sentenceWords.forEach(word => {
            if (wordFreq[word]) {
                score += wordFreq[word];
            }
        });

        return { sentence, score, index };
    });

    // Sort by score (important sentences first)
    sentenceScores.sort((a, b) => b.score - a.score);

    // Select top sentences (40% of total)
    const summaryLength = Math.ceil(sentences.length * 0.4);

    const selected = sentenceScores
        .slice(0, summaryLength)
        .sort((a, b) => a.index - b.index); // keep original order

    const summary = selected.map(s => s.sentence).join(". ");

    return summary + ".";
};