import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import Timer from '../components/Timer';
import MCQQuestion from '../components/MCQQuestion';
import Header from '../components/Header';
import { useExamContext } from '../context/ExamContext';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

const Exam: React.FC = () => {
  const { studentInfo, setExamResults } = useExamContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [startTime] = useState(Date.now());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();

  // Check if student info exists, if not redirect to home
  useEffect(() => {
    if (!studentInfo.fullName || !studentInfo.schoolName) {
      navigate('/');
    }
  }, [studentInfo, navigate]);

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (hasSubmitted) return;
    
    submitExam();
  };

  const handleTimeUp = () => {
    if (hasSubmitted) return;
    
    submitExam();
  };

  const submitExam = () => {
    setHasSubmitted(true);
    
    // Calculate score
    let score = 0;
    const answeredQuestions = Object.keys(answers).map(Number);
    
    for (const questionId of answeredQuestions) {
      const question = questions.find(q => q.id === questionId);
      if (question && answers[questionId] === question.correctAnswer) {
        score++;
      }
    }
    
    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // in seconds
    
    // Set exam results in context
    setExamResults({
      answers,
      score,
      totalQuestions: questions.length,
      timeSpent
    });
    
    // Navigate to results page
    navigate('/results');
  };

  // If student info doesn't exist, don't render the page
  if (!studentInfo.fullName || !studentInfo.schoolName) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestionsCount = Object.keys(answers).length;
  const hasAnsweredCurrent = answers[currentQuestion.id] !== undefined;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <Timer duration={30} onTimeUp={handleTimeUp} />
      
      <div className="max-w-3xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm font-medium text-gray-500">
              প্রশ্ন {currentQuestionIndex + 1} / {questions.length}
            </div>
            <div className="text-sm font-medium text-gray-500">
              উত্তর দেওয়া হয়েছে: {answeredQuestionsCount} / {questions.length}
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(answeredQuestionsCount / questions.length) * 100}%` }}
            />
          </div>
        </div>
        
        <MCQQuestion
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] || null}
          onSelectAnswer={handleAnswerSelect}
        />
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 border border-blue-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            পূর্ববর্তী
          </button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              onClick={handleNextQuestion}
              disabled={!hasAnsweredCurrent}
              className={`flex items-center px-4 py-2 rounded ${
                !hasAnsweredCurrent
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              পরবর্তী
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredQuestionsCount < questions.length}
              className={`flex items-center px-6 py-2 rounded ${
                answeredQuestionsCount < questions.length
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              সাবমিট করুন
              <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
        
        {/* Question navigation */}
        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            প্রশ্ন নেভিগেশন
          </h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = index === currentQuestionIndex;
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${isAnswered 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}
                    ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                  `}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exam;
