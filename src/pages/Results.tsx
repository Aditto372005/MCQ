import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../data/questions';
import MCQQuestion from '../components/MCQQuestion';
import Header from '../components/Header';
import { useExamContext } from '../context/ExamContext';
import { saveStudentResponse } from '../services/supabaseClient';
import { CheckCircle, Clock, XCircle, Home } from 'lucide-react';

const Results: React.FC = () => {
  const { studentInfo, examResults } = useExamContext();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if results and student info exist, if not redirect to home
  useEffect(() => {
    if (!examResults || !studentInfo.fullName || !studentInfo.schoolName) {
      navigate('/');
    }
  }, [examResults, studentInfo, navigate]);

  // Save results to Supabase
  useEffect(() => {
    const saveResults = async () => {
      if (!examResults || !studentInfo.fullName || !studentInfo.schoolName || saveSuccess) {
        return;
      }
      
      setIsSaving(true);
      setSaveError(null);
      
      try {
        const { error } = await saveStudentResponse({
          fullName: studentInfo.fullName,
          schoolName: studentInfo.schoolName,
          answers: examResults.answers,
          score: examResults.score,
          totalQuestions: examResults.totalQuestions,
          timeSpent: examResults.timeSpent
        });
        
        if (error) {
          throw new Error(error.message);
        }
        
        setSaveSuccess(true);
      } catch (error) {
        setSaveError(typeof error === 'string' ? error : 'ফলাফল সংরক্ষণ করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
        console.error('Error saving results:', error);
      } finally {
        setIsSaving(false);
      }
    };
    
    saveResults();
  }, [examResults, studentInfo, saveSuccess]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // If results don't exist, don't render the page
  if (!examResults || !studentInfo.fullName || !studentInfo.schoolName) {
    return null;
  }

  const { score, totalQuestions, timeSpent, answers } = examResults;
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Sort questions to show correct answers first
  const sortedQuestions = [...questions].sort((a, b) => {
    const aCorrect = answers[a.id] === a.correctAnswer;
    const bCorrect = answers[b.id] === b.correctAnswer;
    return bCorrect === aCorrect ? 0 : bCorrect ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 text-center">
              পরীক্ষার ফলাফল
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap -mx-4">
              <div className="w-full md:w-1/2 px-4 mb-6 md:mb-0">
                <div className="border rounded-lg p-4">
                  <p className="text-gray-600 mb-1">নাম</p>
                  <p className="font-semibold text-gray-800">{studentInfo.fullName}</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 px-4">
                <div className="border rounded-lg p-4">
                  <p className="text-gray-600 mb-1">স্কুল</p>
                  <p className="font-semibold text-gray-800">{studentInfo.schoolName}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap -mx-4">
              <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0">
                <div className="border rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    {percentage >= 60 ? (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <p className="font-bold text-3xl text-gray-800">{score}/{totalQuestions}</p>
                  <p className="text-gray-600">স্কোর</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 px-4 mb-6 md:mb-0">
                <div className="border rounded-lg p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="font-bold text-3xl text-gray-800">{formatTime(timeSpent)}</p>
                  <p className="text-gray-600">সময় ব্যয়</p>
                </div>
              </div>
              
              <div className="w-full md:w-1/3 px-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold mb-2">
                    {percentage}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        percentage >= 80 ? 'bg-green-500' : 
                        percentage >= 60 ? 'bg-blue-500' : 
                        percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-gray-600 mt-2">শতাংশ</p>
                </div>
              </div>
            </div>
            
            {/* Save status */}
            <div className="mt-6">
              {isSaving && (
                <p className="text-center text-blue-600">ফলাফল সংরক্ষণ করা হচ্ছে...</p>
              )}
              
              {saveError && (
                <p className="text-center text-red-600">{saveError}</p>
              )}
              
              {saveSuccess && (
                <p className="text-center text-green-600">
                  আপনার ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে!
                </p>
              )}
            </div>
            
            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
              >
                <Home className="w-4 h-4 mr-2" />
                হোমপেজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              প্রশ্ন ও উত্তর
            </h2>
          </div>
          
          <div className="p-6">
            {sortedQuestions.map((question) => (
              <MCQQuestion
                key={question.id}
                question={question}
                selectedAnswer={answers[question.id] || null}
                onSelectAnswer={() => {}}
                showAnswer={true}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;