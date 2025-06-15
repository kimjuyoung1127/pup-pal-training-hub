
import { supabase } from '@/integrations/supabase/client';
import { DogInfo } from '@/types/dog';
import { toast } from "sonner";

export const saveDogInfo = async (dogInfo: DogInfo) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      console.error("User not logged in. Cannot save dog info.");
      throw new Error("User not logged in");
    }

    const { data: existingDog, error: fetchError } = await supabase
      .from('dogs')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: no rows found
        console.error('Error checking for existing dog:', fetchError);
        toast.error("기존 강아지 정보 확인에 실패했습니다.");
        throw fetchError;
    }

    if (existingDog) {
        // Update existing dog
        const dogId = existingDog.id;
        const { error: dogError } = await supabase
            .from('dogs')
            .update({
                name: dogInfo.name,
                age: dogInfo.age,
                gender: dogInfo.gender,
                breed: dogInfo.breed,
                weight: dogInfo.weight,
                user_id: user.id
            })
            .eq('id', dogId);

        if (dogError) {
            console.error('Error updating dog info:', dogError);
            toast.error("강아지 정보 수정에 실패했습니다.");
            throw dogError;
        }
        
        // Delete old relations
        await supabase.from('dog_health_status').delete().eq('dog_id', dogId);
        await supabase.from('dog_desired_behaviors').delete().eq('dog_id', dogId);
        
        const healthStatusInserts = dogInfo.healthStatus.map(optionId => ({
          dog_id: dogId,
          health_status_option_id: optionId
        }));
        
        if (healthStatusInserts.length > 0) {
          const { error: healthStatusError } = await supabase.from('dog_health_status').insert(healthStatusInserts);
          if (healthStatusError) {
            console.error('Error saving health status:', healthStatusError);
            toast.error("건강 상태 정보 저장에 일부 문제가 발생했습니다.");
          }
        }
    
        const trainingGoalsInserts = dogInfo.trainingGoals.map(optionId => ({
          dog_id: dogId,
          behavior_option_id: optionId
        }));
    
        if (trainingGoalsInserts.length > 0) {
          const { error: trainingGoalsError } = await supabase.from('dog_desired_behaviors').insert(trainingGoalsInserts);
          if (trainingGoalsError) {
            console.error('Error saving training goals:', trainingGoalsError);
            toast.error("훈련 목표 정보 저장에 일부 문제가 발생했습니다.");
          }
        }
        
        toast.success("강아지 정보가 성공적으로 수정되었습니다!");
        return dogInfo;

    } else {
        // Insert new dog (original logic)
        const { data: dogData, error: dogError } = await supabase
          .from('dogs')
          .insert({
            name: dogInfo.name,
            age: dogInfo.age,
            gender: dogInfo.gender,
            breed: dogInfo.breed,
            weight: dogInfo.weight,
            user_id: user.id
          })
          .select('id')
          .single();

        if (dogError || !dogData) {
          console.error('Error saving dog info:', dogError);
          toast.error("강아지 정보 저장에 실패했습니다.");
          throw dogError || new Error("Failed to save dog info");
        }

        const dogId = dogData.id;

        const healthStatusInserts = dogInfo.healthStatus.map(optionId => ({
          dog_id: dogId,
          health_status_option_id: optionId
        }));
        
        if (healthStatusInserts.length > 0) {
          const { error: healthStatusError } = await supabase.from('dog_health_status').insert(healthStatusInserts);
          if (healthStatusError) {
            console.error('Error saving health status:', healthStatusError);
            toast.error("건강 상태 정보 저장에 일부 문제가 발생했습니다.");
          }
        }

        const trainingGoalsInserts = dogInfo.trainingGoals.map(optionId => ({
          dog_id: dogId,
          behavior_option_id: optionId
        }));

        if (trainingGoalsInserts.length > 0) {
          const { error: trainingGoalsError } = await supabase.from('dog_desired_behaviors').insert(trainingGoalsInserts);
          if (trainingGoalsError) {
            console.error('Error saving training goals:', trainingGoalsError);
            toast.error("훈련 목표 정보 저장에 일부 문제가 발생했습니다.");
          }
        }
        
        toast.success("강아지 정보가 성공적으로 저장되었습니다!");
        return dogInfo;
    }
};
