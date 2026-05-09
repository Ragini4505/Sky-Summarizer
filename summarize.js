async function summarizeText() {
    const input = document.getElementById("inputText").value.trim();
    const output = document.getElementById("output");

    if (!input) {
        output.innerText = "Please enter text.";
        return;
    }

    output.innerText = "Summarizing...";

    try {
        const res = await fetch("http://localhost:5000/api/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: input })
        });

        if (!res.ok) {
            throw new Error(`Server Error: ${res.status}`);
        }

        const data = await res.json();

        output.innerText = data.summary || "No summary returned.";

    } catch (err) {
        console.error("Summarization error:", err);
        output.innerText = "Failed to summarize text. Check backend.";
    }
}