
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInterview } from "@/contexts/InterviewContext";

const HomePage = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const { setUserName } = useInterview();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    
    setUserName(name);
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-light to-white flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4 staggered-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text">
            AI Interview Simulator Pro
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Practice job interviews with our advanced AI. Get real-time feedback on your answers, 
            communication skills, and body language.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto mt-10 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-6">Ready to ace your interview?</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700 mb-1">
                What's your name?
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError(false);
                }}
                className={`w-full ${nameError ? 'border-red-500' : ''}`}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1 text-left">Please enter your name</p>
              )}
            </div>
            
            <Button 
              onClick={handleStart}
              className="interview-button w-full mt-4"
            >
              Get Started
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="interview-card">
            <div className="text-interview-primary text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Text Interview</h3>
            <p className="text-gray-600">Practice with text-based interviews. Type your answers and get instant feedback.</p>
          </div>
          
          <div className="interview-card">
            <div className="text-interview-primary text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold mb-2">Audio Interview</h3>
            <p className="text-gray-600">Practice speaking your answers with voice recognition technology.</p>
          </div>
          
          <div className="interview-card">
            <div className="text-interview-primary text-4xl mb-4">📹</div>
            <h3 className="text-xl font-semibold mb-2">Video Interview</h3>
            <p className="text-gray-600">Full simulation with video recording and body language analysis.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
