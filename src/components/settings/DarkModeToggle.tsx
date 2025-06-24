
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DarkModeToggle = () => {
    const { theme, setTheme } = useTheme();

    if (!theme) return null;

    const handleToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    }

    return (
        <Card className="card-soft bg-card shadow-md"> {/* 카드 스타일 일관성 (card-soft는 이미 테마색 따름) */}
            <CardHeader>
                <CardTitle className="text-foreground">테마 설정</CardTitle> {/* 타이틀 색상 명시 (기본값 따름) */}
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground"> {/* 아이콘 및 텍스트 기본 색상 변경 */}
                        {theme === 'dark' ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />} {/* 활성 상태 아이콘은 primary 색상 사용 */}
                        <span>다크 모드</span>
                    </div>
                    <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={handleToggle}
                        aria-label="Toggle dark mode"
                        // className="data-[state=checked]:bg-primary" // 필요시 primary 색상 명시 (기본값 따름)
                    />
                </div>
            </CardContent>
        </Card>
    );
}
