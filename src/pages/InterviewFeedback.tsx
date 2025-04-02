
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInterview } from "@/contexts/InterviewContext";
import { Check, X, ArrowUp, ArrowDown } from "lucide-react";

const ScoreGauge = ({ score }: { score: number }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-green-400";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="relative h-48 w-48 mx-auto mb-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-4xl font-bold">{score}</div>
      </div>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e6e6e6"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={getScoreColor(score)}
          strokeWidth="10"
          strokeDasharray={`${(score / 100) * 283} 283`}
          transform="rotate(-90 50 50)"
        />
      </svg>
    </div>
  );
};

const BehaviorChart = ({ behavior }: { behavior: Record<string, number> }) => {
  return (
    <div className="space-y-3">
      {Object.entries(behavior).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between mb-1">
            <span className="text-sm capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </span>
            <span className="text-sm font-semibold">{Math.round(value)}%</span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      ))}
    </div>
  );
};

const InterviewFeedback = () => {
  const { 
    userName, 
    jobField, 
    interviewMode, 
    questions, 
    answers, 
    behaviorAnalysis, 
    feedback, 
    resetInterview 
  } = useInterview();
  const navigate = useNavigate();

  const handleStartNew = () => {
    resetInterview();
    navigate("/welcome");
  };

  const getJobFieldLabel = () => {
    const fieldMap: Record<string, string> = {
      "software-engineering": "Software Engineering",
      "data-science": "Data Science",
      "marketing": "Marketing",
      "sales": "Sales",
      "design": "Design",
      "product-management": "Product Management",
    };
    return fieldMap[jobField || ""] || jobField;
  };

  const getModeLabel = () => {
    const modeMap: Record<string, string> = {
      "text": "Text Chat",
      "audio": "Audio Chat",
      "video": "Video Chat",
    };
    return modeMap[interviewMode || ""] || interviewMode;
  };

  return (
    <div className="min-h-screen bg-interview-light p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader className="text-center border-b pb-6">
            <div className="mb-2">
              {feedback.passed ? (
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Interview Passed
                </div>
              ) : (
                <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Needs Improvement
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold">
              Your Interview Results
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 text-center">
                <h3 className="text-lg font-medium mb-4">Overall Score</h3>
                <ScoreGauge score={feedback.overallScore} />
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {feedback.overallScore >= 90
                      ? "Excellent! Top-tier performance."
                      : feedback.overallScore >= 75
                      ? "Great job! Strong performance overall."
                      : feedback.overallScore >= 60
                      ? "Good effort with room for improvement."
                      : "Needs significant improvement."}
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Interview Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500">Candidate</div>
                        <div className="font-medium">{userName}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500">Job Field</div>
                        <div className="font-medium">{getJobFieldLabel()}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-gray-500">Interview Type</div>
                        <div className="font-medium">{getModeLabel()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Strengths</h3>
                      <ul className="space-y-2">
                        {feedback.strengths.map((strength, index) => (
                          <li key={index} className="flex">
                            <div className="mr-2 mt-0.5 text-green-500">
                              <Check className="h-4 w-4" />
                            </div>
                            <div>{strength}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Areas for Improvement</h3>
                      <ul className="space-y-2">
                        {feedback.improvements.map((improvement, index) => (
                          <li key={index} className="flex">
                            <div className="mr-2 mt-0.5 text-yellow-500">
                              <ArrowUp className="h-4 w-4" />
                            </div>
                            <div>{improvement}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-8">
            <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
            <TabsTrigger value="responses">Your Responses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {interviewMode === "video" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Communication Skills</h3>
                      <BehaviorChart behavior={{ clarity: behaviorAnalysis.clarity }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-4">Body Language & Presence</h3>
                      <BehaviorChart
                        behavior={{
                          eyeContact: behaviorAnalysis.eyeContact,
                          confidence: behaviorAnalysis.confidence,
                          engagement: behaviorAnalysis.engagement,
                          attentiveness: behaviorAnalysis.attentiveness,
                        }}
                      />
                    </div>
                  </div>
                ) : interviewMode === "audio" ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Voice Analysis</h3>
                    <BehaviorChart
                      behavior={{
                        clarity: behaviorAnalysis.clarity,
                        confidence: behaviorAnalysis.confidence,
                        engagement: behaviorAnalysis.engagement,
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Response Quality</h3>
                    <BehaviorChart
                      behavior={{
                        clarity: behaviorAnalysis.clarity,
                        engagement: behaviorAnalysis.engagement,
                      }}
                    />
                  </div>
                )}
                
                <div className="mt-8 bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">AI Interviewer Notes</h3>
                  <p className="text-gray-700">
                    {feedback.passed
                      ? "The candidate demonstrated strong communication skills and provided relevant answers. They showed good knowledge of the field and handled questions confidently."
                      : "The candidate has potential but needs to work on structuring answers more clearly. More specific examples would strengthen responses, and improved eye contact would enhance presence."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="responses" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Question & Answer Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <div className="font-medium">Question {index + 1}:</div>
                      <div className="text-gray-800 mb-3">{question}</div>
                      <div className="font-medium">Your Answer:</div>
                      <div className="bg-gray-50 p-3 rounded-lg mt-1">
                        {answers[index] || "No answer provided"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 text-center">
          <Button onClick={handleStartNew} className="interview-button">
            Start a New Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
