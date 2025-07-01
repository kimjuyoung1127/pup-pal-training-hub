
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DogBadge } from '@/hooks/useDogBadges';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge as UiBadge } from "@/components/ui/badge";
import { Award } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface DogBadgesProps {
  badges: DogBadge[];
  isLoading: boolean;
}

const DogBadges = ({ badges, isLoading }: DogBadgesProps) => {
  const { toast } = useToast();

  if (isLoading) {
    return <Card className="mb-6 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="mr-2 h-6 w-6 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="w-12 h-12 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>)}
          </div>
        </CardContent>
      </Card>;
  }
  if (!badges || badges.length === 0) {
    return null;
  }
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5,
    delay: 0.2
  }}>
      <Card className="mb-6">
        <CardHeader className="bg-white">
          <CardTitle className="flex items-center text-xl font-bold text-black">
            <Award className="mr-2 h-6 w-6 text-yellow-500" />
            도전과제
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-4">
          <TooltipProvider delayDuration={100}>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
              {badges.map((badge, index) => <Tooltip key={badge.id}>
                  <TooltipTrigger asChild>
                    <motion.div 
                      className="flex flex-col items-center space-y-2 cursor-pointer text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      onClick={() => {
                        toast({
                          title: badge.name,
                          description: badge.description,
                        });
                      }}
                    >
                      <span className={`text-4xl filter transition-all duration-300 ${badge.achieved ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`}>
                        {badge.icon || '🏅'}
                      </span>
                      <UiBadge variant="secondary" className="text-xs px-2 py-0.5 whitespace-nowrap bg-slate-50 text-black">{badge.name}</UiBadge>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white rounded-md p-2">
                    <p className="font-bold">{badge.name}</p>
                    {badge.description && <p className="text-sm">{badge.description}</p>}
                    {!badge.achieved && <p className="text-xs text-yellow-400 mt-1">아직 획득하지 못했어요!</p>}
                  </TooltipContent>
                </Tooltip>)}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </motion.div>;
};

export default DogBadges;
