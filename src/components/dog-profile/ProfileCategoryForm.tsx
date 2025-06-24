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
import { Input } from '../ui/input'; // Input 컴포넌트 추가

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

    const [otherCaretaker, setOtherCaretaker] = useState(
        form.getValues().main_caretaker !== '본인' ? form.getValues().main_caretaker : ''
    );

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
        },
        onError: (error: any) => toast.error('정보 업데이트 실패', { description: error.message }),
    });

    const onSubmit = (values: FormValues) => {
        const processedValues: Partial<FullDogExtendedProfile> = {};
        Object.keys(values).forEach(key => {
            const mission = category.missions.find(m => m.key === key);
            let value = values[key];
            if (mission?.type === 'array') {
                processedValues[key] = value.split(',').map((s: string) => s.trim()).filter(Boolean);
            } else if (mission?.type === 'boolean') {
                processedValues[key] = value === '예';
            } else if (key === 'main_caretaker' && value === '기타(직접입력)') {
                processedValues[key] = otherCaretaker;
            } else {
                processedValues[key] = value;
            }
        });
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
        <AccordionItem value={category.key} className="border-pink-200/70"> {/* 테두리 색상 변경 */}
            <AccordionTrigger className="hover:bg-pink-50 rounded-md px-4 py-3 group"> {/* 호버 배경 및 패딩, 그룹 클래스 추가 */}
                <div className="flex justify-between items-center w-full">
                    <span className="text-foreground group-hover:text-pink-700 transition-colors">{category.icon} {category.title}</span> {/* 기본 및 호버 시 텍스트 색상 변경 */}
                    <span className="text-sm text-pink-500 font-semibold">완성도 {completionPercent}%</span> {/* 완성도 텍스트 색상 변경 */}
                </div>
            </AccordionTrigger>
            <AccordionContent className="bg-card/50 p-4 rounded-b-md"> {/* 배경 및 패딩 변경 */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> {/* space-y 증가 */}
                        {category.missions.map(mission => (
                            <FormField
                                key={mission.key}
                                control={form.control}
                                name={mission.key as keyof FormValues & string}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-foreground font-medium">{mission.question}</FormLabel> {/* 라벨 스타일 변경 */}
                                        <FormControl>
                                            {mission.type === 'boolean' ? (
                                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4 pt-1"> {/* 간격 및 패딩 조정 */}
                                                    {['예', '아니오'].map(option => (
                                                        <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                                            <FormControl><RadioGroupItem value={option} className="border-pink-300 text-pink-600 focus:ring-pink-500" /></FormControl> {/* Radio 스타일 변경 */}
                                                            <FormLabel className="font-normal text-muted-foreground">{option}</FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            ) : mission.options ? (
                                                <RadioGroup onValueChange={(val) => {
                                                    field.onChange(val);
                                                    if (mission.key === 'main_caretaker' && val !== '기타(직접입력)') {
                                                        setOtherCaretaker('');
                                                    }
                                                }} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2 pt-1"> {/* flex-wrap 추가 및 간격 조정 */}
                                                    {mission.options.map(option => (
                                                        <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                                            <FormControl><RadioGroupItem value={option} className="border-pink-300 text-pink-600 focus:ring-pink-500" /></FormControl> {/* Radio 스타일 변경 */}
                                                            <FormLabel className="font-normal text-muted-foreground">{option}</FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            ) : (
                                                <Textarea
                                                    placeholder={mission.placeholder}
                                                    {...field}
                                                    className="bg-background border-pink-200/80 focus:border-pink-400 focus:ring-pink-400 placeholder:text-muted-foreground/70" /* Textarea 스타일 변경 */
                                                />
                                            )}
                                        </FormControl>
                                        {mission.key === 'main_caretaker' && form.watch('main_caretaker') === '기타(직접입력)' && (
                                            <Input
                                                placeholder="보호자 이름을 입력하세요"
                                                value={otherCaretaker}
                                                onChange={(e) => setOtherCaretaker(e.target.value)}
                                                className="mt-2 bg-background border-pink-200/80 focus:border-pink-400 focus:ring-pink-400 placeholder:text-muted-foreground/70" /* Input 스타일 변경 */
                                            />
                                        )}
                                        <FormMessage className="text-red-400" /> {/* 메시지 색상 변경 */}
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white shadow-md" /* 버튼 스타일 변경 */
                        >
                            {updateProfileMutation.isPending ? '저장 중...' : '저장하기'}
                        </Button>
                    </form>
                </Form>
            </AccordionContent>
        </AccordionItem>
    );
};

export default ProfileCategoryForm;