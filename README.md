# NextHire – AI Interview Platform

AI-powered interview prep with **Text-Based** and **Live Face-to-Face** interview modes.

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API keys**
   ```bash
   cp config.template.js config.js
   # Edit config.js and add your Groq API key
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open in browser**  
   Visit `http://localhost:3000` or open `NextHire.html` directly.

---

## Files

| File | Description |
|------|-------------|
| `NextHire.html` | Main entry point — role/experience setup + mode selection |
| `NextHire-AIInterviewer.html` | Live face-to-face interview with Airi (AI avatar) |
| `server.js` | Combined Express backend for both modes |
| `config.template.js` | API key template — copy to `config.js` |

## API Keys

- **Groq API** (required): https://console.groq.com/
- Powers question generation, answer evaluation, and speech transcription

## Interview Modes

- **📝 Text-Based** — Answer questions by typing or using microphone; get instant AI feedback
- **🎥 Live Interview** — Face-to-face with Airi, the AI interviewer; includes facial analysis
