
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterview } from "@/contexts/InterviewContext";
import type { JobField } from "@/contexts/InterviewContext";

const jobFields = [
  { id: "software-engineering", label: "Software Engineering", icon: "💻" },
  { id: "data-science", label: "Data Science", icon: "📊" },
  { id: "marketing", label: "Marketing", icon: "📱" },
  { id: "sales", label: "Sales", icon: "💼" },
  { id: "design", label: "Design", icon: "🎨" },
  { id: "product-management", label: "Product Management", icon: "📝" },
];

const WelcomePage = () => {
  const { userName, setJobField } = useInterview();
  const navigate = useNavigate();

  const handleSelectField = (field: JobField) => {
    setJobField(field);
    navigate("/interview-prep");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-interview-light to-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome, <span className="gradient-text">{userName}</span>!
          </h1>
          <p className="text-lg text-gray-700">
            Let's prepare you for your next job interview. First, select the field you're interviewing for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 staggered-fade-in">
          {jobFields.map((field, index) => (
            <Card 
              key={field.id}
              className="border border-gray-200 hover:border-interview-primary hover:shadow-md transition-all cursor-pointer"
              onClick={() => handleSelectField(field.id as JobField)}
            >
              <CardHeader className="pb-2">
                <div className="text-4xl mb-2">{field.icon}</div>
                <CardTitle>{field.label}</CardTitle>
                <CardDescription>
                  Prepare for your {field.label} interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Get field-specific questions and feedback tailored to {field.label} roles.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
