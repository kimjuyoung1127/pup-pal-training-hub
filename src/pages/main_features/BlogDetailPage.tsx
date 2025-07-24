
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBreedDetail } from '@/hooks/useBreedDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PawPrint, Heart, Star, Sparkles, Loader2 } from 'lucide-react';
import Footer from '@/components/Footer';
import { renderStarRating, formatRange, getRatingLabel } from '@/utils/dataFormatter';

// DetailRow 컴포넌트 정의
interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100">
    <div className="flex items-center space-x-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      <span className="font-medium text-gray-700">{label}</span>
    </div>
    <div className="text-gray-900 font-semibold">{value}</div>
  </div>
);

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: breed, isLoading, error } = useBreedDetail(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">견종 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center py-20 text-red-500 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-red-200">
          <p className="text-lg font-semibold">앗! 오류가 발생했어요 😢</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!breed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center py-20 text-gray-500 bg-white/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-gray-200">
          <p className="text-lg font-semibold">견종을 찾을 수 없어요 🐕</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          {/* 뒤로가기 버튼 */}
          <Button 
            onClick={() => navigate(-1)}
            variant="ghost" 
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            뒤로가기
          </Button>

          {/* 메인 카드 */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            {/* 이미지 헤더 */}
            <CardHeader className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img 
                  src={breed.thumbnail_url || '/placeholder.svg'} 
                  alt={breed.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{breed.name}</h1>
                  <p className="text-lg opacity-90">{breed.english_name}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* 요약 섹션 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">견종 소개</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {breed.description || '이 견종에 대한 상세한 정보를 준비 중입니다.'}
                </p>
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
                    value={formatRange(breed.avg_life_expectancy, '년')} 
                    icon={<Heart className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="평균 체중" 
                    value={formatRange(breed.avg_weight, 'kg')} 
                    icon={<Star className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="MBTI" 
                    value={breed.dog_mbti || 'N/A'} 
                    icon={<Sparkles className="h-4 w-4" />}
                  />
                  <DetailRow 
                    label="적응력" 
                    value={renderStarRating(breed.details?.adaptability)} 
                  />
                  <DetailRow 
                    label="훈련 용이성" 
                    value={renderStarRating(breed.details?.trainability)} 
                  />
                  <DetailRow 
                    label="에너지 레벨" 
                    value={renderStarRating(breed.details?.energy_level)} 
                  />
                  <DetailRow 
                    label="아이 친화력" 
                    value={renderStarRating(breed.details?.friendliness_with_kids)} 
                  />
                  <DetailRow 
                    label="다른 동물 친화력" 
                    value={renderStarRating(breed.details?.friendliness_with_pets)} 
                  />
                  <DetailRow 
                    label="털 빠짐" 
                    value={renderStarRating(breed.details?.shedding_level)} 
                  />
                </div>
              </div>

              {/* 역사 섹션 */}
              {breed.history && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">역사</h2>
                  <p className="text-gray-600 leading-relaxed">{breed.history}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetailPage;
