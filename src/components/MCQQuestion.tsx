import React, { useEffect, useRef } from 'react';
import { Check, Circle } from 'lucide-react';
import { Question } from '../data/questions';

interface MCQQuestionProps {
  question: Question;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showAnswer?: boolean;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({ 
  question, 
  selectedAnswer, 
  onSelectAnswer,
  showAnswer = false
}) => {
  const isCorrect = selectedAnswer === question.correctAnswer;
  const questionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (window.MathJax && questionRef.current) {
      window.MathJax.typesetPromise([questionRef.current]).catch((err) => 
        console.error('MathJax typesetting failed:', err)
      );
    }
  }, [question]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div ref={questionRef}>
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          {question.question}
        </h3>
        
        <div className="space-y-3 mt-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === question.correctAnswer;
            
            let bgColor = 'bg-white';
            let borderColor = 'border-gray-300';
            let textColor = 'text-gray-700';
            
            if (showAnswer) {
              if (isCorrectOption) {
                bgColor = 'bg-green-50';
                borderColor = 'border-green-500';
                textColor = 'text-green-700';
              } else if (isSelected && !isCorrectOption) {
                bgColor = 'bg-red-50';
                borderColor = 'border-red-500';
                textColor = 'text-red-700';
              }
            } else if (isSelected) {
              bgColor = 'bg-blue-50';
              borderColor = 'border-blue-500';
              textColor = 'text-blue-700';
            }
            
            return (
              <div
                key={index}
                onClick={() => !showAnswer && onSelectAnswer(option)}
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-all duration-200 ${bgColor} ${borderColor} ${textColor} ${
                  !showAnswer ? 'hover:bg-gray-50' : ''
                }`}
              >
                <div className="flex-1">
                  <span className="font-medium">{option}</span>
                </div>
                
                {isSelected && !showAnswer && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
                
                {showAnswer && isCorrectOption && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                
                {!isSelected && !showAnswer && (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MCQQuestion;