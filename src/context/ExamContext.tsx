import React, { createContext, useContext, useState } from 'react';

interface StudentInfo {
  fullName: string;
  schoolName: string;
}

interface ExamResults {
  answers: Record<number, string>;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

interface ExamContextType {
  studentInfo: StudentInfo;
  setStudentInfo: (info: StudentInfo) => void;
  examResults: ExamResults | null;
  setExamResults: (results: ExamResults) => void;
}

const defaultContext: ExamContextType = {
  studentInfo: { fullName: '', schoolName: '' },
  setStudentInfo: () => {},
  examResults: null,
  setExamResults: () => {},
};

const ExamContext = createContext<ExamContextType>(defaultContext);

export const useExamContext = () => useContext(ExamContext);

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({ fullName: '', schoolName: '' });
  const [examResults, setExamResults] = useState<ExamResults | null>(null);

  return (
    <ExamContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
        examResults,
        setExamResults,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};