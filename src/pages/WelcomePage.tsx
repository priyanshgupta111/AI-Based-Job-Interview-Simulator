
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInterview } from "@/contexts/InterviewContext";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
  const { userName, setJobField, addCustomJobField } = useInterview();
  const navigate = useNavigate();
  const [customField, setCustomField] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customFieldError, setCustomFieldError] = useState(false);

  const handleSelectField = (field: JobField) => {
    setJobField(field);
    navigate("/interview-prep");
  };

  const handleAddCustomField = () => {
    if (!customField.trim()) {
      setCustomFieldError(true);
      return;
    }
    
    const newFieldId = customField.toLowerCase().replace(/\s+/g, '-');
    addCustomJobField(newFieldId, customField);
    setCustomField("");
    setDialogOpen(false);
    handleSelectField(newFieldId as JobField);
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
          
          {/* Custom Field Card */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Card className="border border-dashed border-gray-300 hover:border-interview-primary hover:shadow-md transition-all cursor-pointer bg-gray-50">
                <CardHeader className="pb-2">
                  <div className="text-4xl mb-2 flex justify-center">
                    <Plus className="h-12 w-12 text-gray-400" />
                  </div>
                  <CardTitle className="text-center">Add Custom Field</CardTitle>
                  <CardDescription className="text-center">
                    Don't see your field? Add it here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm text-center">
                    Create a custom interview experience for any job field
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a Custom Job Field</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <label htmlFor="customField" className="text-sm font-medium mb-2 block">
                  Job Field Name
                </label>
                <Input
                  id="customField"
                  value={customField}
                  onChange={(e) => {
                    setCustomField(e.target.value);
                    setCustomFieldError(false);
                  }}
                  placeholder="e.g., Healthcare, Finance, Education"
                  className={customFieldError ? "border-red-500" : ""}
                />
                {customFieldError && (
                  <p className="text-red-500 text-sm mt-1">Please enter a job field name</p>
                )}
              </div>
              <DialogFooter>
                <Button onClick={handleAddCustomField} className="interview-button">
                  Continue to Interview
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
