
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface HealthStatusCardProps {
  healthStatusNames: string[];
}

const HealthStatusCard = ({ healthStatusNames }: HealthStatusCardProps) => {
  return (
    <Card className="card-soft bg-green-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-cream-800 font-pretendard">
          <Heart className="w-5 h-5 text-green-500" />
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
                className="bg-green-50 border-green-200 text-green-700"
              >
                {status}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-cream-600 font-pretendard">등록된 건강 정보가 없습니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatusCard;
