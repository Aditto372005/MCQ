import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResponses, signOutAdmin, supabase } from '../services/supabaseClient';
import Header from '../components/Header';
import { Download, Search, LogOut, Filter, RefreshCcw } from 'lucide-react';

interface Response {
  id: number;
  created_at: string;
  fullName: string;
  schoolName: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

const Admin: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Response>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Get responses
  useEffect(() => {
    const fetchResponses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await getResponses();
        
        if (error) {
          throw new Error(error.message);
        }
        
        setResponses(data || []);
      } catch (err) {
        setError('ডেটা লোড করতে সমস্যা হয়েছে।');
        console.error('Error fetching responses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResponses();
  }, []);

  const handleLogout = async () => {
    await signOutAdmin();
    navigate('/login');
  };

  const handleDownloadCsv = () => {
    const filteredData = responses.filter(r => 
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Create CSV content
    const headers = ['Name', 'School', 'Score', 'Total Questions', 'Time Spent (seconds)', 'Date'];
    const csvRows = [
      headers.join(','),
      ...filteredData.map(r => {
        const date = new Date(r.created_at).toLocaleDateString();
        return [
          `"${r.fullName}"`,
          `"${r.schoolName}"`,
          r.score,
          r.totalQuestions,
          r.timeSpent,
          date
        ].join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `exam-responses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getResponses();
      
      if (error) {
        throw new Error(error.message);
      }
      
      setResponses(data || []);
    } catch (err) {
      setError('ডেটা লোড করতে সমস্যা হয়েছে।');
      console.error('Error fetching responses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSort = (field: keyof Response) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort responses
  const filteredResponses = responses
    .filter(response => 
      response.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      response.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortField === 'created_at') {
        return sortDirection === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="অ্যাডমিন ড্যাশবোর্ড" isAdmin={true} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-xl font-semibold text-gray-800">
              পরীক্ষার রেসপন্সগুলি
            </h2>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                title="রিফ্রেশ"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleDownloadCsv}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV ডাউনলোড
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                লগআউট
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[280px]">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="নাম বা স্কুল দিয়ে অনুসন্ধান করুন"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">
                  <Filter className="h-5 w-5" />
                </span>
                <select
                  value={`${sortField}-${sortDirection}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortField(field as keyof Response);
                    setSortDirection(direction as 'asc' | 'desc');
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="created_at-desc">সময় - নতুন থেকে পুরাতন</option>
                  <option value="created_at-asc">সময় - পুরাতন থেকে নতুন</option>
                  <option value="score-desc">স্কোর - উচ্চ থেকে নিম্ন</option>
                  <option value="score-asc">স্কোর - নিম্ন থেকে উচ্চ</option>
                  <option value="fullName-asc">নাম - A থেকে Z</option>
                  <option value="fullName-desc">নাম - Z থেকে A</option>
                  <option value="schoolName-asc">স্কুল - A থেকে Z</option>
                  <option value="schoolName-desc">স্কুল - Z থেকে A</option>
                </select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">লোড হচ্ছে...</p>
              </div>
            ) : filteredResponses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        onClick={() => toggleSort('fullName')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          নাম
                          {sortField === 'fullName' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleSort('schoolName')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          স্কুল
                          {sortField === 'schoolName' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleSort('score')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          স্কোর
                          {sortField === 'score' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleSort('timeSpent')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          সময় ব্যয়
                          {sortField === 'timeSpent' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                      <th 
                        onClick={() => toggleSort('created_at')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex items-center">
                          তারিখ
                          {sortField === 'created_at' && (
                            <span className="ml-1">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResponses.map((response) => (
                      <tr key={response.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {response.fullName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {response.schoolName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            (response.score / response.totalQuestions) >= 0.6 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {response.score} / {response.totalQuestions} 
                            ({Math.round((response.score / response.totalQuestions) * 100)}%)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatTime(response.timeSpent)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(response.created_at).toLocaleString('bn-BD', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">কোন রেসপন্স পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;