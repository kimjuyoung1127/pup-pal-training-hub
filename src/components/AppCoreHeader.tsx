
import * as React from "react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navItems = [
    { path: "/app", title: "홈", end: true },
    { path: "/app/dog-info", title: "강아지 등록" },
    { path: "/app/my-page", title: "내 프로필" },
    { 
      title: "훈련 과정", 
      key: "training-process",
      components: [
        { path: "/app/training-recommender", title: "AI 훈련 추천", description: "AI가 우리 아이에게 맞는 훈련 계획을 짜드려요." },
        { path: "/app/posture-analysis", title: "AI 자세 분석", description: "걷는 모습을 분석하여 자세 균형을 확인해보세요." },
      ] 
    },
    { 
      title: "훈련 기록", 
      key: "training-history",
      components: [
        { path: "/app/history", title: "훈련 기록 보기", description: "지난 훈련 성과와 활동 내역을 확인합니다." },
        { path: "/app/posture-analysis-history", title: "자세 분석 기록", description: "자세 변화 추이를 그래프와 데이터로 확인하세요." },
      ]
    },
    { path: "/app/settings", title: "설정" },
];

const AppCoreHeader: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="flex justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex-nowrap overflow-x-auto whitespace-nowrap w-full">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.components ? (
                  <>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        {item.components.map((component) => (
                          <ListItem
                            key={component.title}
                            to={component.path}
                            title={component.title}
                          >
                            {component.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavLink to={item.path!} end={item.end}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.title}
                    </NavigationMenuLink>
                  </NavLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<typeof NavLink>,
  React.ComponentPropsWithoutRef<typeof NavLink>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <NavLink
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </NavLink>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default AppCoreHeader;
