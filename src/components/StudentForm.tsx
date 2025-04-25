import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface StudentFormProps {
  onSubmit: (fullName: string, schoolName: string) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; schoolName?: string }>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: { fullName?: string; schoolName?: string } = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'পূর্ণ নাম আবশ্যক';
    }
    
    if (!schoolName.trim()) {
      newErrors.schoolName = 'স্কুলের নাম আবশ্যক';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes
    onSubmit(fullName, schoolName);
    navigate('/exam');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        পরীক্ষার্থীর তথ্য
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            পূর্ণ নাম
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="আপনার পূর্ণ নাম লিখুন"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
            স্কুলের নাম
          </label>
          <input
            type="text"
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
              errors.schoolName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="আপনার স্কুলের নাম লিখুন"
          />
          {errors.schoolName && (
            <p className="mt-1 text-sm text-red-600">{errors.schoolName}</p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            পরীক্ষা শুরু করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;