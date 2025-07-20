import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, PawPrint } from 'lucide-react';

const BreedCard = ({ breed }: { breed: any }) => (
  <Link to={`/column/${breed.id}`} className="group">
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-2 border-[#e2e8f0] hover:border-[#a78bfa] rounded-3xl" style={{ backgroundColor: '#ffffff' }}>
      <CardHeader className="p-0 relative">
        <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
          <Heart className="h-4 w-4" style={{ color: '#ec4899' }} />
        </div>
        <img 
          src={breed.thumbnail_url || 'https://via.placeholder.com/300'} 
          alt={breed.name_ko}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)' }} />
      </CardHeader>
      <CardContent className="p-4 relative">
        <div className="absolute -top-6 left-4 rounded-full p-2 shadow-lg" style={{ backgroundColor: '#ffffff', borderWidth: '2px', borderColor: '#c4b5fd', borderStyle: 'solid' }}>
          <PawPrint className="h-4 w-4" style={{ color: '#8b5cf6' }} />
        </div>
        <CardTitle className="text-lg font-bold mt-2 transition-colors" style={{ color: '#1f2937' }}>
          <span className="group-hover:text-[#8b5cf6]">{breed.name_ko}</span>
        </CardTitle>
        <p className="text-sm font-medium" style={{ color: '#6b7280' }}>{breed.name_en}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <span className="text-xs px-3 py-1.5 rounded-full font-semibold" 
          style={{ 
            background: 'linear-gradient(to right, #f3e8ff, #e9d5ff)', 
            color: '#6d28d9', 
            borderWidth: '1px', 
            borderColor: '#d8b4fe', 
            borderStyle: 'solid' 
          }}>
          {breed.size_type || '정보 없음'}
        </span>
      </CardFooter>
    </Card>
  </Link>
);

export default BreedCard;