
import React, { createContext, useContext, useState, ReactNode } from "react";

export type InterviewMode = "text" | "audio" | "video";
export type JobField = string;

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
    criteria: {
      technicalKnowledge: number;
      communication: number;
      problemSolving: number;
      culturalFit: number;
      experience: number;
    };
    detailedReview: string;
  };
  setFeedback: (feedback: InterviewContextType['feedback']) => void;
  resetInterview: () => void;
  addCustomJobField: (id: string, label: string) => void;
  customJobFields: Array<{ id: string; label: string; icon: string }>;
}

const defaultQuestions = {
  "software-engineering": [
    "Tell me about your experience with software development?",
    "How do you approach debugging a complex issue?",
    "Explain a challenging project you've worked on and how you overcame obstacles.",
    "Describe a time when you had to refactor a large codebase. What was your approach and what challenges did you face?",
    "How do you ensure your code is maintainable and scalable for future developers?",
    "Explain the concept of dependency injection and when you would use it.",
    "How do you stay updated with the latest technologies?",
    "Describe your ideal development environment and team structure."
  ],
  "data-science": [
    "Explain your approach to a data analysis project from start to finish.",
    "How do you handle missing or incomplete data?",
    "Describe a complex data problem you solved and the impact it had.",
    "Explain the difference between supervised and unsupervised learning with examples.",
    "How would you detect and handle outliers in a dataset?",
    "Describe a situation where you had to balance statistical rigor with business needs.",
    "What statistical methods do you commonly use and why?",
    "How do you communicate technical findings to non-technical stakeholders?"
  ],
  "marketing": [
    "Describe a successful marketing campaign you've led.",
    "How do you measure the success of marketing initiatives?",
    "How do you identify and target key customer segments?",
    "Explain how you would create a comprehensive omnichannel marketing strategy.",
    "How do you balance creativity with data-driven decision making?",
    "Describe a marketing campaign that failed and what you learned from it.",
    "What's your approach to digital marketing and social media?",
    "How do you stay on top of marketing trends and changes?"
  ],
  "sales": [
    "Describe your sales methodology.",
    "How do you handle objections from potential clients?",
    "Tell me about a difficult sale you closed successfully.",
    "How do you qualify leads and prioritize your sales pipeline?",
    "Describe a situation where you lost a sale and what you learned from it.",
    "What strategies do you use to upsell or cross-sell to existing customers?",
    "How do you build relationships with clients?",
    "What CRM systems have you used and how did they improve your process?"
  ],
  "design": [
    "Walk me through your design process from concept to delivery.",
    "How do you incorporate user feedback into your designs?",
    "Describe a project where you had to balance aesthetics with functionality.",
    "How do you approach designing for accessibility and inclusive experiences?",
    "Explain how you would conduct effective user research before beginning a design.",
    "How do you handle conflicting feedback from stakeholders?",
    "How do you stay inspired and generate new ideas?",
    "How do you collaborate with developers and other team members?"
  ],
  "product-management": [
    "How do you prioritize features for a product roadmap?",
    "Describe how you gather and incorporate user feedback.",
    "Tell me about a product launch you managed and any challenges you faced.",
    "How do you make decisions when you don't have all the data you need?",
    "Describe a time when you had to pivot a product strategy and how you managed stakeholder expectations.",
    "How do you evaluate the success of a product after launch?",
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
    criteria: {
      technicalKnowledge: 0,
      communication: 0,
      problemSolving: 0,
      culturalFit: 0,
      experience: 0,
    },
    detailedReview: "",
  },
  setFeedback: () => {},
  resetInterview: () => {},
  addCustomJobField: () => {},
  customJobFields: [],
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
  const [customJobFields, setCustomJobFields] = useState<Array<{ id: string; label: string; icon: string }>>([]);
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
    criteria: {
      technicalKnowledge: 0,
      communication: 0,
      problemSolving: 0,
      culturalFit: 0,
      experience: 0,
    },
    detailedReview: "",
  });

  const handleSetJobField = (field: JobField) => {
    setJobField(field);
    
    // Check if it's a predefined field
    if (defaultQuestions[field as keyof typeof defaultQuestions]) {
      setQuestions(defaultQuestions[field as keyof typeof defaultQuestions]);
    } else {
      // Check if it's a custom field
      const customField = customJobFields.find(f => f.id === field);
      if (customField) {
        // Generate generic questions for custom fields
        setQuestions([
          `Tell me about your experience in ${customField.label}?`,
          `What are the most important skills for success in ${customField.label}?`,
          `Describe a challenging situation you've faced in ${customField.label} and how you resolved it.`,
          `How do you stay current with trends and developments in ${customField.label}?`,
          `What achievement in ${customField.label} are you most proud of and why?`,
          `How do you handle pressure or tight deadlines in ${customField.label}?`,
          `Describe your approach to problem-solving in ${customField.label}.`,
          `Where do you see the ${customField.label} field evolving in the next 5 years?`,
        ]);
      } else {
        // Fallback to generic questions
        setQuestions([
          "Tell me about your relevant experience?",
          "What are your greatest professional strengths?",
          "Describe a challenging situation you've faced at work and how you resolved it.",
          "Why are you interested in this position?",
          "Where do you see yourself professionally in 5 years?",
          "How do you handle pressure or stressful situations?",
          "Describe your approach to problem-solving.",
          "What questions do you have for me?",
        ]);
      }
    }
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
  
  const addCustomJobField = (id: string, label: string) => {
    const newField = {
      id,
      label,
      icon: "🔍", // Default icon for custom fields
    };
    
    setCustomJobFields((prev) => [...prev, newField]);
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
      criteria: {
        technicalKnowledge: 0,
        communication: 0,
        problemSolving: 0,
        culturalFit: 0,
        experience: 0,
      },
      detailedReview: "",
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
        addCustomJobField,
        customJobFields,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;
