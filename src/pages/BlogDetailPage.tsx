
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBreedDetail } from '@/hooks/useBreedDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Heart, Star, PawPrint, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';

const DetailRow = ({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-white to-pink-50/30 rounded-2xl border border-pink-100 hover:shadow-md transition-all duration-200">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-pink-500">{icon}</span>}
      <span className="font-semibold text-gray-700">{label}</span>
    </div>
    <span className="text-gray-800 font-medium">{value}</span>
  </div>
);

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: breed, isLoading, error } = useBreedDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-pink-500 mx-auto" />
            <Heart className="h-8 w-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-lg text-gray-600 font-medium">귀여운 친구 정보를 불러오고 있어요... 🐕</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex justify-center items-center">
        <div className="text-center py-20 text-red-500 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-200">
          <p className="text-lg font-semibold">앗! 오류가 발생했어요 😢</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!breed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex justify-center items-center">
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200">
          <PawPrint className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-600">해당 견종 정보를 찾을 수 없어요 😢</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* 뒤로가기 버튼 */}
          <Link to="/" className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold mb-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-pink-200 hover:border-pink-300 transition-all duration-200 hover:shadow-md">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로 돌아가기
          </Link>

          {/* 메인 카드 */}
          <Card className="overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-pink-100 rounded-3xl shadow-2xl">
            {/* 이미지 헤더 */}
            <CardHeader className="p-0 relative">
              <div className="relative overflow-hidden">
                <img 
                  src={breed.thumbnail_url || 'https://via.placeholder.com/1200x600'} 
                  alt={breed.name_ko}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Sparkles className="h-6 w-6 text-yellow-300" />
                    <Badge className="bg-white/90 text-pink-600 font-bold px-3 py-1 text-sm">
                      {breed.size_type}
                    </Badge>
                  </div>
                  <CardTitle className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                    {breed.name_ko}
                  </CardTitle>
                  <p className="text-xl text-white/90 font-medium mt-1">{breed.name_en}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* 요약 섹션 */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-800">특징 요약</h2>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border-2 border-pink-100">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {breed.summary || '이 귀여운 친구에 대한 요약 정보가 준비 중이에요! 🐾'}
                  </p>
                </div>
              </div>

              {/* 상세 정보 그리드 */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <PawPrint className="h-6 w-6 text-pink-500" />
                  <h2 className="text-2xl font-bold text-gray-800">상세 정보</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <DetailRow 
                    label="크기" 
                    value={<Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">{breed.size_type}</Badge>} 
                    icon={<PawPrint className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="평균 수명" 
                    value={breed.avg_life_expectancy || 'N/A'} 
                    icon={<Heart className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="평균 체중" 
                    value={breed.avg_weight || 'N/A'} 
                    icon={<Star className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="MBTI" 
                    value={breed.dog_mbti || 'N/A'} 
                    icon={<Sparkles className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="적응력" 
                    value={breed.details?.adaptability || 'N/A'} 
                  />
                  <DetailRow 
                    label="훈련 용이성" 
                    value={breed.details?.trainability || 'N/A'} 
                  />
                  <DetailRow 
                    label="에너지 레벨" 
                    value={breed.details?.energy_level || 'N/A'} 
                  />
                  <DetailRow 
                    label="아이 친화력" 
                    value={breed.details?.friendliness_with_kids || 'N/A'} 
                  />
                  <DetailRow 
                    label="다른 동물 친화력" 
                    value={breed.details?.friendliness_with_pets || 'N/A'} 
                  />
                  <DetailRow 
                    label="털 빠짐" 
                    value={breed.details?.shedding_level || 'N/A'} 
                  />
                </div>
              </div>

              {/* 역사 섹션 */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <h2 className="text-2xl font-bold text-gray-800">역사 이야기</h2>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-purple-100">
                  <p className="text-gray-700 leading-relaxed text-lg mb-4">
                    {breed.history || '이 견종의 흥미로운 역사 이야기가 준비 중이에요! 📚'}
                  </p>
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-pink-200">
                    <p className="text-sm text-gray-600">
                      🎯 더 전문적인 훈련 정보가 필요하신가요? 
                      <Link to="/app" className="text-pink-600 font-bold hover:text-pink-700 hover:underline ml-1">
                        AI 훈련 전문가 Mungai
                      </Link>
                      와 상담해보세요! 🐾
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetailPage;
