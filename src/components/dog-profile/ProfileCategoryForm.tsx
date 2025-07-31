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
import { Input } from '../ui/input';
import { Edit3, Check, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileCategoryFormProps {
    category: MissionCategory;
    dogId: string;
    extendedProfile: FullDogExtendedProfile | null;
    onUpdate: () => void;
    index?: number;
}

const createFormSchema = (missions: Mission[]) => {
    const shape: { [key: string]: any } = {};
    missions.forEach(mission => {
        shape[mission.key] = z.any();
    });
    return z.object(shape);
};

const ProfileCategoryForm = ({ category, dogId, extendedProfile, onUpdate, index = 0 }: ProfileCategoryFormProps) => {
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
            setIsEditing(false);
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
    const isCompleted = completionPercent === 100;

    // 카테고리별 색상 테마
    const getThemeColors = () => {
        const themes = [
            { bg: 'from-blue-50 to-sky-50', border: 'border-blue-200', accent: 'text-blue-600', selected: 'bg-blue-100 border-blue-400' },
            { bg: 'from-green-50 to-emerald-50', border: 'border-green-200', accent: 'text-green-600', selected: 'bg-green-100 border-green-400' },
            { bg: 'from-purple-50 to-pink-50', border: 'border-purple-200', accent: 'text-purple-600', selected: 'bg-purple-100 border-purple-400' },
            { bg: 'from-orange-50 to-yellow-50', border: 'border-orange-200', accent: 'text-orange-600', selected: 'bg-orange-100 border-orange-400' },
        ];
        return themes[index % themes.length];
    };

    const theme = getThemeColors();

    return (
        <AccordionItem value={category.key} className="border-0">
            <div className={`bg-gradient-to-r ${theme.bg} border-b ${theme.border} last:border-b-0`}>
                <div className="flex items-center w-full px-6 py-4">
                    <AccordionTrigger className="flex-1 hover:no-underline group">
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">{category.icon}</div>
                                <div className="text-left">
                                    <h3 className={`font-bold text-lg ${theme.accent}`}>
                                        {category.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`text-sm ${theme.accent} font-medium`}>
                                            {completionCount}/{category.missions.length} 완료
                                        </div>
                                        {isCompleted && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <Check className="w-4 h-4" />
                                                <span className="text-xs font-medium">완료!</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`text-2xl font-bold ${theme.accent}`}>
                                    {completionPercent}%
                                </div>
                                <ChevronRight className={`w-5 h-5 ${theme.accent} group-data-[state=open]:rotate-90 transition-transform`} />
                            </div>
                        </div>
                    </AccordionTrigger>
                    
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            variant={isEditing ? "default" : "outline"}
                            size="sm"
                            className={`ml-4 px-4 py-2 font-medium transition-all duration-200 ${
                                isEditing 
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md' 
                                    : 'bg-white hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300'
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(!isEditing);
                            }}
                        >
                            <Edit3 className="w-4 h-4 mr-2" />
                            {isEditing ? '취소' : '편집'}
                        </Button>
                    </motion.div>
                </div>
            </div>
            
            <AccordionContent className="px-6 py-6 bg-white">
                {isEditing ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {category.missions.map((mission, missionIndex) => (
                                <motion.div
                                    key={mission.key}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: missionIndex * 0.1 }}
                                >
                                    <FormField
                                        control={form.control}
                                        name={mission.key as keyof FormValues & string}
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormLabel className="text-gray-800 font-semibold text-base">
                                                    {mission.question}
                                                </FormLabel>
                                                <FormControl>
                                                    {mission.type === 'boolean' ? (
                                                        <div className="flex gap-4">
                                                            {['예', '아니오'].map(option => (
                                                                <motion.div
                                                                    key={option}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                        field.value === option 
                                                                            ? `${theme.selected} shadow-md` 
                                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                                    }`}
                                                                    onClick={() => field.onChange(option)}
                                                                >
                                                                    <div className="text-center">
                                                                        <div className={`text-lg font-semibold ${
                                                                            field.value === option ? theme.accent : 'text-gray-700'
                                                                        }`}>
                                                                            {option}
                                                                        </div>
                                                                        {field.value === option && (
                                                                            <Check className={`w-5 h-5 mx-auto mt-2 ${theme.accent.replace('text-', 'text-')}`} />
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    ) : mission.options ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                            {mission.options.map(option => (
                                                                <motion.div
                                                                    key={option}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                        field.value === option 
                                                                            ? `${theme.selected} shadow-md` 
                                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                                    }`}
                                                                    onClick={() => field.onChange(option)}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`font-medium ${
                                                                            field.value === option ? theme.accent : 'text-gray-700'
                                                                        }`}>
                                                                            {option}
                                                                        </span>
                                                                        {field.value === option && (
                                                                            <Check className={`w-5 h-5 ${theme.accent.replace('text-', 'text-')}`} />
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    ) : mission.key === 'walk_satisfaction' ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                            {['매우 만족', '만족', '보통', '불만족', '매우 불만족'].map(option => (
                                                                <motion.div
                                                                    key={option}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                        field.value === option 
                                                                            ? `${theme.selected} shadow-md` 
                                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                                    }`}
                                                                    onClick={() => field.onChange(option)}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className={`font-medium text-sm ${
                                                                            field.value === option ? theme.accent : 'text-gray-700'
                                                                        }`}>
                                                                            {option}
                                                                        </span>
                                                                        {field.value === option && (
                                                                            <Check className={`w-4 h-4 ${theme.accent.replace('text-', 'text-')}`} />
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    ) : mission.key === 'defecation_status' ? (
                                                        <div className="flex gap-4">
                                                            {['정상', '설사', '변비'].map(option => (
                                                                <motion.div
                                                                    key={option}
                                                                    whileHover={{ scale: 1.02 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                                        field.value === option 
                                                                            ? `${theme.selected} shadow-md` 
                                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                                    }`}
                                                                    onClick={() => field.onChange(option)}
                                                                >
                                                                    <div className="text-center">
                                                                        <div className={`text-lg font-semibold ${
                                                                            field.value === option ? theme.accent : 'text-gray-700'
                                                                        }`}>
                                                                            {option}
                                                                        </div>
                                                                        {field.value === option && (
                                                                            <Check className={`w-5 h-5 mx-auto mt-2 ${theme.accent.replace('text-', 'text-')}`} />
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <Textarea 
                                                            placeholder={mission.placeholder} 
                                                            {...field} 
                                                            className="bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 min-h-[100px] resize-none" 
                                                        />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            ))}
                            
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-3 pt-4"
                            >
                                <Button 
                                    type="submit" 
                                    disabled={updateProfileMutation.isPending}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    {updateProfileMutation.isPending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            저장 중...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            저장하기
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 font-semibold"
                                >
                                    취소
                                </Button>
                            </motion.div>
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-4">
                        {category.missions.map((mission, missionIndex) => {
                            const value = extendedProfile?.[mission.key];
                            const displayValue = Array.isArray(value) ? value.join(', ') : (value === true ? '예' : value === false ? '아니오' : value?.toString());
                            const hasValue = displayValue && displayValue !== '';
                            
                            return (
                                <motion.div 
                                    key={mission.key} 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: missionIndex * 0.1 }}
                                    className={`p-4 rounded-lg border-2 transition-all ${
                                        hasValue 
                                            ? 'border-green-200 bg-green-50' 
                                            : 'border-gray-200 bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 mb-2">
                                                {mission.question}
                                            </p>
                                            <p className={`text-sm ${
                                                hasValue ? 'text-gray-700 font-medium' : 'text-gray-500 italic'
                                            }`}>
                                                {displayValue || '아직 기록이 없어요.'}
                                            </p>
                                        </div>
                                        {hasValue && (
                                            <Check className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </AccordionContent>
        </AccordionItem>
    );
};

export default ProfileCategoryForm;