
# AI Interview Simulator Pro - Team LetUsCook

## 🏆 CodeForge'25 Hackathon Project

## Project Overview

AI Interview Simulator Pro is an advanced tool designed to help job seekers practice and improve their interview skills through AI-powered simulations. Our platform provides a realistic interview experience with real-time feedback, helping users gain confidence and perform better in actual job interviews.

### Problem Statement

Job interviews are often stressful and challenging, especially for those with limited experience. Many candidates struggle with interview anxiety, proper communication, and responding effectively to unexpected questions. Traditional interview preparation methods like mock interviews with friends or coaches are time-consuming, subjective, and not always available.

### Key Features

- **Multiple Interview Modes:** Choose between text, audio, or video-based interviews to practice different aspects of interview skills
- **Real-time Feedback:** Get instant analysis on your responses, communication style, and body language
- **Customizable Job Fields:** Tailor the interview experience to specific industries including Software Engineering, Data Science, Marketing, and more
- **Comprehensive Performance Analysis:** Receive detailed feedback on strengths, areas for improvement, and overall interview performance
- **User-friendly Interface:** Intuitive design makes preparation accessible to users of all technical backgrounds

## Team Members

- Mannat Kapoor
- Priyansh Gupta
- Aakash Tutlani
- Ishika Shokeen

## Dependencies

- **React** (^18.3.1) - Frontend framework
- **TypeScript** (^5.4.2) - Static typing for JavaScript
- **Vite** (^5.1.6) - Build tool and development server
- **React Router** (^6.26.2) - Client-side routing
- **Tailwind CSS** (^3.4.1) - Utility-first CSS framework
- **shadcn/ui** - Component library based on Radix UI
- **Lucide React** (^0.462.0) - Icon library
- **Sonner** (^1.5.0) - Toast notifications
- **Recharts** (^2.12.7) - Data visualization library
- **Zod** (^3.23.8) - TypeScript-first schema validation

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-interview-simulator.git
   cd ai-interview-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Usage Guide

1. **Getting Started**:
   - Enter your name on the home screen
   - Click "Get Started" to proceed

2. **Select Job Field**:
   - Choose from predefined job fields or create a custom one
   - The system will generate industry-specific interview questions

3. **Choose Interview Mode**:
   - Text Chat: Type your responses
   - Audio Chat: Speak your answers (requires microphone access)
   - Video Chat: Full interview simulation (requires camera and microphone access)

4. **During the Interview**:
   - Listen to or read the questions
   - Respond appropriately based on your chosen mode
   - Proceed through all questions in the session

5. **Review Feedback**:
   - Analyze your performance metrics
   - Review strengths and areas for improvement
   - See detailed feedback on your responses and communication style

## Project Structure

```
ai-interview-simulator/
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components
│   └── App.tsx        # Main application component
├── package.json       # Project dependencies
└── README.md          # Project documentation
```

## Future Enhancements

- Integration with real GPT models for more sophisticated response analysis
- Emotion recognition to provide feedback on facial expressions
- Industry expert interviews and question banks
- Interview recording and playback features
- Resume analysis and tailored interview questions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*This prototype was developed for the CodeForge'25 Hackathon by Team LetUsCook.*
