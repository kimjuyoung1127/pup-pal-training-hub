
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';
import { useEffect, useState } from 'react';


const fetchDog = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('dogs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: no rows found
    console.error('Error fetching dog:', error);
    toast.error('강아지 정보를 불러오는 데 실패했습니다.');
    throw error;
  }
  return data;
};

type TableName = 'training_tips' | 'recommended_videos' | 'daily_missions';

const fetchRandom = async <T extends TableName>(tableName: T): Promise<Tables<T> | null> => {
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        toast.error('데이터를 불러오는 데 실패했습니다.');
        throw error;
    }
    if (!data || data.length === 0) return null;
    return data[Math.floor(Math.random() * data.length)] as Tables<T>;
}

async function fetchYoutubeVideos(origin: string) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('YouTube API key is not set.');
    return [];
  }

  let query = 'dog training';
  if (origin === 'korean') {
    query = '강아지 훈련';
  } else if (origin === 'english') {
    query = 'dog training';
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query,
  )}&type=video&maxResults=50&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      // Add mock data for filtering
      return data.items.map((video: any, index: number) => ({
        youtube_video_id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        trainingTopic: index % 3 === 0 ? 'potty_training' : index % 3 === 1 ? 'barking_control' : 'separation_anxiety',
        trainingStyle: index % 2 === 0 ? 'positive' : 'mild_correction',
        origin: index % 3 === 0 ? 'korean' : index % 3 === 1 ? 'english' : 'japanese',
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return [];
  }
}

export const useDashboardData = (originFilter: string) => {
  const { data: dog, isLoading: isDogLoading } = useQuery({
    queryKey: ['dog'],
    queryFn: fetchDog,
  });

  const { data: tip, isLoading: isTipLoading } = useQuery({
    queryKey: ['random-tip'],
    queryFn: () => fetchRandom('training_tips'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const { data: videos, isLoading: areVideosLoading } = useQuery({
    queryKey: ['youtube-videos', originFilter],
    queryFn: () => fetchYoutubeVideos(originFilter),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!originFilter, // originFilter가 있을 때만 쿼리 실행
  });

  const { data: mission, isLoading: isMissionLoading } = useQuery({
    queryKey: ['random-mission'],
    queryFn: () => fetchRandom('daily_missions'),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return {
    dog,
    tip,
    videos,
    mission,
    isLoading: isDogLoading || isTipLoading || areVideosLoading || isMissionLoading,
  };
};
