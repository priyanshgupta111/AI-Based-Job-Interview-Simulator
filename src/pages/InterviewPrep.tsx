
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInterview } from "@/contexts/InterviewContext";
import type { InterviewMode } from "@/contexts/InterviewContext";
import { MessageSquare, Mic, Video } from "lucide-react";

const interviewModes = [
  {
    id: "text",
    label: "Text Chat",
    icon: <MessageSquare className="h-10 w-10 text-interview-primary" />,
    description: "Answer questions by typing your responses.",
    features: [
      "Type your answers at your own pace",
      "Review your responses before submitting",
      "Good for practicing structured answers",
    ],
    permissions: [],
  },
  {
    id: "audio",
    label: "Audio Chat",
    icon: <Mic className="h-10 w-10 text-interview-primary" />,
    description: "Answer questions by speaking. Your voice will be analyzed.",
    features: [
      "Practice speaking your answers clearly",
      "Voice recognition and analysis",
      "Feedback on speech clarity and tone",
    ],
    permissions: ["Microphone access required"],
  },
  {
    id: "video",
    label: "Video Chat",
    icon: <Video className="h-10 w-10 text-interview-primary" />,
    description: "Full interview experience with video, audio and behavioral analysis.",
    features: [
      "Complete interview simulation",
      "Body language and eye contact analysis",
      "Comprehensive behavioral feedback",
    ],
    permissions: ["Camera and microphone access required"],
  },
];

const InterviewPrep = () => {
  const { userName, jobField, setInterviewMode } = useInterview();
  const navigate = useNavigate();

  const getJobFieldLabel = () => {
    const field = interviewModes.find((mode) => mode.id === jobField);
    return field ? field.label : jobField;
  };

  const handleSelectMode = (mode: InterviewMode) => {
    setInterviewMode(mode);
    navigate("/interview-session");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-light to-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Interview Mode
          </h1>
          <p className="text-lg text-gray-700">
            Select how you'd like to conduct your interview session
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 staggered-fade-in">
          {interviewModes.map((mode) => (
            <Card
              key={mode.id}
              className="border border-gray-200 hover:border-interview-primary hover:shadow-md transition-all h-full flex flex-col"
            >
              <CardContent className="pt-6 flex-1 flex flex-col">
                <div className="flex items-center justify-center mb-4">
                  {mode.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{mode.label}</h3>
                <p className="text-gray-600 mb-4 text-center">{mode.description}</p>
                
                <div className="mt-auto">
                  <ul className="space-y-2 mb-6">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-interview-primary mr-2">✓</span>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {mode.permissions.length > 0 && (
                    <div className="mb-4 text-xs text-gray-500">
                      {mode.permissions.map((permission, index) => (
                        <div key={index}>{permission}</div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectMode(mode.id as InterviewMode)}
                    className="w-full interview-button"
                  >
                    Start {mode.label}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in">
          <p className="text-gray-600 mb-4">
            Don't worry, you'll receive guidance throughout the interview process. Good luck!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
