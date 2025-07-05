import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DogInfo } from '@/types/dog';
import { toast } from 'sonner';
import { ChangeEvent } from 'react';
import { Database } from '@/types/supabase';
import { PostgrestResponse, PostgrestSingleResponse } from '@supabase/supabase-js';

export type FullDogInfo = DogInfo & { id: string; image_url: string | null; };

export interface FullDogExtendedProfile {
  id: string;
  dog_id: string;
  living_environment: string | null;
  family_composition: string | null;
  favorite_snacks: string | null;
  sensitive_factors: string | null;
  past_history: string | null;
  known_behaviors: string[] | null;
  leash_type: string | null;
  toilet_type: string | null;
  social_level: string | null;
  meal_habit: string | null;
  favorites: string[] | null;
  owner_proximity: string | null;
  activity_level: string | null;
  past_experience: string | null;
  sensitive_items: string[] | null;
  family_kids: boolean | null;
  family_elderly: boolean | null;
  preferred_play: string[] | null;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

const fetchDogProfileData = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. 기본 강아지 정보 조회
  const { data: dogData, error: dogError } = await supabase
    .from('dogs')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // 강아지 정보가 없거나 오류 발생 시 중단
  if (dogError || !dogData) {
    if (dogError && dogError.code !== 'PGRST116') { // PGRST116: 'No rows found'는 여기선 정상일 수 있음
      console.error('Error fetching dog data:', dogError);
    }
    return null;
  }

  // 2. 병렬로 가져올 데이터들의 타입 정의
  type ExtendedProfile = Database['public']['Tables']['dog_extended_profile']['Row'];
  // NOTE: UserProfile 타입은 Supabase 스키마의 enum 타입과 쿼리 추론 타입(string) 간의 충돌을 피하기 위해 수동으로 정의합니다.
  type UserProfile = { plan: string | null; plan_expiry_date: string | null };
  type HealthLink = Database['public']['Tables']['dog_health_status']['Row'];
  type BehaviorLink = Database['public']['Tables']['dog_desired_behaviors']['Row'] & { behavior_options: { name: string } | null };
  type TrainingHistory = Database['public']['Tables']['training_history']['Row'];

  // 3. 관련 데이터들을 Promise.all로 병렬 조회
  // NOTE: 반환값의 튜플 타입을 명시적으로 지정하여 TypeScript의 과도한 타입 추론 오류를 방지합니다.
  const [extendedProfileRes, profileRes, healthLinksRes, behaviorLinksRes, trainingHistoryRes, badgesRes]: [
    PostgrestSingleResponse<ExtendedProfile>,
    PostgrestSingleResponse<UserProfile>,
    PostgrestResponse<HealthLink>,
    PostgrestResponse<BehaviorLink>,
    PostgrestResponse<TrainingHistory>,
    PostgrestResponse<any> // badgesRes는 count만 사용하므로 any로 유지
  ] = await Promise.all([
    supabase.from('dog_extended_profile').select('*').eq('dog_id', dogData.id).maybeSingle(),
    supabase.from('user_profiles').select('plan, plan_expiry_date').eq('id', user.id).maybeSingle(),
    supabase.from('dog_health_status').select('health_status_option_id').eq('dog_id', dogData.id),
    supabase.from('dog_desired_behaviors').select('behavior_option_id, behavior_options(name)').eq('dog_id', dogData.id),
    supabase.from('training_history').select('session_date, success_rate').eq('dog_id', dogData.id).order('session_date', { ascending: false }),
    supabase.from('dog_badges').select('*', { count: 'exact', head: true }).eq('dog_id', dogData.id)
  ]);

  // 4. 각 API 응답의 오류를 개별적으로 확인하고 로깅
  if (extendedProfileRes.error) console.error('Error fetching extended profile:', extendedProfileRes.error);
  if (profileRes.error) console.error('Error fetching user profile:', profileRes.error);
  if (healthLinksRes.error) console.error('Error fetching health links:', healthLinksRes.error);
  if (behaviorLinksRes.error) console.error('Error fetching behavior links:', behaviorLinksRes.error);
  if (trainingHistoryRes.error) console.error('Error fetching training history:', trainingHistoryRes.error);
  if (badgesRes.error) console.error('Error fetching badges count:', badgesRes.error);

  // 5. 데이터 추출 및 가공
  const extendedProfileData = extendedProfileRes.data;
  const profileData = profileRes.data;
  const healthLinks = healthLinksRes.data || [];
  const behaviorLinks = behaviorLinksRes.data || [];
  const trainingHistoryData = trainingHistoryRes.data || [];
  const badgesCount = badgesRes.count || 0;

  const healthStatusIds = healthLinks.map(l => l.health_status_option_id);
  const { data: healthStatusData } = healthStatusIds.length > 0 ? await supabase.from('health_status_options').select('name').in('id', healthStatusIds) : { data: [] };
  const fetchedHealthStatusNames = healthStatusData?.map(s => s.name) || [];

  const behaviorIds = behaviorLinks.map(l => l.behavior_option_id);
  const fetchedTrainingGoalNames = behaviorLinks.map(l => l.behavior_options?.name).filter(Boolean) as string[];

  // 연속 훈련일 계산
  let consecutiveDays = 0;
  if (trainingHistoryData.length > 0) {
    const trainingDates = [...new Set(trainingHistoryData.map(h => h.session_date))].map(d => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    if (trainingDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const firstDate = new Date(trainingDates[0]);
      firstDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - firstDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        consecutiveDays = 1;
        for (let i = 0; i < trainingDates.length - 1; i++) {
          const dayDiff = Math.round((trainingDates[i].getTime() - trainingDates[i + 1].getTime()) / (1000 * 60 * 60 * 24));
          if (dayDiff === 1) consecutiveDays++;
          else break;
        }
      }
    }
  }

  const trainingStats = { consecutiveDays, badgesCount };

  const fullDogInfo: FullDogInfo = {
    id: dogData.id,
    name: dogData.name || '',
    age: typeof dogData.age === 'object' ? dogData.age : { years: 0, months: 0 },
    gender: dogData.gender || '',
    breed: dogData.breed || '',
    weight: dogData.weight ? Number(dogData.weight) : null,
    healthStatus: healthStatusIds,
    trainingGoals: behaviorIds,
    image_url: dogData.image_url
  };

  // 6. 최종 데이터 객체 반환
  return {
    dogInfo: fullDogInfo,
    healthStatusNames: fetchedHealthStatusNames,
    trainingGoalNames: fetchedTrainingGoalNames,
    trainingStats,
    extendedProfile: extendedProfileData || null,
    plan: profileData?.plan || 'free',
    plan_expiry_date: profileData?.plan_expiry_date || null,
  };
};

interface UseDogProfileReturn {
  dogInfo: FullDogInfo | undefined | null;
  healthStatusNames: string[] | undefined;
  trainingGoalNames: string[] | undefined;
  trainingStats: { consecutiveDays: number; badgesCount: number; } | undefined | null;
  isLoading: boolean;
  isDeleting: boolean;
  extendedProfile: FullDogExtendedProfile | null | undefined;
  fetchDogProfile: UseQueryResult<Awaited<ReturnType<typeof fetchDogProfileData>>, Error>['refetch'];
  handleImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  handleImageDelete: () => void;
  handleDeleteDogProfile: () => void;
  plan: string | undefined;
  plan_expiry_date: string | null | undefined;
}

export const useDogProfile = (): UseDogProfileReturn => {
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dogProfile'],
    queryFn: fetchDogProfileData,
    staleTime: 0, // 데이터를 항상 최신으로 유지
  });

  const { dogInfo, healthStatusNames, trainingGoalNames, trainingStats, extendedProfile, plan, plan_expiry_date } = data || {};

  const { mutate: uploadImage } = useMutation({
    mutationFn: async (file: File) => {
      if (!dogInfo) throw new Error("강아지 정보가 없습니다.");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다.');

      // 기존 이미지가 있으면 삭제
      if (dogInfo.image_url) {
        const oldPath = new URL(dogInfo.image_url).pathname.split('/').pop();
        if(oldPath) await supabase.storage.from('dog-profiles').remove([`${user.id}/${oldPath}`]);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('dog-profiles').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('dog-profiles').getPublicUrl(filePath);

      await supabase.from('dogs').update({ image_url: urlData.publicUrl }).eq('id', dogInfo.id);
      return urlData.publicUrl;
    },
    onSuccess: () => {
      toast.success('프로필 이미지가 성공적으로 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
    },
    onError: (error) => {
      toast.error(`이미지 업로드 실패: ${error.message}`);
    },
  });

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const { mutate: deleteImage } = useMutation({
    mutationFn: async () => {
      if (!dogInfo || !dogInfo.image_url) throw new Error("삭제할 이미지가 없습니다.");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('로그인이 필요합니다.');

      const path = new URL(dogInfo.image_url).pathname.split('/public/dog-profiles/').pop();
      if (!path) throw new Error('유효하지 않은 이미지 경로입니다.');

      const { error: deleteError } = await supabase.storage.from('dog-profiles').remove([path]);
      if (deleteError) throw deleteError;

      await supabase.from('dogs').update({ image_url: null }).eq('id', dogInfo.id);
    },
    onSuccess: () => {
      toast.success('프로필 이미지가 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
    },
    onError: (error) => {
      toast.error(`이미지 삭제 실패: ${error.message}`);
    },
  });

  const handleImageDelete = () => {
    deleteImage();
  };

  const { mutate: deleteDogProfile, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!dogInfo) throw new Error("삭제할 강아지 프로필이 없습니다.");
      const { error } = await supabase.from('dogs').delete().eq('id', dogInfo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('강아지 프로필이 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['dogProfile'] });
      // 필요하다면 다른 관련 쿼리도 무효화하거나 사용자를 다른 페이지로 리디렉션할 수 있습니다.
    },
    onError: (error) => {
      toast.error(`프로필 삭제 실패: ${error.message}`);
    },
  });

  const handleDeleteDogProfile = () => {
    deleteDogProfile();
  };

  return {
    dogInfo,
    healthStatusNames,
    trainingGoalNames,
    trainingStats,
    isLoading,
    isDeleting,
    extendedProfile,
    fetchDogProfile: refetch,
    handleImageUpload,
    handleImageDelete,
    handleDeleteDogProfile,
    plan,
    plan_expiry_date,
  };
};
