// ============================================
// NextHire Backend Server
// ============================================
// This server handles API calls to Groq and Deepgram
// keeping your API keys secure server-side

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Groq = require('groq-sdk');
const fs = require('fs');
const path = require('path');

// Load configuration
let CONFIG;
try {
    CONFIG = require('./config.js');
    console.log('✅ Configuration loaded successfully');
} catch (error) {
    console.error('❌ ERROR: config.js not found!');
    console.error('📝 Please copy config.template.js to config.js and add your API keys');
    process.exit(1);
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Groq client
const groq = new Groq({
    apiKey: CONFIG.GROQ_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure file upload
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
    }
});

// ============================================
// API Routes
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'NextHire backend is running!' });
});

// Generate interview questions
app.post('/start-interview', upload.single('resume'), async (req, res) => {
    try {
        const { role, experienceLevel } = req.body;
        
        if (!role || !experienceLevel) {
            return res.status(400).json({ error: 'Role and experience level are required' });
        }

        console.log(`📝 Generating questions for ${experienceLevel} ${role}`);

        // Create prompt for Groq
        const prompt = `You are an expert interview coach. Generate exactly 5 highly relevant interview questions for a ${experienceLevel}-level ${role} position.

Requirements:
- Questions should be role-specific and appropriate for ${experienceLevel} level
- Include a mix of behavioral, technical, and situational questions
- Questions should encourage STAR method responses
- Be realistic and commonly asked in real interviews

Return ONLY a JSON array of 5 question strings, nothing else. Format:
["question 1", "question 2", "question 3", "question 4", "question 5"]`;

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
        });

        const responseText = completion.choices[0]?.message?.content || '[]';
        const questions = JSON.parse(responseText);

        console.log(`✅ Generated ${questions.length} questions`);

        // Clean up uploaded file if exists
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.json({
            questions,
            resumeProcessed: !!req.file
        });

    } catch (error) {
        console.error('❌ Error generating questions:', error);
        res.status(500).json({ error: 'Failed to generate questions: ' + error.message });
    }
});

// Transcribe audio (using Groq's Whisper)
app.post('/transcribe-audio', upload.single('audio'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }

        console.log(`🎤 Transcribing audio: ${req.file.originalname}`);

        // Use Groq's Whisper model for transcription
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(req.file.path),
            model: 'whisper-large-v3',
            response_format: 'json',
        });

        // Clean up audio file
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        console.log(`✅ Transcription complete`);

        res.json({
            success: true,
            text: transcription.text
        });

    } catch (error) {
        console.error('❌ Error transcribing audio:', error);
        
        // Clean up file on error
        if (req.file) {
            fs.unlink(req.file.path, (err) => {});
        }

        res.status(500).json({ 
            success: false,
            error: 'Transcription failed: ' + error.message 
        });
    }
});

// Evaluate interview answer
app.post('/evaluate-answer', async (req, res) => {
    try {
        const { question, userAnswer } = req.body;

        if (!question || !userAnswer) {
            return res.status(400).json({ error: 'Question and answer are required' });
        }

        console.log(`📊 Evaluating answer for: "${question.substring(0, 50)}..."`);

        const prompt = `You are an expert interview coach evaluating a candidate's answer. Provide detailed, constructive feedback.

QUESTION: ${question}

CANDIDATE'S ANSWER: ${userAnswer}

Evaluate this answer and respond with ONLY a JSON object in this exact format (no markdown, no extra text):
{
  "score": <number 0-10>,
  "goodPoints": ["point 1", "point 2", "point 3"],
  "missingElements": ["element 1", "element 2"],
  "improvementAdvice": "detailed advice paragraph"
}

Scoring criteria:
- Structure and clarity (STAR method usage)
- Specific examples and details
- Relevance to the question
- Depth and completeness
- Professional communication

Be encouraging but honest. Provide 2-4 good points and 1-3 missing elements.`;

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.5,
            max_tokens: 1024,
        });

        let responseText = completion.choices[0]?.message?.content || '{}';
        
        // Clean up response if it has markdown code blocks
        responseText = responseText.trim();
        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json\n?/, '').replace(/```$/, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```\n?/, '').replace(/```$/, '').trim();
        }

        const evaluation = JSON.parse(responseText);

        console.log(`✅ Evaluation complete - Score: ${evaluation.score}/10`);

        res.json(evaluation);

    } catch (error) {
        console.error('❌ Error evaluating answer:', error);
        res.status(500).json({ error: 'Failed to evaluate answer: ' + error.message });
    }
});

// ============================================
// Error Handling
// ============================================

app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 NextHire Backend Server Running!');
    console.log('='.repeat(50));
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
    console.log('\n💡 Open NextHire.html in your browser to get started!');
    console.log('🛑 Press Ctrl+C to stop the server\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down NextHire server...');
    process.exit(0);
});
