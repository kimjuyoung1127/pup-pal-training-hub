import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

async function fetchYoutubeVideos(origin: string) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error('YouTube API key is not set.');
    toast.error('YouTube API 키가 설정되지 않았습니다.');
    return [];
  }

  let query = 'dog training';
  if (origin === 'korean') {
    query = '강아지 훈련';
  } else if (origin === 'english') {
    query = 'dog training for beginners';
  } else {
    query = '강아지 훈련 OR dog training';
  }

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
    query,
  )}&type=video&maxResults=50&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items.map((video: any) => ({
        youtube_video_id: video.id.videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        origin: origin, // Assign the queried origin
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    toast.error('유튜브 영상을 불러오는 데 실패했습니다.');
    return [];
  }
}

export const useTrainingVideos = (originFilter: string) => {
  const { data: videos, isLoading, refetch } = useQuery({
    queryKey: ['youtube-videos-by-origin', originFilter],
    queryFn: () => fetchYoutubeVideos(originFilter),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: false, // 버튼 클릭 시 수동으로 refetch 하도록 설정
  });

  return { videos, isLoading, refetch };
};
