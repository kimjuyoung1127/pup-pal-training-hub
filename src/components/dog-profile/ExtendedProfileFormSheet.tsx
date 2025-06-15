import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FullDogExtendedProfile } from '@/hooks/useDogProfile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

export type MissionKey = keyof Omit<FullDogExtendedProfile, 'id' | 'dog_id' | 'created_at' | 'updated_at' | '[key: string]'>;

interface ExtendedProfileFormSheetProps {
    isOpen: boolean;
    onClose: () => void;
    mission: { key: MissionKey; title: string; question: string; } | null;
    dogId: string;
    extendedProfile: FullDogExtendedProfile | null;
    onUpdate: () => void;
}

const formSchema = z.object({
    value: z.string().min(1, { message: '내용을 입력해주세요.' }),
});

const ExtendedProfileFormSheet = ({ isOpen, onClose, mission, dogId, extendedProfile, onUpdate }: ExtendedProfileFormSheetProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { value: '' },
    });
    
    React.useEffect(() => {
        if (mission && extendedProfile) {
            form.setValue('value', extendedProfile[mission.key] || '');
        } else if (mission) {
            form.reset({ value: '' });
        }
    }, [mission, extendedProfile, form]);

    const updateProfileMutation = useMutation({
        mutationFn: async (updates: Partial<FullDogExtendedProfile>) => {
            const { data: existing, error: fetchError } = await supabase
                .from('dog_extended_profile')
                .select('id')
                .eq('dog_id', dogId)
                .maybeSingle();
            
            if (fetchError) throw fetchError;

            if (existing) {
                 const { data, error } = await supabase
                    .from('dog_extended_profile')
                    .update(updates)
                    .eq('dog_id', dogId)
                    .select()
                    .single();
                 if (error) throw error;
                 return data;
            } else {
                 const { data, error } = await supabase
                    .from('dog_extended_profile')
                    .insert({ ...updates, dog_id: dogId })
                    .select()
                    .single();
                 if (error) throw error;
                 return data;
            }
        },
        onSuccess: () => {
            toast.success('🎉 멋져요! 딩딩이의 정보를 업데이트했어요.', {
                description: '다음 추천 훈련이 더 정확해질 거예요!',
            });
            onUpdate();
            onClose();
        },
        onError: (error: any) => {
            toast.error('정보 업데이트에 실패했습니다.', {
                description: error.message
            });
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!mission) return;
        updateProfileMutation.mutate({ [mission.key]: values.value });
    };

    const renderFormField = () => {
        if (!mission) return null;

        switch(mission.key) {
            case 'living_environment':
                return (
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>어디에 살고 있나요?</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        {['아파트', '단독주택', '농가주택'].map(item => (
                                            <FormItem key={item} className="flex items-center space-x-3 space-y-0">
                                                <FormControl><RadioGroupItem value={item} /></FormControl>
                                                <FormLabel className="font-normal">{item}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );
            default:
                return (
                    <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{mission.question}</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="자세하게 알려주세요." {...field} className="min-h-[100px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                );
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); }}}>
            <SheetContent className="bg-cream-50">
                <SheetHeader>
                    <SheetTitle className="font-pretendard text-cream-800">{mission?.title}</SheetTitle>
                    <SheetDescription className="font-pretendard text-cream-600">{mission?.question}</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-8">
                        {renderFormField()}
                        <SheetFooter>
                            <Button type="submit" disabled={updateProfileMutation.isPending} className="w-full">
                                {updateProfileMutation.isPending ? '저장 중...' : '저장하기'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    );
};

export default ExtendedProfileFormSheet;
