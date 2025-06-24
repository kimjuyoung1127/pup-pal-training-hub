
import React, { useRef, useState } from 'react';
import { useMedia } from '@/hooks/useMedia';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Upload, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const MediaGallery = () => {
    const { data: media, isLoading, uploadMutation, deleteMutation } = useMedia();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mediaToDelete, setMediaToDelete] = useState<{id: string, file_path: string} | null>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadMutation.mutate(file);
        }
    };
    
    const handleDelete = () => {
        if(mediaToDelete) {
            deleteMutation.mutate(mediaToDelete);
            setMediaToDelete(null);
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" /> {/* 스피너 색상 변경 */}
            </div>
        );
    }

    return (
        <Card className="card-soft bg-card shadow-md"> {/* 카드 스타일 일관성 */}
            <CardHeader className="flex flex-row items-center justify-between bg-muted/50 p-4 rounded-t-lg"> {/* 헤더 배경 및 패딩 변경 */}
                <CardTitle className="text-foreground">추억 저장소</CardTitle> {/* 타이틀 색상 명시 */}
                <Button
                    onClick={handleUploadClick}
                    disabled={uploadMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground" /* 업로드 버튼 스타일 변경 */
                >
                    {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    업로드
                </Button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*"
                />
            </CardHeader>
            <CardContent className="p-4"> {/* 카드 내용 패딩 변경 */}
                {media && media.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"> {/* 반응형 그리드 조정 */}
                        {media.map((item) => (
                            <div key={item.id} className="relative group aspect-square overflow-hidden rounded-lg shadow-sm"> {/* 라운딩 및 그림자 추가 */}
                                {item.file_type === 'image' ? (
                                    <img src={item.file_url} alt="media" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" /> /* 호버 효과 추가 */
                                ) : (
                                    <video src={item.file_url} className="w-full h-full object-cover rounded-lg" controls /> /* 비디오도 라운딩 */
                                )}
                                <AlertDialog onOpenChange={(isOpen) => !isOpen && setMediaToDelete(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive text-destructive-foreground" /* 삭제 버튼 스타일 약간 조정 */
                                            onClick={() => setMediaToDelete({ id: item.id, file_path: item.file_path })}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-popover border-border"> {/* 모달 배경 및 테두리 변경 */}
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-popover-foreground">정말 삭제하시겠습니까?</AlertDialogTitle> {/* 모달 타이틀 색상 변경 */}
                                            <AlertDialogDescription className="text-muted-foreground"> {/* 모달 설명 색상 변경 */}
                                                이 작업은 되돌릴 수 없습니다. 미디어가 영구적으로 삭제됩니다.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="border-border hover:bg-muted">취소</AlertDialogCancel> {/* 취소 버튼 스타일 변경 */}
                                            <AlertDialogAction
                                                onClick={handleDelete}
                                                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground" /* 삭제 액션 버튼 스타일 명시 */
                                            >삭제</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-muted-foreground"> {/* 텍스트 색상 변경 */}
                        <p>업로드된 사진이나 영상이 없습니다.</p>
                        <p className="text-sm">첫 추억을 기록해보세요!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
