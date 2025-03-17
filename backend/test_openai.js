require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testAPI() {
    try {
        const response = await openai.models.list();
        console.log("✅ OpenAI API Connection Successful:", response.data);
    } catch (error) {
        console.error("❌ OpenAI API Connection Failed:", error);
    }
}

testAPI();
