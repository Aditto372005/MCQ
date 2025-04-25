import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInAdmin } from '../services/supabaseClient';
import Header from '../components/Header';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('ইমেল এবং পাসওয়ার্ড প্রয়োজন');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signInAdmin(email, password);
      
      if (error) {
        throw new Error(error.message);
      }
      
      navigate('/admin');
    } catch (err) {
      setError('লগইন ত্রুটি। আপনার তথ্য যাচাই করুন।');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                অ্যাডমিন লগইন
              </h2>
              <p className="text-gray-600 mt-2">
                অ্যাডমিন প্যানেল অ্যাক্সেস করতে লগইন করুন
              </p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  ইমেল অ্যাড্রেস
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="আপনার ইমেল লিখুন"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/')}
                className="text-blue-600 hover:underline text-sm"
              >
                হোমপেজে ফিরে যান
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;