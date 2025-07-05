import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FullDogExtendedProfile } from '@/hooks/useDogProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { Mission, MissionCategory } from '../../lib/missionData';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Input } from '../ui/input';
import { Pencil } from 'lucide-react'; // Pencil 아이콘 추가

interface ProfileCategoryFormProps {
    category: MissionCategory;
    dogId: string;
    extendedProfile: FullDogExtendedProfile | null;
    onUpdate: () => void;
}

const createFormSchema = (missions: Mission[]) => {
    const shape: { [key: string]: any } = {};
    missions.forEach(mission => {
        shape[mission.key] = z.any();
    });
    return z.object(shape);
};

const ProfileCategoryForm = ({ category, dogId, extendedProfile, onUpdate }: ProfileCategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const formSchema = createFormSchema(category.missions);
    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: category.missions.reduce((acc, mission) => {
            const value = extendedProfile?.[mission.key];
            if (mission.type === 'boolean') {
                acc[mission.key] = value === true ? '예' : value === false ? '아니오' : '';
            } else if (Array.isArray(value)) {
                acc[mission.key] = value.join(', ');
            } else {
                acc[mission.key] = value || '';
            }
            return acc;
        }, {} as { [key: string]: any }),
    });

    const updateProfileMutation = useMutation({
        mutationFn: async (updates: Partial<FullDogExtendedProfile>) => {
            const { data: existing } = await supabase.from('dog_extended_profile').select('id').eq('dog_id', dogId).maybeSingle();
            if (existing) {
                return supabase.from('dog_extended_profile').update(updates).eq('dog_id', dogId).select().single();
            } else {
                return supabase.from('dog_extended_profile').insert({ ...updates, dog_id: dogId }).select().single();
            }
        },
        onSuccess: () => {
            toast.success(`🎉 '${category.title}' 정보가 업데이트되었어요.`);
            onUpdate();
            setIsEditing(false); // 저장 후 편집 모드 종료
        },
        onError: (error: any) => toast.error('정보 업데이트 실패', { description: error.message }),
    });

    const onSubmit = (values: FormValues) => {
        console.log("Raw form values:", values);
        const processedValues: Partial<FullDogExtendedProfile> = {};
        Object.keys(values).forEach(key => {
            const mission = category.missions.find(m => m.key === key);
            let value = values[key];
            if (mission?.type === 'array') {
                processedValues[key] = value.split(',').map((s: string) => s.trim()).filter(Boolean);
            } else if (mission?.type === 'boolean') {
                processedValues[key] = value === '예';
            } else {
                processedValues[key] = value;
            }
        });
        console.log("Processed values to be sent:", processedValues);
        updateProfileMutation.mutate(processedValues);
    };

    const completionCount = category.missions.filter(m => {
        const value = extendedProfile?.[m.key];
        if (Array.isArray(value)) {
            return value.length > 0;
        }
        return value !== null && value !== undefined && value !== '';
    }).length;
    const completionPercent = extendedProfile ? Math.round((completionCount / category.missions.length) * 100) : 0;

    return (
        <AccordionItem value={category.key}>
            <div className="flex items-center w-full pr-2">
                <AccordionTrigger className="flex-1">
                    <div className="flex justify-between items-center w-full">
                        <span className="text-sky-800 font-semibold">{category.icon} {category.title}</span>
                        <span className="text-sm text-sky-800 font-semibold mr-2">완성도 {completionPercent}%</span>
                    </div>
                </AccordionTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 h-auto w-auto rounded-md hover:bg-gray-200 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(!isEditing);
                    }}
                >
                    <Pencil className="h-4 w-4 text-gray-600" />
                </Button>
            </div>
            <AccordionContent>
                {isEditing ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2">
                            {category.missions.map(mission => (
                                <FormField
                                    key={mission.key}
                                    control={form.control}
                                    name={mission.key as keyof FormValues & string}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-800">{mission.question}</FormLabel>
                                            <FormControl>
                                                {mission.type === 'boolean' ? (
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-2">
                                                        {['예', '아니오'].map(option => (
                                                            <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                                                <FormControl><RadioGroupItem value={option} className="bg-white border-gray-400 text-gray-900" /></FormControl>
                                                                <FormLabel className="font-normal text-gray-800">{option}</FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                ) : mission.options ? (
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {mission.options.map(option => (
                                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                              <FormControl>
                                                                <RadioGroupItem value={option} className="bg-white border-gray-400 text-gray-900" />
                                                              </FormControl>
                                                              <FormLabel className="font-normal text-gray-800">{option}</FormLabel>
                                                            </FormItem>
                                                          ))}
                                                    </RadioGroup>
                                                ) : mission.key === 'walk_satisfaction' ? (
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {['매우 만족', '만족', '보통', '불만족', '매우 불만족'].map(option => (
                                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                                <FormControl><RadioGroupItem value={option} className="bg-white border-gray-400 text-gray-900" /></FormControl>
                                                                <FormLabel className="font-normal text-gray-800">{option}</FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                ) : mission.key === 'defecation_status' ? (
                                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2">
                                                        {['정상', '설사', '변비'].map(option => (
                                                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                                                                <FormControl><RadioGroupItem value={option} className="bg-white border-gray-400 text-gray-900" /></FormControl>
                                                                <FormLabel className="font-normal text-gray-800">{option}</FormLabel>
                                                            </FormItem>
                                                        ))}
                                                    </RadioGroup>
                                                ) : (
                                                    <Textarea placeholder={mission.placeholder} {...field} className="bg-white text-gray-900 border-gray-300" />
                                                )}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                            <Button type="submit" disabled={updateProfileMutation.isPending}>
                                {updateProfileMutation.isPending ? '저장 중...' : '저장하기'}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <div className="p-2 space-y-2">
                        {category.missions.map(mission => {
                            const value = extendedProfile?.[mission.key];
                            const displayValue = Array.isArray(value) ? value.join(', ') : (value === true ? '예' : value === false ? '아니오' : value?.toString());
                            return (
                                <div key={mission.key} className="text-sm">
                                    <p className="font-semibold text-gray-700">{mission.question}</p>
                                    <p className="text-gray-600">{displayValue || '아직 기록이 없어요.'}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

export default ProfileCategoryForm;