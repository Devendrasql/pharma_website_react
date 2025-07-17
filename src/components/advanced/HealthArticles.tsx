import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export const HealthArticles: React.FC = () => {
  const articles: Article[] = [
    {
      id: '1',
      title: 'Understanding Diabetes: Prevention and Management',
      excerpt: 'Learn about the different types of diabetes, risk factors, and effective management strategies for a healthier life.',
      author: 'Dr. Priya Sharma',
      date: '2025-01-10',
      image: 'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Diabetes Care'
    },
    {
      id: '2',
      title: 'Heart Health: Essential Tips for a Strong Heart',
      excerpt: 'Discover lifestyle changes and dietary recommendations to maintain cardiovascular health and prevent heart disease.',
      author: 'Dr. Rajesh Kumar',
      date: '2025-01-08',
      image: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Cardiology'
    },
    {
      id: '3',
      title: 'Mental Health Awareness: Breaking the Stigma',
      excerpt: 'Understanding mental health conditions and the importance of seeking professional help when needed.',
      author: 'Dr. Anjali Mehta',
      date: '2025-01-05',
      image: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Mental Health'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Health Articles & Tips</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest health insights from our expert medical team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {article.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(article.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
};