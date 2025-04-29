import React from 'react';
import { BookOpen } from 'lucide-react';
import StudentForm from '../components/StudentForm';
import { useNavigate, Link } from 'react-router-dom';
import { useExamContext } from '../context/ExamContext';

const Home: React.FC = () => {
  const { setStudentInfo } = useExamContext();
  const navigate = useNavigate();

  const handleStudentSubmit = (fullName: string, schoolName: string) => {
    setStudentInfo({ fullName, schoolName });
    navigate('/exam');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-16 px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16" />
          </div>
          
          <h1 className="text-4xl font-bold mb-3">উচ্চতর গনিত MCQ পরীক্ষা</h1>
          <p className="text-xl mb-8">৩০ মিনিটের মধ্যে ৩০টি প্রশ্নের উত্তর দিন</p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              ৩০ মিনিট সময়সীমা
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              ৩০টি MCQ প্রশ্ন
            </div>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full">
              অবিলম্বে ফলাফল
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              পরীক্ষা নির্দেশাবলী
            </h2>
            
            <div className="space-y-4 text-gray-600 mb-8">
              <p>• পরীক্ষার সময়সীমা ৩০ মিনিট।</p>
              <p>• সবগুলো প্রশ্নের উত্তর দেওয়া বাধ্যতামূলক।</p>
              <p>• প্রতিটি প্রশ্নের ৪টি বিকল্প থেকে একটি সঠিক উত্তর বেছে নিন।</p>
              <p>• সময়সীমা শেষ হলে পরীক্ষা আপনা-আপনি সাবমিট হয়ে যাবে।</p>
              <p>• পরীক্ষা শেষে আপনি আপনার ফলাফল দেখতে পাবেন।</p>
            </div>
            
            <StudentForm onSubmit={handleStudentSubmit} />
            
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>
                অ্যাডমিন হিসেবে লগইন করতে{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                  এখানে ক্লিক করুন
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
