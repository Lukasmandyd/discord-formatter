import { formatDiscordMessage } from './geminiService.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const rawMessageInput = document.getElementById('rawMessageInput');
    const formatButton = document.getElementById('formatButton');
    const buttonText = document.getElementById('buttonText');

    // Options
    const useEmojisCheckbox = document.getElementById('useEmojis');
    const addHashtagsCheckbox = document.getElementById('addHashtags');
    const formattingStyleSelect = document.getElementById('formattingStyle');
    const toneSelect = document.getElementById('tone');
    const messageLengthSelect = document.getElementById('messageLength');

    // Output Area
    const loader = document.getElementById('loader');
    const errorMessageDiv = document.getElementById('errorMessage');
    const formattedMessageOutput = document.getElementById('formattedMessageOutput');

    // --- Event Listeners ---

    // Enable/disable button based on input
    rawMessageInput.addEventListener('input', () => {
        formatButton.disabled = !rawMessageInput.value.trim();
    });

    // Main format button click handler
    formatButton.addEventListener('click', handleFormat);

    // --- Functions ---

    /**
     * Main handler for the format action.
     */
    async function handleFormat() {
        const rawMessage = rawMessageInput.value.trim();
        if (!rawMessage) {
            showError('Please enter a message to format.');
            return;
        }

        const options = {
            useEmojis: useEmojisCheckbox.checked,
            addHashtags: addHashtagsCheckbox.checked,
            formattingStyle: formattingStyleSelect.value,
            tone: toneSelect.value,
            messageLength: messageLengthSelect.value,
        };

        setLoadingState(true);

        try {
            const result = await formatDiscordMessage(rawMessage, options);
            // Use `marked.parse` which is available globally from the CDN script
            const htmlOutput = marked.parse(result);
            formattedMessageOutput.innerHTML = htmlOutput;
        } catch (e) {
            showError(e.message);
        } finally {
            setLoadingState(false);
        }
    }

    /**
     * Updates the UI to show/hide the loading state.
     * @param {boolean} isLoading 
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            formatButton.disabled = true;
            buttonText.textContent = 'Formatting...';
            loader.classList.remove('hidden');
            errorMessageDiv.classList.add('hidden');
            formattedMessageOutput.innerHTML = '';
        } else {
            formatButton.disabled = !rawMessageInput.value.trim();
            buttonText.textContent = 'Format Message';
            loader.classList.add('hidden');
        }
    }

    /**
     * Displays an error message in the UI.
     * @param {string} message 
     */
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
        formattedMessageOutput.innerHTML = ''; // Clear any previous output
    }
});
