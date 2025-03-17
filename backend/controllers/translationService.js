const axios = require('axios');

// Function to translate text
const translateText = async (text, sourceLang, targetLang) => {
    try {
        // Construct the API URL
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
        
        // Send GET request to MyMemory API
        const response = await axios.get(url);
        
        // Extract the translated text from the response
        return response.data.responseData.translatedText;
    } catch (error) {
        console.error("Translation error:", error);
        return null;
    }
};

// Export the function so it can be used in other files
module.exports = translateText;
