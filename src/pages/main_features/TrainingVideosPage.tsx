import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTrainingVideos } from '@/hooks/useTrainingVideos';
import { PawPrint, Sparkles, Film, RefreshCw } from 'lucide-react';
import '@/App.css';

const PawPrintLoading = () => (
  <div className="paw-loader">
    <span>🐾</span><span>🐾</span><span>🐾</span><span>🐾</span>
  </div>
);

interface Video {
  youtube_video_id: string;
  title: string;
  description: string;
  origin: 'korean' | 'english' | 'japanese' | 'all';
}

const TrainingVideosPage: React.FC = () => {
  const [originFilter, setOriginFilter] = useState('all');
  const { videos, isLoading, refetch } = useTrainingVideos(originFilter);
  
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (videos) {
      setAllVideos(videos);
      const shuffled = [...videos].sort(() => 0.5 - Math.random());
      setDisplayedVideos(shuffled.slice(0, 5));
      setIsGenerating(false);
    }
  }, [videos]);

  const handleGenerateVideos = () => {
    if (allVideos.length > 0) {
      setIsGenerating(true);
      setTimeout(() => {
        const shuffled = [...allVideos].sort(() => 0.5 - Math.random());
        setDisplayedVideos(shuffled.slice(0, 5));
        setIsGenerating(false);
      }, 700);
    } else {
      setIsGenerating(true);
      refetch();
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Film className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                AI 추천 훈련 영상
              </span>
            </h1>
            <Sparkles className="h-8 w-8 text-indigo-500 ml-3" />
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 font-light leading-relaxed">
            원하는 언어를 선택하고, AI가 엄선한 전문가들의 훈련 영상을 만나보세요.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white/80 backdrop-blur-md border-2 border-blue-200 rounded-3xl shadow-2xl p-8 w-full max-w-2xl mx-auto transform transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-center mb-8">
                <PawPrint className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-4">언어 선택</h3>
                <div className="max-w-xs mx-auto mb-6">
                  <Select value={originFilter} onValueChange={setOriginFilter}>
                    <SelectTrigger className="bg-white text-gray-800 border-blue-300">
                      <SelectValue placeholder="국가/언어" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-800">
                      <SelectItem value="all">모든 국가</SelectItem>
                      <SelectItem value="korean">한국어</SelectItem>
                      <SelectItem value="english">영어</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={() => {
                    setIsGenerating(true);
                    refetch();
                  }} 
                  disabled={isLoading || isGenerating}
                  className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {isLoading || isGenerating ? (
                    <>
                      <PawPrintLoading />
                      <span className="ml-2">AI 분석 중...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      추천 영상 생성
                    </>
                  )}
                </Button>
              </div>

              {displayedVideos.length > 0 && (
                <motion.div 
                  className="mt-10 pt-8 border-t-2 border-blue-100"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">추천 영상 목록</h2>
                  <div className="grid gap-6">
                    {displayedVideos.map((video) => (
                      <motion.div variants={itemVariants} key={video.youtube_video_id}>
                        <Card className="card-soft overflow-hidden bg-white/90 backdrop-blur-md border-2 border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <div className="w-full aspect-video overflow-hidden relative">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              style={{ width: '100%' }}
                              src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <CardContent className="p-3">
                            <h3 className="font-bold text-gray-900 mb-1 text-sm truncate">{video.title}</h3>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center mt-8">
                    <Button 
                      onClick={handleGenerateVideos} 
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      다시 추천받기
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TrainingVideosPage;
