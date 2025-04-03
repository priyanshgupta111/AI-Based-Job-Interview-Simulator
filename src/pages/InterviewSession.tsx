
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInterview } from "@/contexts/InterviewContext";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Camera, CameraOff, Video, VideoOff, X, Check, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item: (index: number) => SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item: (index: number) => SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
    speechSynthesis: SpeechSynthesis;
  }
}

const InterviewSession = () => {
  const {
    userName,
    jobField,
    interviewMode,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    addAnswer,
    updateBehaviorAnalysis,
    setFeedback,
  } = useInterview();
  
  const [textAnswer, setTextAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [attentionWarning, setAttentionWarning] = useState(false);
  const [liveTranscription, setLiveTranscription] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  
  useEffect(() => {
    if (interviewMode === "video" || interviewMode === "audio") {
      requestPermissions();
    } else {
      setPermissionsGranted(true);
    }
    
    const timer = setTimeout(() => {
      if (questions.length > 0) {
        speakQuestion(questions[0]);
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      // Stop any ongoing speech when component unmounts
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  const requestPermissions = async () => {
    try {
      if (interviewMode === "video") {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.play().catch(error => {
            console.error("Error playing video:", error);
          });
          
          setTimeout(() => {
            if (videoRef.current && videoRef.current.paused) {
              console.log("Video is still paused, trying to play again");
              videoRef.current.play().catch(e => console.error("Second play attempt failed:", e));
            } else {
              console.log("Video is playing successfully");
            }
          }, 1000);
        }
      } else if (interviewMode === "audio") {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      setPermissionsGranted(true);
      toast({
        title: "Permissions granted",
        description: `${interviewMode === "video" ? "Camera and microphone" : "Microphone"} access allowed`,
      });
      
      if (interviewMode === "audio" || interviewMode === "video") {
        initSpeechRecognition();
      }
      
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast({
        variant: "destructive",
        title: "Permission denied",
        description: `Please allow ${interviewMode === "video" ? "camera and microphone" : "microphone"} access to continue`,
      });
    }
  };
  
  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      toast({
        variant: "destructive",
        title: "Browser not supported",
        description: "Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.",
      });
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setLiveTranscription(finalTranscript + interimTranscript);
      
      if (interviewMode === "video") {
        updateBehaviorAnalysis("eyeContact", Math.random() * 100);
        updateBehaviorAnalysis("confidence", Math.random() * 100);
        updateBehaviorAnalysis("engagement", Math.random() * 100);
        updateBehaviorAnalysis("attentiveness", Math.random() * 100);
      }
      
      updateBehaviorAnalysis("clarity", Math.random() * 100);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      toast({
        variant: "destructive",
        title: "Speech recognition error",
        description: event.message || "An error occurred during speech recognition",
      });
    };
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      }
    };
    
    speechRecognitionRef.current = recognition;
    console.log("Real speech recognition initialized");
  };
  
  const speakQuestion = (question: string) => {
    console.log("AI asking:", question);
    
    toast({
      title: "Interviewer",
      description: question,
      duration: 5000,
    });
    
    // Only speak aloud if in audio or video mode and audio is enabled
    if ((interviewMode === "audio" || interviewMode === "video") && audioEnabled && window.speechSynthesis) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(question);
      
      // Set voice properties
      utterance.rate = 1.0; // Normal speaking rate
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      
      // Try to use a professional-sounding voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.lang.includes('en-') && !voice.name.includes('Google')
      );
      
      if (preferredVoices.length > 0) {
        // Use the first preferred voice
        utterance.voice = preferredVoices[0];
      }
      
      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsSpeaking(false);
      };
      
      // Speak the utterance
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    
    // If turning off while speaking, stop the current speech
    if (audioEnabled && isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    
    toast({
      title: audioEnabled ? "Audio disabled" : "Audio enabled",
      description: audioEnabled ? "Questions will no longer be spoken aloud" : "Questions will now be spoken aloud",
    });
  };
  
  const startAnswering = () => {
    setIsAnswering(true);
    setLiveTranscription("");
    
    if (interviewMode === "audio" || interviewMode === "video") {
      setShowCountdown(true);
      let count = 3;
      setCountdown(count);
      
      const countdownInterval = setInterval(() => {
        count -= 1;
        setCountdown(count);
        
        if (count === 0) {
          clearInterval(countdownInterval);
          setShowCountdown(false);
          startRecording();
        }
      }, 1000);
    }
    
    if (interviewMode === "video") {
      const attentionCheckInterval = setInterval(() => {
        const shouldWarn = Math.random() > 0.7;
        if (shouldWarn && isRecording) {
          setAttentionWarning(true);
          setTimeout(() => setAttentionWarning(false), 3000);
        }
      }, 10000);
      
      return () => clearInterval(attentionCheckInterval);
    }
  };
  
  const startRecording = () => {
    setIsListening(true);
    setIsRecording(true);
    
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.start();
        
        toast({
          title: "Recording started",
          description: "You can start speaking now",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast({
          variant: "destructive",
          title: "Recording error",
          description: "Could not start recording. Please try again.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Speech recognition not available",
        description: "Your browser may not support this feature or permissions were denied.",
      });
    }
  };
  
  const stopRecording = () => {
    setIsListening(false);
    setIsRecording(false);
    
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    
    toast({
      title: "Processing your answer",
      description: "Please wait...",
    });
    
    setTimeout(() => {
      const simulatedAnswer = interviewMode === "text" 
        ? textAnswer 
        : liveTranscription || `This is a simulated answer for the ${interviewMode} interview mode. In a real app, this would be the transcribed speech or video analysis.`;
      
      addAnswer(simulatedAnswer);
      
      if (interviewMode === "text") {
        setTextAnswer("");
      }
      
      setLiveTranscription("");
      setIsAnswering(false);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        
        setTimeout(() => {
          speakQuestion(questions[currentQuestionIndex + 1]);
        }, 1000);
      } else {
        generateFeedback();
      }
    }, 2000);
  };
  
  const generateFeedback = () => {
    const strengths = [
      "Clear communication style",
      "Structured answers with relevant examples",
      "Good understanding of technical concepts",
    ];
    
    const improvements = [
      "Could improve eye contact during responses",
      "Sometimes spoke too quickly when discussing complex topics",
      "Consider adding more specific metrics to demonstrate impact",
    ];
    
    const overallScore = 65 + Math.floor(Math.random() * 30);
    const passed = overallScore >= 70;
    
    const criteria = {
      technicalKnowledge: 60 + Math.floor(Math.random() * 40),
      communication: 60 + Math.floor(Math.random() * 40),
      problemSolving: 60 + Math.floor(Math.random() * 40),
      culturalFit: 60 + Math.floor(Math.random() * 40),
      experience: 60 + Math.floor(Math.random() * 40),
    };
    
    const detailedReview = passed 
      ? "The candidate demonstrated good knowledge and communication skills throughout the interview. They provided structured responses with relevant examples and showed a strong understanding of the core concepts in their field. Their answers were generally clear and concise."
      : "The candidate shows potential but needs improvement in several key areas. Their responses lacked specific examples in some cases, and technical knowledge could be stronger. With further preparation and practice, they could become a stronger candidate.";
    
    setFeedback({
      strengths,
      improvements,
      overallScore,
      passed,
      criteria,
      detailedReview,
    });
    
    setTimeout(() => navigate("/interview-feedback"), 1000);
  };
  
  const handleEndInterview = () => {
    generateFeedback();
  };
  
  if (!questions.length) {
    navigate("/welcome");
    return null;
  }
  
  return (
    <div className="min-h-screen bg-interview-light p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {interviewMode?.charAt(0).toUpperCase() + interviewMode?.slice(1)} Interview
            </h1>
            <div className="flex items-center gap-2">
              {(interviewMode === "audio" || interviewMode === "video") && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleAudio}
                  className="text-gray-600 hover:text-gray-800"
                >
                  {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-interview-accent text-interview-accent hover:bg-interview-accent hover:text-white"
                onClick={handleEndInterview}
              >
                End Interview
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {interviewMode === "video" && (
            <div className="md:col-span-1">
              <Card className="bg-white shadow-md h-full">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                    {permissionsGranted ? (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        {!videoRef.current?.srcObject && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70">
                            <p className="text-gray-700">Video feed not available</p>
                            <Button 
                              size="sm" 
                              className="ml-2" 
                              onClick={requestPermissions}
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Retry
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Button onClick={requestPermissions}>
                          <Camera className="mr-2 h-4 w-4" />
                          Allow Camera Access
                        </Button>
                      </div>
                    )}
                    
                    {isRecording && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                        REC
                      </div>
                    )}
                    
                    {showCountdown && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-6xl font-bold">
                        {countdown}
                      </div>
                    )}
                    
                    {attentionWarning && (
                      <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-3 py-2 rounded-lg flex items-center">
                        <span className="mr-1">⚠️</span>
                        Look at the camera
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-gray-500">
                    {isRecording ? (
                      <div className="flex items-center justify-center text-red-500">
                        <span className="animate-pulse mr-2">●</span>
                        Recording in progress
                      </div>
                    ) : (
                      "Your video feed"
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className={`${interviewMode === "video" ? "md:col-span-2" : "md:col-span-3"}`}>
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold">Current Question:</h2>
                    {isSpeaking && (
                      <div className="flex items-center text-sm text-interview-primary">
                        <span className="inline-block w-2 h-2 bg-interview-primary rounded-full mr-1 animate-pulse"></span>
                        Speaking...
                      </div>
                    )}
                  </div>
                  <p className="text-lg">{questions[currentQuestionIndex]}</p>
                </div>
                
                <div className="space-y-4">
                  {interviewMode === "text" ? (
                    <>
                      <Textarea
                        placeholder="Type your answer here..."
                        className="min-h-[150px]"
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        disabled={!isAnswering}
                      />
                      
                      {!isAnswering ? (
                        <Button
                          className="interview-button w-full"
                          onClick={startAnswering}
                        >
                          Start Answering
                        </Button>
                      ) : (
                        <Button
                          className="bg-interview-success text-white w-full"
                          onClick={stopRecording}
                          disabled={!textAnswer.trim()}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Submit Answer
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 rounded-lg p-4 min-h-[150px] flex flex-col">
                        {!permissionsGranted ? (
                          <div className="flex items-center justify-center h-full">
                            <Button onClick={requestPermissions}>
                              <Mic className="mr-2 h-4 w-4" />
                              Allow Microphone Access
                            </Button>
                          </div>
                        ) : !isAnswering ? (
                          <div className="text-center text-gray-500 flex-grow flex items-center justify-center">
                            <p>Press the button below when you're ready to answer.</p>
                          </div>
                        ) : showCountdown ? (
                          <div className="text-center flex-grow flex items-center justify-center">
                            <div className="text-6xl font-bold text-interview-primary">
                              {countdown}
                            </div>
                          </div>
                        ) : isListening ? (
                          <div className="flex flex-col h-full">
                            <div className="text-center mb-4">
                              <div className="w-16 h-16 bg-interview-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                <Mic className="h-8 w-8 text-white" />
                              </div>
                              <p className="text-interview-primary animate-pulse mb-2">Listening...</p>
                            </div>
                            
                            <div className="flex-grow overflow-auto bg-white border border-gray-200 rounded-lg p-3 text-gray-800">
                              {liveTranscription ? liveTranscription : (
                                <p className="text-gray-400 italic">Your speech will appear here as you speak...</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 flex-grow flex items-center justify-center">
                            <p>Preparing...</p>
                          </div>
                        )}
                      </div>
                      
                      {!isAnswering ? (
                        <Button
                          className="interview-button w-full"
                          onClick={startAnswering}
                          disabled={!permissionsGranted}
                        >
                          Start Answering
                        </Button>
                      ) : (
                        <Button
                          className={`w-full ${isListening ? "bg-red-500" : "bg-interview-success"} text-white`}
                          onClick={stopRecording}
                          disabled={!isListening}
                        >
                          {isListening ? (
                            <>
                              <MicOff className="mr-2 h-4 w-4" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Submit Answer
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </div>
                
                <div className="mt-6 text-sm text-gray-500">
                  <p>
                    <span className="font-medium">Tip:</span>{" "}
                    {interviewMode === "text"
                      ? "Take your time to structure your answer before submitting."
                      : interviewMode === "audio"
                      ? "Speak clearly and at a moderate pace for best results."
                      : "Maintain eye contact with the camera and minimize background distractions."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
