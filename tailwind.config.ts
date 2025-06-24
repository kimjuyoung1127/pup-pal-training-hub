
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},

				green: '#5F8B71', // 톤 다운
				amber: '#F9A240', // 약간 부드럽게
				red: '#D86A51',   // 톤 다운
				'deep-orange': '#A44A30', // 명칭 변경 및 톤 조정 (기존 rust)

				// 새로운 색상 팔레트 (src/index.css의 CSS 변수 참조)
				cream: {
					DEFAULT: 'hsl(var(--cream-500))',
					50: 'hsl(var(--cream-50))',
					100: 'hsl(var(--cream-100))',
					200: 'hsl(var(--cream-200))',
					300: 'hsl(var(--cream-300))',
					400: 'hsl(var(--cream-400))',
					500: 'hsl(var(--cream-500))',
					600: 'hsl(var(--cream-600))',
					700: 'hsl(var(--cream-700))',
					800: 'hsl(var(--cream-800))',
					900: 'hsl(var(--cream-900))',
				},
				orange: {
					DEFAULT: 'hsl(var(--orange-500))',
					50: 'hsl(var(--orange-50))',
					100: 'hsl(var(--orange-100))',
					200: 'hsl(var(--orange-200))',
					300: 'hsl(var(--orange-300))',
					400: 'hsl(var(--orange-400))',
					500: 'hsl(var(--orange-500))',
					600: 'hsl(var(--orange-600))',
					700: 'hsl(var(--orange-700))',
					800: 'hsl(var(--orange-800))',
					900: 'hsl(var(--orange-900))',
				},
				pink: {
					DEFAULT: 'hsl(var(--pink-500))',
					50: 'hsl(var(--pink-50))',
					100: 'hsl(var(--pink-100))',
					200: 'hsl(var(--pink-200))',
					300: 'hsl(var(--pink-300))',
					400: 'hsl(var(--pink-400))',
					500: 'hsl(var(--pink-500))',
					600: 'hsl(var(--pink-600))',
					700: 'hsl(var(--pink-700))',
					800: 'hsl(var(--pink-800))',
					900: 'hsl(var(--pink-900))',
				},
				brown: {
					DEFAULT: 'hsl(var(--brown-500))',
					50: 'hsl(var(--brown-50))',
					100: 'hsl(var(--brown-100))',
					200: 'hsl(var(--brown-200))',
					300: 'hsl(var(--brown-300))',
					400: 'hsl(var(--brown-400))',
					500: 'hsl(var(--brown-500))',
					600: 'hsl(var(--brown-600))',
					700: 'hsl(var(--brown-700))',
					800: 'hsl(var(--brown-800))',
					900: 'hsl(var(--brown-900))',
				},
				beige: {
					DEFAULT: 'hsl(var(--beige-500))',
					50: 'hsl(var(--beige-50))',
					100: 'hsl(var(--beige-100))',
					200: 'hsl(var(--beige-200))',
					300: 'hsl(var(--beige-300))',
					400: 'hsl(var(--beige-400))',
					500: 'hsl(var(--beige-500))',
					600: 'hsl(var(--beige-600))',
					700: 'hsl(var(--beige-700))',
					800: 'hsl(var(--beige-800))',
					900: 'hsl(var(--beige-900))',
				},
				
				sidebar: { // 사이드바 색상도 CSS 변수를 사용하도록 업데이트 (필요시 src/index.css에 정의 추가)
					DEFAULT: 'hsl(var(--sidebar-background, var(--background)))', // 기본값으로 --background 사용
					foreground: 'hsl(var(--sidebar-foreground, var(--foreground)))',
					primary: 'hsl(var(--sidebar-primary, var(--primary)))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground, var(--primary-foreground)))',
					accent: 'hsl(var(--sidebar-accent, var(--accent)))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground, var(--accent-foreground)))',
					border: 'hsl(var(--sidebar-border, var(--border)))',
					ring: 'hsl(var(--sidebar-ring, var(--ring)))'
				},
				'ai-chat': { // AI 상담 페이지용 색상
					DEFAULT: '#258A81', // 청록색 계열 기본
					light: '#E0F2F1',  // 밝은 청록색 (AI 아이콘 배경 등)
					text: '#FFFFFF',     // AI 메시지 버블 텍스트
					'bubble-user': 'hsl(var(--primary))', // 사용자 메시지 버블 배경 (기존 primary)
					'bubble-user-text': 'hsl(var(--primary-foreground))', // 사용자 메시지 버블 텍스트 (기존 primary-foreground)
				},
				'training-yellow': {
					DEFAULT: '#FFD954',
					light: '#FFF5D9',
					dark: '#E6C040',
					text: 'hsl(var(--brown-900))',
				},
				'training-green': {
					DEFAULT: '#A3D978',
					light: '#EBF8E3',
					dark: '#7DB85C',
					text: 'hsl(var(--brown-900))',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				'pretendard': ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bounce-gentle': {
					'0%, 100%': {
						transform: 'translateY(0)',
						'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)'
					},
					'50%': {
						transform: 'translateY(-5px)',
						'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'bounce-gentle': 'bounce-gentle 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
