import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useInterview } from "@/contexts/InterviewContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Mic, MicOff, Video, VideoOff, Send, Volume, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

// Mock interview questions based on job field
const getInterviewQuestions = (jobField: string) => {
  const questions: Record<string, string[]> = {
    "software-engineering": [
      "Tell me about your experience with React and TypeScript.",
      "How do you approach debugging a complex issue in your code?",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "How do you stay updated with the latest technologies and programming practices?",
      "Explain how you would design a scalable web application architecture.",
    ],
    "data-science": [
      "Explain the difference between supervised and unsupervised learning.",
      "How do you handle missing data in a dataset?",
      "Describe a data science project you've worked on and the impact it had.",
      "What evaluation metrics do you use for classification problems?",
      "How would you explain a complex machine learning model to non-technical stakeholders?",
    ],
    "marketing": [
      "Describe a successful marketing campaign you've developed.",
      "How do you measure the success of your marketing efforts?",
      "What strategies do you use to identify and reach your target audience?",
      "How do you stay current with digital marketing trends?",
      "Describe how you would approach marketing a new product launch.",
    ],
    // Default questions for any other job field
    "default": [
      "Tell me about yourself and your background.",
      "What are your greatest professional strengths?",
      "What do you consider to be your weaknesses?",
      "Why are you interested in this position?",
      "Where do you see yourself in five years?",
    ],
  };

  return questions[jobField] || questions["default"];
};

// Define TypeScript interfaces for speech recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechSynthesisUtteranceEvent extends Event {
  utterance: SpeechSynthesisUtterance;
  charIndex?: number;
  charLength?: number;
  elapsedTime?: number;
  name?: string;
}

// Augment the window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechSynthesisUtterance: new (text: string) => SpeechSynthesisUtterance;
  }

  interface SpeechSynthesisUtterance extends EventTarget {
    text: string;
    lang: string;
    voice: SpeechSynthesisVoice | null;
    volume: number;
    rate: number;
    pitch: number;
    onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
    onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
    onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
    onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
    onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
    onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
    onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEvent) => any) | null;
  }

  interface SpeechSynthesisVoice {
    voiceURI: string;
    name: string;
    lang: string;
    localService: boolean;
    default: boolean;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    abort: () => void;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  }
}

const InterviewSession = () => {
  const { userName, jobField, interviewMode } = useInterview();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const [questions] = useState<string[]>(() => getInterviewQuestions(jobField));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<string[]>([]);
  const [currentResponse, setCurrentResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Set up camera for video mode
  useEffect(() => {
    const setupCamera = async () => {
      if (interviewMode === "video" && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraActive(true);
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
          toast.error("Unable to access camera. Please check permissions.");
        }
      }
    };

    // Auto start the interview with a delay
    const timer = setTimeout(() => {
      if (currentQuestionIndex === 0) {
        speakQuestion(questions[0]);
      }
    }, 1000);
    
    if (interviewMode === "video") {
      setupCamera();
    }
    
    return () => {
      clearTimeout(timer);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      // Clean up camera
      if (cameraActive && videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewMode, questions, currentQuestionIndex]);

  // Initialize speech recognition for audio and video modes
  useEffect(() => {
    if (interviewMode === "audio" || interviewMode === "video") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;
          
          setCurrentResponse(prev => {
            // If it's a final result, append it to the current response
            if (event.results[last].isFinal) {
              return prev + " " + transcript;
            }
            // Otherwise, just update the current response
            return transcript;
          });
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error("Speech recognition error:", event);
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        toast.error("Speech recognition is not supported in your browser.");
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [interviewMode]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const handleResponseSubmit = () => {
    if (currentResponse.trim() === "") {
      toast.error("Please provide a response before continuing.");
      return;
    }
    
    // Save the current response
    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = currentResponse.trim();
    setResponses(updatedResponses);
    
    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    
    // Move to the next question or end interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setCurrentResponse("");
      
      // Speak the next question after a short delay
      setTimeout(() => {
        speakQuestion(questions[currentQuestionIndex + 1]);
      }, 500);
    } else {
      setInterviewComplete(true);
      setTimeout(() => {
        navigate("/interview-feedback");
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleResponseSubmit();
    }
  };

  const endInterview = () => {
    navigate("/interview-feedback");
  };

  const speakQuestion = (question: string) => {
    toast.info(question, {
      id: "current-question",
      duration: 5000,
    });
    
    if ((interviewMode === "audio" || interviewMode === "video") && audioEnabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      const utterance = new window.SpeechSynthesisUtterance(question);
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.lang.includes('en-') && !voice.name.includes('Google')
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        console.error("Speech synthesis error");
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    if (audioEnabled && isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-light to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            {interviewMode === "text" ? "Text" : 
             interviewMode === "audio" ? "Audio" : 
             "Video"} Interview
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Audio toggle button */}
            {(interviewMode === "audio" || interviewMode === "video") && (
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudio}
                  title={audioEnabled ? "Mute interviewer" : "Unmute interviewer"}
                >
                  {audioEnabled ? <Volume2 /> : <VolumeX />}
                </Button>
                {isSpeaking && (
                  <span className="ml-2 text-sm text-interview-primary animate-pulse">
                    Speaking...
                  </span>
                )}
              </div>
            )}
            
            <Button 
              variant="destructive" 
              onClick={endInterview}
            >
              End Interview
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder.svg" alt="Interviewer" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="font-semibold text-gray-700">AI Interviewer</p>
              <div className="mt-2 p-3 bg-gray-100 rounded-lg">
                <p className="text-gray-800">{questions[currentQuestionIndex]}</p>
              </div>
              
              {(interviewMode === "audio" || interviewMode === "video") && (
                <button 
                  className="mt-2 text-sm text-interview-primary flex items-center"
                  onClick={() => speakQuestion(questions[currentQuestionIndex])}
                >
                  <Volume className="h-4 w-4 mr-1" />
                  Repeat question
                </button>
              )}
            </div>
          </div>
        </div>
        
        {interviewMode === "video" && (
          <div className="mb-6">
            <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              {!cameraActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white">Camera access required for video interview</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="font-semibold text-gray-700">{userName}</p>
              
              {interviewMode === "text" ? (
                <div className="mt-2">
                  <Textarea
                    value={currentResponse}
                    onChange={(e) => setCurrentResponse(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your response here..."
                    className="min-h-32"
                  />
                </div>
              ) : (
                <div className="mt-2">
                  <div className="p-3 bg-gray-100 rounded-lg min-h-32">
                    <p className="text-gray-800">{currentResponse || "Your response will appear here as you speak..."}</p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <Button
                      variant={isListening ? "destructive" : "default"}
                      className="flex items-center"
                      onClick={toggleListening}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="mr-2 h-5 w-5" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="mr-2 h-5 w-5" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    
                    {isListening && (
                      <span className="text-interview-primary animate-pulse">
                        Listening...
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button onClick={handleResponseSubmit} className="interview-button">
                  <Send className="mr-2 h-4 w-4" />
                  {currentQuestionIndex < questions.length - 1 ? "Submit & Next Question" : "Complete Interview"}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-600">
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
