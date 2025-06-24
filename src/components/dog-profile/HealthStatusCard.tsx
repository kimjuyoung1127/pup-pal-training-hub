
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface HealthStatusCardProps {
  healthStatusNames: string[];
}

const HealthStatusCard = ({ healthStatusNames }: HealthStatusCardProps) => {
  return (
    <Card className="card-soft bg-pink-50 shadow-md"> {/* 배경 및 섀도우 변경 */}
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-pink-700 font-pretendard"> {/* 타이틀 색상 변경 */}
          <Heart className="w-5 h-5 text-pink-500" /> {/* 아이콘 색상 변경 */}
          <span>건강 상태</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {healthStatusNames.length > 0 ? (
            healthStatusNames.map((status, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-pink-100 border-pink-200 text-pink-700 shadow-sm" /* 뱃지 스타일 변경 */
              >
                {status}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground font-pretendard">등록된 건강 정보가 없습니다.</p> {/* 텍스트 색상 변경 */}
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatusCard;
