# NextHire - AI-Powered Interview Practice Platform

<div align="center">

![NextHire Logo](NextHire.jpeg)

**Unlock Your Future with Intelligent Interview Preparation**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://github.com/YOUR_USERNAME/nexthire)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/YOUR_USERNAME/nexthire/pulls)

[Features](#-features) • [Quick Start](#-quick-start) • [Setup](#-setup-guide) • [Demo](#-demo) • [Contributing](#-contributing)

</div>

---

## 🎯 About

NextHire is an AI-powered interview practice platform that helps job seekers prepare for interviews with:
- 🤖 **AI-Generated Questions** tailored to your role and experience level
- 📊 **Real-Time Evaluation** with detailed feedback on your answers
- 🎤 **Voice Recording** support for realistic interview practice
- 📈 **Progress Tracking** to monitor your improvement over time

Perfect for anyone preparing for job interviews, career transitions, or skill assessments!

---

## ✨ Features

### 🎯 **Smart Question Generation**
- Role-specific questions based on job title
- Experience-level appropriate (Entry, Intermediate, Senior, Expert)
- Powered by AI for realistic interview scenarios

### 📊 **Intelligent Evaluation**
- Detailed scoring (0-10 scale)
- Highlights what you did well
- Identifies areas for improvement
- Actionable advice using STAR method

### 🎨 **Beautiful Interface**
- Modern, professional design
- Navy and gold color scheme
- Fully responsive (desktop, tablet, mobile)
- Smooth animations and transitions

### 🎤 **Voice Features**
- Text-to-speech: Hear questions read aloud
- Voice recording: Record your answers (transcription requires backend)
- Realistic interview simulation

---

## 🚀 Quick Start

### Option 1: Using the Backend (Full Features)

**Prerequisites:**
- Node.js (v14 or higher)
- Groq API key ([Get one free](https://console.groq.com/))

**Installation:**

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/nexthire.git
cd nexthire

# 2. Install dependencies
npm install

# 3. Set up configuration
cp config.template.js config.js
# Edit config.js and add your API keys

# 4. Start the backend server
node server.js

# 5. Open in browser
# Visit http://localhost:3000
```

### Option 2: Standalone Version (No Backend)

If you prefer not to run a backend server, check out the `standalone` branch:

```bash
git checkout standalone
# Just open NextHire.html in your browser!
```

---

## 🔧 Setup Guide

### Step 1: Get Your API Keys

#### **Groq API (Required for AI features)**
1. Go to [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new key and copy it

**Pricing:** FREE tier includes generous limits!

#### **Deepgram API (Optional - for voice transcription)**
1. Go to [deepgram.com](https://deepgram.com/)
2. Sign up (free tier: 45,000 minutes!)
3. Get your API key from the dashboard

### Step 2: Configure the Application

1. **Copy the template:**
   ```bash
   cp config.template.js config.js
   ```

2. **Edit `config.js`:**
   ```javascript
   const CONFIG = {
       GROQ_API_KEY: 'gsk_your_actual_groq_key_here',
       DEEPGRAM_API_KEY: 'your_deepgram_key_here', // Optional
   };
   ```

3. **Save the file**

**⚠️ IMPORTANT:** Never commit `config.js` to Git! It's already in `.gitignore`.

### Step 3: Install Backend Dependencies

```bash
npm install
```

This installs:
- Express (web server)
- Groq SDK (AI question generation & evaluation)
- Multer (file uploads for resumes)
- CORS (cross-origin requests)

### Step 4: Run the Application

```bash
# Start backend server
node server.js

# Server runs on http://localhost:3000
# Open NextHire.html in your browser
```

---

## 📖 How to Use

### 1️⃣ **Set Up Your Interview**
- Enter your target job role (e.g., "Software Engineer", "Product Manager")
- Select your experience level
- Optionally upload your resume (PDF, DOC, DOCX)
- Click "Generate Questions"

### 2️⃣ **Answer Questions**
- Read each question carefully
- Type your answer (aim for 80-150 words)
- Use the STAR method:
  - **S**ituation - Set the context
  - **T**ask - Your responsibility
  - **A**ction - What you did
  - **R**esult - The outcome
- Click "Get Feedback"

### 3️⃣ **Review Your Performance**
- See your score (0-10)
- Read what you did well
- Learn what to improve
- Get specific advice

### 4️⃣ **Track Progress**
- Complete all 5 questions
- View final summary
- Identify patterns
- Practice until confident!

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **AI:** Groq API (Llama 3 models)
- **Voice:** Web Speech API, Deepgram API
- **Styling:** Custom CSS with modern design system

---

## 📁 Project Structure

```
nexthire/
├── NextHire.html          # Main application interface
├── NextHire.jpeg          # Logo image
├── server.js              # Backend API server
├── package.json           # Node.js dependencies
├── config.template.js     # API key template (safe to commit)
├── config.js             # Your actual API keys (DO NOT COMMIT!)
├── .gitignore            # Protects sensitive files
├── README.md             # This file
└── LICENSE               # MIT License
```

---

## 🔒 Security Best Practices

### ✅ **DO:**
- Use the `config.template.js` template
- Keep your `config.js` file local only
- Add API keys to `config.js`, not the HTML file
- Check `.gitignore` includes `config.js`
- Use environment variables for production

### ❌ **DON'T:**
- Commit `config.js` to GitHub
- Share API keys publicly
- Hardcode keys in HTML/JS files
- Publish keys in screenshots or demos

### 🛡️ **If You Accidentally Commit Keys:**
1. **Immediately revoke** the key in your API provider dashboard
2. Generate a new key
3. Remove the file from Git history:
   ```bash
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch config.js" \
   --prune-empty --tag-name-filter cat -- --all
   ```
4. Force push (⚠️ use carefully):
   ```bash
   git push origin --force --all
   ```

---

## 🌐 Deployment Options

### **Option 1: GitHub Pages (Frontend Only)**
- Use the standalone branch
- No backend server needed
- Free hosting

### **Option 2: Heroku/Railway (Full Stack)**
```bash
# Use environment variables for API keys
heroku config:set GROQ_API_KEY=your_key_here
```

### **Option 3: Vercel/Netlify (Serverless)**
- Deploy as serverless functions
- Set environment variables in dashboard

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit:** `git commit -m 'Add amazing feature'`
6. **Push:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### **Development Guidelines:**
- Follow existing code style
- Test all features before submitting
- Update documentation for new features
- Never commit API keys or sensitive data

---

## 🐛 Troubleshooting

### **"Failed to generate questions"**
- ✅ Check your Groq API key in `config.js`
- ✅ Verify internet connection
- ✅ Ensure backend server is running
- ✅ Check console (F12) for errors

### **"Server not found" error**
- ✅ Start backend: `node server.js`
- ✅ Check server is on http://localhost:3000
- ✅ Verify no port conflicts

### **Voice recording not working**
- ✅ Grant microphone permissions
- ✅ Use HTTPS or localhost
- ✅ Check Deepgram API key (if using transcription)

### **Resume upload failing**
- ✅ Check file size (<10MB)
- ✅ Supported formats: PDF, DOC, DOCX
- ✅ Ensure multer is installed

---

## 📊 API Costs

| Service | Free Tier | Paid Pricing |
|---------|-----------|--------------|
| **Groq** | Very generous limits | ~$0.10-0.25 per 1M tokens |
| **Deepgram** | 45,000 minutes | $0.0043/minute |

**Average interview session:** ~$0.001-0.01 (extremely affordable!)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

---

## 🙏 Acknowledgments

- Built with ❤️ for job seekers worldwide
- Powered by Groq's lightning-fast AI inference
- Inspired by modern interview coaching platforms
- Special thanks to the open-source community

---

## 🎯 Roadmap

- [ ] Video mock interview support
- [ ] AI gesture and body language analysis
- [ ] Multi-language support
- [ ] Company-specific interview prep
- [ ] Mock interview scheduling
- [ ] Performance analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Interview question database expansion

---

## 📞 Support

- **Issues:** [Open an issue](https://github.com/YOUR_USERNAME/nexthire/issues)
- **Discussions:** [Join discussions](https://github.com/YOUR_USERNAME/nexthire/discussions)
- **Email:** your-email@example.com

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Your Name]

[Report Bug](https://github.com/YOUR_USERNAME/nexthire/issues) • [Request Feature](https://github.com/YOUR_USERNAME/nexthire/issues) • [Contribute](CONTRIBUTING.md)

</div>
