
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useInterview } from "@/contexts/InterviewContext";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Camera, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;
  
  // Initialize permissions based on mode
  useEffect(() => {
    if (interviewMode === "video" || interviewMode === "audio") {
      requestPermissions();
    } else {
      setPermissionsGranted(true);
    }
    
    // Simulate AI asking the first question
    const timer = setTimeout(() => {
      speakQuestion(questions[0]);
    }, 1000);
    
    return () => clearTimeout(timer);
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
        }
      } else if (interviewMode === "audio") {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      setPermissionsGranted(true);
      toast({
        title: "Permissions granted",
        description: `${interviewMode === "video" ? "Camera and microphone" : "Microphone"} access allowed`,
      });
      
      // Initialize speech recognition for audio mode
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
    // Speech recognition simulation
    // In a real app, we would use the Web Speech API or a similar library
    console.log("Speech recognition initialized");
  };
  
  const speakQuestion = (question: string) => {
    // In a real app, we would use the Web Speech API or a similar library to speak the question
    console.log("AI asking:", question);
    
    // Simulate AI speaking
    toast({
      title: "Interviewer",
      description: question,
      duration: 5000,
    });
  };
  
  const startAnswering = () => {
    setIsAnswering(true);
    
    if (interviewMode === "audio" || interviewMode === "video") {
      // Start countdown before recording
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
    
    // Simulate random attention checks for video mode
    if (interviewMode === "video") {
      // Random attention check simulation
      const attentionCheckInterval = setInterval(() => {
        const shouldWarn = Math.random() > 0.7; // 30% chance of warning
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
    
    // Simulate recording start
    toast({
      title: "Recording started",
      description: "You can start speaking now",
    });
    
    // In a real app, we would start the actual recording here
    // For simulation, we'll just set a timeout
    setTimeout(() => {
      // Simulate behavioral analysis updates during recording
      if (interviewMode === "video") {
        updateBehaviorAnalysis("eyeContact", Math.random() * 100);
        updateBehaviorAnalysis("confidence", Math.random() * 100);
        updateBehaviorAnalysis("engagement", Math.random() * 100);
        updateBehaviorAnalysis("attentiveness", Math.random() * 100);
      }
      
      updateBehaviorAnalysis("clarity", Math.random() * 100);
    }, 2000);
  };
  
  const stopRecording = () => {
    setIsListening(false);
    setIsRecording(false);
    
    // Simulate processing the recording
    toast({
      title: "Processing your answer",
      description: "Please wait...",
    });
    
    // Simulate a delay for processing
    setTimeout(() => {
      // This would be the transcribed text in a real app
      const simulatedAnswer = interviewMode === "text" 
        ? textAnswer 
        : `This is a simulated answer for the ${interviewMode} interview mode. In a real app, this would be the transcribed speech or video analysis.`;
      
      addAnswer(simulatedAnswer);
      
      // Clear text input if in text mode
      if (interviewMode === "text") {
        setTextAnswer("");
      }
      
      setIsAnswering(false);
      
      // Move to next question or finish interview
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        
        // Ask the next question after a short delay
        setTimeout(() => {
          speakQuestion(questions[currentQuestionIndex + 1]);
        }, 1000);
      } else {
        // Generate feedback and navigate to feedback page
        generateFeedback();
      }
    }, 2000);
  };
  
  const generateFeedback = () => {
    // Simulate generating feedback
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
    
    // Random score between 65 and 95
    const overallScore = 65 + Math.floor(Math.random() * 30);
    const passed = overallScore >= 70;
    
    setFeedback({
      strengths,
      improvements,
      overallScore,
      passed,
    });
    
    setTimeout(() => navigate("/interview-feedback"), 1000);
  };
  
  const handleEndInterview = () => {
    // Generate feedback and navigate to feedback page
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
            <Button 
              variant="outline" 
              className="border-interview-accent text-interview-accent hover:bg-interview-accent hover:text-white"
              onClick={handleEndInterview}
            >
              End Interview
            </Button>
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
          {/* Video feed for video mode */}
          {interviewMode === "video" && (
            <div className="md:col-span-1">
              <Card className="bg-white shadow-md h-full">
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                    {permissionsGranted ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Button onClick={requestPermissions}>
                          <Camera className="mr-2 h-4 w-4" />
                          Allow Camera Access
                        </Button>
                      </div>
                    )}
                    
                    {/* Recording indicator */}
                    {isRecording && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                        REC
                      </div>
                    )}
                    
                    {/* Countdown overlay */}
                    {showCountdown && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-6xl font-bold">
                        {countdown}
                      </div>
                    )}
                    
                    {/* Attention warning */}
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
          
          {/* Main interview area */}
          <div className={`${interviewMode === "video" ? "md:col-span-2" : "md:col-span-3"}`}>
            <Card className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">Current Question:</h2>
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
                      <div className="bg-gray-50 rounded-lg p-4 min-h-[150px] flex items-center justify-center">
                        {!permissionsGranted ? (
                          <Button onClick={requestPermissions}>
                            <Mic className="mr-2 h-4 w-4" />
                            Allow Microphone Access
                          </Button>
                        ) : !isAnswering ? (
                          <div className="text-center text-gray-500">
                            <p>Press the button below when you're ready to answer.</p>
                          </div>
                        ) : isListening ? (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-interview-primary rounded-full flex items-center justify-center mx-auto mb-2">
                              <Mic className="h-8 w-8 text-white" />
                            </div>
                            <p className="text-interview-primary animate-pulse">Listening...</p>
                          </div>
                        ) : showCountdown ? (
                          <div className="text-6xl font-bold text-interview-primary">
                            {countdown}
                          </div>
                        ) : (
                          <p className="text-gray-500">Preparing...</p>
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
