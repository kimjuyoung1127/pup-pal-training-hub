import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { woofpediaClient } from '@/lib/woofpediaClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// Breed 타입 정의
interface Breed {
  id: string;
  name_ko: string;
  name_en: string;
  thumbnail_url: string;
  summary: string;
}

const BlogPage = () => {
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      const { data, error } = await woofpediaClient
        .from('breeds')
        .select('id, name_ko, name_en, thumbnail_url, summary')
        .order('name_ko', { ascending: true });

      if (error) {
        console.error('Error fetching breeds:', error);
      } else {
        setBreeds(data as Breed[]);
      }
      setLoading(false);
    };

    fetchBreeds();
  }, []);

  const filteredBreeds = breeds.filter(breed =>
    breed.name_ko.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.name_en.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">견종 목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          견종 백과
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          다양한 견종의 특징과 정보를 확인해보세요.
        </p>
      </header>

      <div className="mb-8 max-w-md mx-auto">
        <Input
          type="text"
          placeholder="견종 이름으로 검색 (한글 또는 영문)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBreeds.map((breed) => (
          <Link to={`/blog/${breed.id}`} key={breed.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-0">
                <img
                  src={breed.thumbnail_url || '/placeholder.svg'}
                  alt={breed.name_ko}
                  width="400"
                  height="400"
                  className="object-cover w-full h-48"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-xl font-semibold">{breed.name_ko}</CardTitle>
                <p className="text-sm text-muted-foreground">{breed.name_en}</p>
                <p className="mt-2 text-sm line-clamp-3">{breed.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
