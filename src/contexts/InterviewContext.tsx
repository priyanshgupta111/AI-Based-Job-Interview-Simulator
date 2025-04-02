
import React, { createContext, useContext, useState, ReactNode } from "react";

export type InterviewMode = "text" | "audio" | "video";
export type JobField = "software-engineering" | "data-science" | "marketing" | "sales" | "design" | "product-management";

interface InterviewContextType {
  userName: string;
  setUserName: (name: string) => void;
  jobField: JobField | null;
  setJobField: (field: JobField) => void;
  interviewMode: InterviewMode | null;
  setInterviewMode: (mode: InterviewMode) => void;
  questions: string[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: string[];
  addAnswer: (answer: string) => void;
  behaviorAnalysis: {
    eyeContact: number;
    confidence: number;
    clarity: number;
    engagement: number;
    attentiveness: number;
  };
  updateBehaviorAnalysis: (key: keyof InterviewContextType['behaviorAnalysis'], value: number) => void;
  feedback: {
    strengths: string[];
    improvements: string[];
    overallScore: number;
    passed: boolean;
  };
  setFeedback: (feedback: InterviewContextType['feedback']) => void;
  resetInterview: () => void;
}

const defaultQuestions = {
  "software-engineering": [
    "Tell me about your experience with software development?",
    "How do you approach debugging a complex issue?",
    "Explain a challenging project you've worked on and how you overcame obstacles.",
    "How do you stay updated with the latest technologies?",
    "Describe your ideal development environment and team structure."
  ],
  "data-science": [
    "Explain your approach to a data analysis project from start to finish.",
    "How do you handle missing or incomplete data?",
    "Describe a complex data problem you solved and the impact it had.",
    "What statistical methods do you commonly use and why?",
    "How do you communicate technical findings to non-technical stakeholders?"
  ],
  "marketing": [
    "Describe a successful marketing campaign you've led.",
    "How do you measure the success of marketing initiatives?",
    "How do you identify and target key customer segments?",
    "What's your approach to digital marketing and social media?",
    "How do you stay on top of marketing trends and changes?"
  ],
  "sales": [
    "Describe your sales methodology.",
    "How do you handle objections from potential clients?",
    "Tell me about a difficult sale you closed successfully.",
    "How do you build relationships with clients?",
    "What CRM systems have you used and how did they improve your process?"
  ],
  "design": [
    "Walk me through your design process from concept to delivery.",
    "How do you incorporate user feedback into your designs?",
    "Describe a project where you had to balance aesthetics with functionality.",
    "How do you stay inspired and generate new ideas?",
    "How do you collaborate with developers and other team members?"
  ],
  "product-management": [
    "How do you prioritize features for a product roadmap?",
    "Describe how you gather and incorporate user feedback.",
    "Tell me about a product launch you managed and any challenges you faced.",
    "How do you balance business goals with user needs?",
    "How do you work with engineering, design, and other departments?"
  ]
};

const defaultContext: InterviewContextType = {
  userName: "",
  setUserName: () => {},
  jobField: null,
  setJobField: () => {},
  interviewMode: null,
  setInterviewMode: () => {},
  questions: [],
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: () => {},
  answers: [],
  addAnswer: () => {},
  behaviorAnalysis: {
    eyeContact: 0,
    confidence: 0,
    clarity: 0,
    engagement: 0,
    attentiveness: 0,
  },
  updateBehaviorAnalysis: () => {},
  feedback: {
    strengths: [],
    improvements: [],
    overallScore: 0,
    passed: false,
  },
  setFeedback: () => {},
  resetInterview: () => {},
};

const InterviewContext = createContext<InterviewContextType>(defaultContext);

export const useInterview = () => useContext(InterviewContext);

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider = ({ children }: InterviewProviderProps) => {
  const [userName, setUserName] = useState("");
  const [jobField, setJobField] = useState<JobField | null>(null);
  const [interviewMode, setInterviewMode] = useState<InterviewMode | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState({
    eyeContact: 0,
    confidence: 0,
    clarity: 0,
    engagement: 0,
    attentiveness: 0,
  });
  const [feedback, setFeedback] = useState({
    strengths: [],
    improvements: [],
    overallScore: 0,
    passed: false,
  });

  const handleSetJobField = (field: JobField) => {
    setJobField(field);
    // Set questions based on job field
    setQuestions(defaultQuestions[field] || []);
  };

  const addAnswer = (answer: string) => {
    setAnswers((prev) => [...prev, answer]);
  };

  const updateBehaviorAnalysis = (
    key: keyof typeof behaviorAnalysis,
    value: number
  ) => {
    setBehaviorAnalysis((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetInterview = () => {
    setJobField(null);
    setInterviewMode(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setBehaviorAnalysis({
      eyeContact: 0,
      confidence: 0,
      clarity: 0,
      engagement: 0,
      attentiveness: 0,
    });
    setFeedback({
      strengths: [],
      improvements: [],
      overallScore: 0,
      passed: false,
    });
  };

  return (
    <InterviewContext.Provider
      value={{
        userName,
        setUserName,
        jobField,
        setJobField: handleSetJobField,
        interviewMode,
        setInterviewMode,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        addAnswer,
        behaviorAnalysis,
        updateBehaviorAnalysis,
        feedback,
        setFeedback,
        resetInterview,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;
