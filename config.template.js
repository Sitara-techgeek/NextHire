// ============================================
// NextHire API Configuration
// ============================================
// 
// INSTRUCTIONS:
// 1. Rename this file from 'config.template.js' to 'config.js'
// 2. Add your actual API keys below
// 3. NEVER commit config.js to GitHub (it's in .gitignore)
//
// ============================================

const CONFIG = {
    // Groq API Key - Get yours at: https://console.groq.com/
    GROQ_API_KEY: 'your-groq-api-key-here',
    
    // Optional: Deepgram API Key for voice transcription
    // Get yours at: https://deepgram.com/
    DEEPGRAM_API_KEY: 'your-deepgram-api-key-here',
};

// Don't modify below this line
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
