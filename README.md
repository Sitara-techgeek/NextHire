# NextHire 🎯
### AI-Powered Interview Excellence

NextHire is an AI-driven interview preparation platform that helps candidates practice and improve their interview skills through real-time feedback, video analysis, and personalized coaching — powered by Groq's LLM and Whisper APIs.

---

## ✨ Features

### Two Interview Modes
- **📝 Text-Based Interview** — Answer questions by typing. Get instant AI feedback on your responses.
- **🎥 Video-Based Interview** — Conduct a live mock interview with your webcam and microphone. Receive feedback on both your answers *and* your on-camera presence.

### AI Interviewer — Airi
Airi is your AI interview coach. She generates role-specific questions, listens to your responses, and delivers detailed, constructive evaluations.

### Smart Question Generation
- Generates 5 tailored interview questions based on your target **role** and **experience level**
- Mix of behavioral, technical, and situational questions
- Encourages STAR-method responses

### Answer Evaluation
Each answer is scored on:
- Structure and clarity
- Use of specific examples
- Relevance to the question
- Depth and completeness
- Professional communication

### Live Video Analysis *(Video Mode)*
Real-time analysis of your on-camera performance including:
- 👁️ Eye contact percentage
- 😊 Expression and enthusiasm score
- 💪 Confidence score
- Overall presentation score

### Audio Transcription
Spoken answers are automatically transcribed using OpenAI's Whisper model via Groq, so you can focus on speaking naturally.

### Detailed Feedback Reports
After each question, you receive:
- A score out of 10
- What you did well
- Missing elements
- Specific areas for improvement
- Actionable improvement advice
- Presentation feedback *(video mode only)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (single-file) |
| Backend | Node.js + Express |
| AI / LLM | Groq API (`llama-3.3-70b-versatile`) |
| Transcription | Groq Whisper (`whisper-large-v3`) |
| File Uploads | Multer |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- A [Groq API Key](https://console.groq.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nexthire.git
   cd nexthire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your API key**

   Set your Groq API key as an environment variable:
   ```bash
   export GROQ_API_KEY=your-groq-api-key-here
   ```

   Or create a `.env` file in the project root:
   ```
   GROQ_API_KEY=your-groq-api-key-here
   ```

4. **Start the server**
   ```bash
   node serverR.js
   ```

5. **Open the app**

   Open `NextHire.html` in your browser, or navigate to `http://localhost:3000`.

---

## 📁 Project Structure

```
nexthire/
├── NextHire.html          # Frontend (single-file app)
├── serverR.js             # Express backend server
├── config_template.js     # API key config template
├── uploads/               # Temporary audio upload directory
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/start-interview` | Generate interview questions |
| `POST` | `/transcribe-audio` | Transcribe audio to text |
| `POST` | `/evaluate-answer` | Evaluate a candidate's answer |

---

## ⚙️ Configuration

Copy `config_template.js` to `config.js` and fill in your API keys if not using environment variables.

```js
const CONFIG = {
    GROQ_API_KEY: 'your-groq-api-key-here',
};
```

> ⚠️ **Never commit `config.js` to version control.** It is already listed in `.gitignore`.

---

## 🌐 Deployment

NextHire is ready to deploy on [Render](https://render.com/), [Railway](https://railway.app/), or any Node.js-compatible platform.

Set the following environment variable in your deployment dashboard:
```
GROQ_API_KEY=your-groq-api-key-here
```

The server will automatically use `process.env.PORT` if provided, defaulting to `3000`.

---

## 🔒 Privacy

- Audio files are transcribed and immediately deleted from the server.
- Resume uploads (if provided) are deleted after question generation.
- No user data is stored persistently.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com/) for ultra-fast LLM and Whisper inference
- [Meta LLaMA](https://ai.meta.com/llama/) for the underlying language model
- [OpenAI Whisper](https://openai.com/research/whisper) for speech-to-text
