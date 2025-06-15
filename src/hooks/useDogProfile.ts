
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DogInfo } from '@/types/dog';
import { toast } from 'sonner';

export type FullDogInfo = DogInfo & { id: string; image_url: string | null; };

export interface FullDogExtendedProfile {
  id: string;
  dog_id: string;
  living_environment: string | null;
  family_composition: string | null;
  favorite_snacks: string | null;
  sensitive_factors: string | null;
  past_history: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export const useDogProfile = () => {
  const [dogInfo, setDogInfo] = useState<FullDogInfo | null>(null);
  const [extendedProfile, setExtendedProfile] = useState<FullDogExtendedProfile | null>(null);
  const [healthStatusNames, setHealthStatusNames] = useState<string[]>([]);
  const [trainingGoalNames, setTrainingGoalNames] = useState<string[]>([]);
  const [trainingStats, setTrainingStats] = useState({
    consecutiveDays: 0,
    averageSuccessRate: 0,
    badgesCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDogProfile = useCallback(async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setIsLoading(false);
      setDogInfo(null);
      setExtendedProfile(null);
      return;
    }
    
    const { data: dogData, error: dogError } = await supabase
      .from('dogs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (dogError || !dogData) {
      if (dogError && dogError.code !== 'PGRST116') {
          console.error('Error fetching dog data:', dogError);
      }
      setDogInfo(null);
      setExtendedProfile(null);
      setIsLoading(false);
      return;
    }

    const { data: extendedProfileData } = await supabase
        .from('dog_extended_profile')
        .select('*')
        .eq('dog_id', dogData.id)
        .maybeSingle();

    const { data: healthLinks } = await supabase.from('dog_health_status').select('health_status_option_id').eq('dog_id', dogData.id);
    const healthStatusIds = healthLinks?.map(l => l.health_status_option_id) || [];
    const { data: healthStatusData } = healthStatusIds.length > 0 ? await supabase.from('health_status_options').select('name').in('id', healthStatusIds) : { data: [] };
    const fetchedHealthStatusNames = healthStatusData?.map(s => s.name) || [];
      
    const { data: behaviorLinks } = await supabase.from('dog_desired_behaviors').select('behavior_option_id').eq('dog_id', dogData.id);
    const behaviorIds = behaviorLinks?.map(l => l.behavior_option_id) || [];
    const { data: behaviorData } = behaviorIds.length > 0 ? await supabase.from('behavior_options').select('name').in('id', behaviorIds) : { data: [] };
    const fetchedTrainingGoalNames = behaviorData?.map(g => g.name) || [];

    const { data: trainingHistoryData } = await supabase
      .from('training_history')
      .select('session_date, success_rate')
      .eq('dog_id', dogData.id)
      .order('session_date', { ascending: false });

    const { count: badgesCount } = await supabase
      .from('dog_badges')
      .select('*', { count: 'exact', head: true })
      .eq('dog_id', dogData.id);

    if (trainingHistoryData && trainingHistoryData.length > 0) {
      const totalSuccessRate = trainingHistoryData.reduce((acc, record) => acc + (Number(record.success_rate) || 0), 0);
      const averageSuccessRate = Math.round(totalSuccessRate / trainingHistoryData.length);

      const trainingDates = [...new Set(trainingHistoryData.map(h => h.session_date))].map(d => new Date(d)).sort((a,b) => b.getTime() - a.getTime());

      let consecutiveDays = 0;
      if (trainingDates.length > 0) {
          const today = new Date();
          today.setHours(0,0,0,0);
          const firstDate = new Date(trainingDates[0]);
          firstDate.setHours(0,0,0,0);
          
          const diffTime = today.getTime() - firstDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 1) {
              consecutiveDays = 1;
              for (let i = 0; i < trainingDates.length - 1; i++) {
                  const currentDay = new Date(trainingDates[i]);
                  const nextDay = new Date(trainingDates[i+1]);
                  const dayDiff = Math.round((currentDay.getTime() - nextDay.getTime()) / (1000 * 60 * 60 * 24));
                  if (dayDiff === 1) {
                      consecutiveDays++;
                  } else {
                      break;
                  }
              }
          }
      }
      
      setTrainingStats({
          consecutiveDays: consecutiveDays,
          averageSuccessRate: averageSuccessRate,
          badgesCount: badgesCount || 0,
      });
    } else {
      setTrainingStats({
          consecutiveDays: 0,
          averageSuccessRate: 0,
          badgesCount: badgesCount || 0,
      });
    }
    
    const fullDogInfo: FullDogInfo = {
      id: dogData.id,
      name: dogData.name || '',
      age: dogData.age || '',
      gender: dogData.gender || '',
      breed: dogData.breed || '',
      weight: dogData.weight || '',
      healthStatus: healthStatusIds,
      trainingGoals: behaviorIds,
      image_url: dogData.image_url
    };

    setDogInfo(fullDogInfo);
    setHealthStatusNames(fetchedHealthStatusNames);
    setTrainingGoalNames(fetchedTrainingGoalNames);
    setExtendedProfile(extendedProfileData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDogProfile();
  }, [fetchDogProfile]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !dogInfo) {
      return;
    }
    const file = event.target.files[0];
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (dogInfo.image_url) {
      try {
        const oldPath = new URL(dogInfo.image_url).pathname.replace(`/storage/v1/object/public/dog-profiles/`, '');
        await supabase.storage.from('dog-profiles').remove([oldPath]);
      } catch (error) {
        console.warn('Could not delete old image, continuing upload.', error);
      }
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('dog-profiles')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error('이미지 업로드에 실패했습니다.');
      return;
    }

    const { data } = supabase.storage
      .from('dog-profiles')
      .getPublicUrl(filePath);
    
    const publicUrl = data.publicUrl;

    const { error: dbError } = await supabase
      .from('dogs')
      .update({ image_url: publicUrl })
      .eq('id', dogInfo.id);

    if (dbError) {
      console.error('Error updating dog profile:', dbError);
      toast.error('프로필 업데이트에 실패했습니다.');
      return;
    }
    
    setDogInfo({ ...dogInfo, image_url: publicUrl });
    toast.success('프로필 이미지가 업데이트되었습니다.');
  };

  const handleImageDelete = async () => {
    if (!dogInfo || !dogInfo.image_url) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    
    try {
      const oldPath = new URL(dogInfo.image_url).pathname.replace(`/storage/v1/object/public/dog-profiles/`, '');
      const { error: storageError } = await supabase.storage.from('dog-profiles').remove([oldPath]);
      if (storageError) {
        console.error('Error deleting storage image:', storageError);
      }
    } catch (error) {
       console.error('Error parsing image url for deletion', error);
    }
    
    const { error: dbError } = await supabase.from('dogs').update({ image_url: null }).eq('id', dogInfo.id);

    if (dbError) {
      console.error('Error updating dog profile:', dbError);
      toast.error('이미지 삭제 중 오류가 발생했습니다.');
      return;
    }

    setDogInfo({ ...dogInfo, image_url: null });
    toast.success('프로필 이미지가 삭제되었습니다.');
  };

  const handleDeleteDogProfile = async () => {
    if (!dogInfo) return;
    setIsDeleting(true);
    toast.loading('프로필을 삭제하는 중입니다...');

    try {
        const dogId = dogInfo.id;
        await supabase.from('dog_health_status').delete().eq('dog_id', dogId);
        await supabase.from('dog_desired_behaviors').delete().eq('dog_id', dogId);
        await supabase.from('training_history').delete().eq('dog_id', dogId);
        await supabase.from('dog_badges').delete().eq('dog_id', dogId);

        if (dogInfo.image_url) {
            try {
                const oldPath = new URL(dogInfo.image_url).pathname.replace(`/storage/v1/object/public/dog-profiles/`, '');
                await supabase.storage.from('dog-profiles').remove([oldPath]);
            } catch (error) {
                console.warn('Could not delete image, continuing profile deletion.', error);
            }
        }

        const { error: deleteDogError } = await supabase.from('dogs').delete().eq('id', dogId);

        if (deleteDogError) throw deleteDogError;

        toast.dismiss();
        toast.success('강아지 프로필이 삭제되었습니다.');
        setDogInfo(null);
    } catch (error) {
        const err = error as Error
        console.error('Error deleting dog profile:', err);
        toast.dismiss();
        toast.error(`프로필 삭제 중 오류가 발생했습니다: ${err.message}`);
    } finally {
        setIsDeleting(false);
    }
  };

  return {
    dogInfo,
    healthStatusNames,
    trainingGoalNames,
    trainingStats,
    isLoading,
    isDeleting,
    extendedProfile,
    fetchDogProfile,
    handleImageUpload,
    handleImageDelete,
    handleDeleteDogProfile,
  };
};
