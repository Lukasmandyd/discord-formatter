/**
 * Calls your backend Gemini proxy API to format a message.
 * @param {string} rawMessage The user's original message.
 * @param {object} options The formatting options.
 * @returns {Promise<string>} The formatted message as a Markdown string.
 */
export async function formatDiscordMessage(rawMessage, options) {
    const backendUrl = 'https://gemini-backend-2fgy.onrender.com/ask-gemini';

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: buildPrompt(rawMessage, options) })
        });

        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("No valid response from Gemini backend.");
        }
    } catch (error) {
        console.error("Error contacting backend:", error);
        throw new Error("Something went wrong with the backend. Check your connection or try again later.");
    }
}

/**
 * Builds a Gemini prompt from message + options
 */
function buildPrompt(rawMessage, options) {
    return `
You are an expert at formatting messages for Discord. Your task is to take a raw text message and reformat it to be engaging and clear, using Discord's markdown.

Please adhere to the following formatting options:
- Use Emojis: ${options.useEmojis}
- Add Hashtags: ${options.addHashtags} (related to the content, at the end)
- Formatting Style: ${options.formattingStyle} (e.g., 'expressive' means using lots of bold/italics, 'minimal' means using them sparingly)
- Tone: ${options.tone} (e.g., casual, enthusiastic, formal)
- Desired Length: ${options.messageLength} (keep it 'concise', 'default' length, or make it more 'detailed')

Constraints:
- ONLY output the formatted message. Do not include any other text, explanations, or pleasantries.
- Use Discord-flavored markdown (e.g., **bold**, *italics*, __underline__, ~~strikethrough~~, > quote, \`code\`).
- If hashtags are requested, add 2–3 relevant hashtags at the very end of the message.

Here is the raw message:
---
${rawMessage}
---`;
}
