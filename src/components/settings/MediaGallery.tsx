
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
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between bg-amber-100">
                <CardTitle>추억 저장소</CardTitle>
                <Button onClick={handleUploadClick} disabled={uploadMutation.isPending}>
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
            <CardContent className="bg-amber-100">
                {media && media.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {media.map((item) => (
                            <div key={item.id} className="relative group aspect-square">
                                {item.file_type === 'image' ? (
                                    <img src={item.file_url} alt="media" className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <video src={item.file_url} className="w-full h-full object-cover rounded-md" controls />
                                )}
                                <AlertDialog onOpenChange={(isOpen) => !isOpen && setMediaToDelete(null)}>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => setMediaToDelete({ id: item.id, file_path: item.file_path })}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                이 작업은 되돌릴 수 없습니다. 미디어가 영구적으로 삭제됩니다.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>취소</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>업로드된 사진이나 영상이 없습니다.</p>
                        <p className="text-sm">첫 추억을 기록해보세요!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
