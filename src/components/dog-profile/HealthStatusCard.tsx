
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';

interface HealthStatusCardProps {
  healthStatusNames: string[];
}

const HealthStatusCard = ({ healthStatusNames }: HealthStatusCardProps) => {
  return (
    <Card className="bg-sky-50 shadow-md border border-sky-100 health-metrics-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-gray-800 font-pretendard">
          <Heart className="w-5 h-5 text-sky-500" />
          <span className="font-bold">건강 상태</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {healthStatusNames.length > 0 ? (
            healthStatusNames.map((status, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-sky-200 bg-sky-50 text-sky-800 font-semibold px-3 py-1"
              >
                {status}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-gray-500 font-pretendard">등록된 건강 정보가 없습니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatusCard;
