/**
 * Calls your backend Gemini proxy API to format a Discord message.
 * @param {string} rawMessage The user's original message.
 * @param {object} options Formatting options selected by the user.
 * @returns {Promise<string>} The formatted message as Markdown.
 */
export async function formatDiscordMessage(rawMessage, options) {
  const backendUrl = 'https://discord-formatterr.onrender.com/ask-gemini';

  // Build prompt text with options
  const prompt = `
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

  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Debug: log full backend response
    console.log("Gemini backend response:", data);

    // Safely extract the formatted text
    const formattedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!formattedText) {
      throw new Error('No valid response from Gemini backend.');
    }

    return formattedText;
  } catch (error) {
    console.error('Error contacting backend:', error);
    throw new Error('Failed to get a formatted message. Please try again later.');
  }
}
