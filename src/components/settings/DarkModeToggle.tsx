
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
        <Card>
            <CardHeader>
                <CardTitle>테마 설정</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        <span>다크 모드</span>
                    </div>
                    <Switch
                        checked={theme === 'dark'}
                        onCheckedChange={handleToggle}
                        aria-label="Toggle dark mode"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
