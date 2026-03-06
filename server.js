// ============================================
// NextHire Combined Backend Server
// Supports both Text-Based and Live Interview
// ============================================

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

// Load configuration from environment variables
const CONFIG = {
    GROQ_API_KEY: process.env.GROQ_API_KEY
};

if (!CONFIG.GROQ_API_KEY) {
    console.error('❌ ERROR: GROQ_API_KEY environment variable is not set!');
    console.error('📝 Please add GROQ_API_KEY to Render environment variables');
    process.exit(1);
}

console.log('✅ Configuration loaded successfully');

const app = express();
const PORT = process.env.PORT || 3000;

const groq = new Groq({ apiKey: CONFIG.GROQ_API_KEY });

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|txt|webm|ogg|mp4|wav|mp3/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb(new Error('File type not allowed'));
    }
});

// ─── Serve Frontend ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'NextHire.html'));
});

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'NextHire backend is running!' });
});

// ─── Generate Interview Questions ────────────────────────────
app.post('/start-interview', upload.single('resume'), async (req, res) => {
    try {
        const { role, experienceLevel } = req.body;
        if (!role || !experienceLevel) {
            return res.status(400).json({ error: 'Role and experience level are required' });
        }
        console.log(`📝 Generating questions for ${experienceLevel} ${role}`);

        const prompt = `You are an expert interview coach. Generate exactly 5 highly relevant interview questions for a ${experienceLevel}-level ${role} position.

Requirements:
- Questions should be role-specific and appropriate for ${experienceLevel} level
- Include a mix of behavioral, technical, and situational questions
- Questions should encourage STAR method responses
- Be realistic and commonly asked in real interviews

Return ONLY a JSON array of 5 question strings, nothing else. Format:
["question 1", "question 2", "question 3", "question 4", "question 5"]`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const responseText = completion.choices[0]?.message?.content || '[]';
        const questions = JSON.parse(responseText);
        console.log(`✅ Generated ${questions.length} questions`);

        if (req.file) fs.unlink(req.file.path, () => {});
        res.json({ questions, resumeProcessed: !!req.file });

    } catch (error) {
        console.error('❌ Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions: ' + error.message });
    }
});

// ─── Transcribe Audio ────────────────────────────────────────
app.post('/transcribe-audio', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No audio file provided' });
        console.log(`🎤 Transcribing audio...`);

        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: 'whisper-large-v3',
            response_format: 'json',
        });

        fs.unlink(req.file.path, () => {});
        console.log(`✅ Transcription complete`);
        res.json({ success: true, text: transcription.text });

    } catch (error) {
        console.error('❌ Error transcribing audio:', error);
        if (req.file) fs.unlink(req.file.path, () => {});
        res.status(500).json({ success: false, error: 'Transcription failed: ' + error.message });
    }
});

// ─── Evaluate Answer (Text + Live Interview) ─────────────────
app.post('/evaluate-answer', async (req, res) => {
    try {
        const { question, userAnswer, videoAnalysis } = req.body;
        if (!question || !userAnswer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }
        console.log(`📊 Evaluating answer for: "${question.substring(0, 50)}..."`);
        if (videoAnalysis?.hasVideoData) {
            console.log(`🎥 Video analysis - Eye Contact: ${videoAnalysis.eyeContactPercent}%, Confidence: ${videoAnalysis.confidenceScore}/10`);
        }

        const prompt = `You are an expert interview coach evaluating a candidate's answer. Provide detailed, constructive feedback.

QUESTION: ${question}

CANDIDATE'S ANSWER: ${userAnswer}

Evaluate this answer and respond with ONLY a JSON object in this exact format (no markdown, no extra text):
{
  "score": <number 0-10>,
  "goodPoints": ["point 1", "point 2", "point 3"],
  "missingElements": ["element 1", "element 2"],
  "areasForImprovement": ["area 1", "area 2", "area 3"],
  "improvementAdvice": "detailed advice paragraph"
}

Scoring criteria:
- Structure and clarity (STAR method usage)
- Specific examples and details
- Relevance to the question
- Depth and completeness
- Professional communication

Be encouraging but honest. Provide 2-4 good points, 2-3 missing elements, and 3-4 specific areas for improvement.`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 1024,
        });

        let responseText = completion.choices[0]?.message?.content || '{}';
        responseText = responseText.trim()
            .replace(/^```json\n?/, '').replace(/^```\n?/, '').replace(/```$/, '').trim();

        const evaluation = JSON.parse(responseText);

        // Add video analysis feedback if present (live interview mode)
        if (videoAnalysis?.hasVideoData) {
            evaluation.videoAnalysis = videoAnalysis;
            evaluation.presentationScore = videoAnalysis.presentationScore;

            const voiceExpressionFeedback = [];
            if (videoAnalysis.eyeContactPercent >= 70)
                voiceExpressionFeedback.push("✅ Excellent eye contact - strong engagement with the camera");
            else if (videoAnalysis.eyeContactPercent >= 50)
                voiceExpressionFeedback.push("⚠️ Good eye contact, but try to look at the camera more consistently (aim for 70%+)");
            else
                voiceExpressionFeedback.push("❌ Eye contact needs improvement - practice looking directly at the camera while speaking");

            if (videoAnalysis.smilePercent >= 30)
                voiceExpressionFeedback.push("✅ Great energy and enthusiasm - your positive expressions came through well");
            else if (videoAnalysis.smilePercent >= 15)
                voiceExpressionFeedback.push("⚠️ Show more enthusiasm - try smiling naturally when discussing achievements");
            else
                voiceExpressionFeedback.push("❌ Expression needs work - smile naturally and show enthusiasm for the role");

            if (videoAnalysis.confidenceScore >= 7)
                voiceExpressionFeedback.push("✅ You projected strong confidence and professional presence");
            else if (videoAnalysis.confidenceScore >= 5)
                voiceExpressionFeedback.push("⚠️ Work on appearing more confident - practice your answers and maintain steady eye contact");
            else
                voiceExpressionFeedback.push("❌ Confidence level appears low - practice extensively and focus on body language cues");

            evaluation.voiceExpressionFeedback = voiceExpressionFeedback;
            evaluation.overallScore = Math.round(evaluation.score * 0.6 + videoAnalysis.presentationScore * 0.4);
        }

        console.log(`✅ Evaluation complete - Score: ${evaluation.score}/10`);
        res.json(evaluation);

    } catch (error) {
        console.error('❌ Error evaluating answer:', error);
        res.status(500).json({ error: 'Failed to evaluate answer: ' + error.message });
    }
});

// ─── Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 NextHire Combined Backend Running!');
    console.log('='.repeat(50));
    console.log(`📍 Server URL:    http://localhost:${PORT}`);
    console.log(`🏥 Health Check:  http://localhost:${PORT}/health`);
    console.log('\n💡 Open NextHire.html in your browser to get started!');
    console.log('🛑 Press Ctrl+C to stop the server\n');
});

process.on('SIGINT', () => {
    console.log('\n👋 Shutting down NextHire server...');
    process.exit(0);
});
