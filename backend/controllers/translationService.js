const { TranslationServiceClient } = require('@google-cloud/translate').v3;
require('dotenv').config();

const client = new TranslationServiceClient();

const projectId = 'easeyt'; // Your Google Cloud project ID
const location = 'global';

const translateText = async (text, targetLang) => {
    try {
        const request = {
            parent: `projects/${projectId}/locations/${location}`,
            contents: [text],
            mimeType: 'text/plain',
            targetLanguageCode: targetLang,
        };

        const [response] = await client.translateText(request);
        return response.translations[0].translatedText;
    } catch (error) {
        console.error('Google Translate Error:', error);
        return null;
    }
};

module.exports = translateText;
