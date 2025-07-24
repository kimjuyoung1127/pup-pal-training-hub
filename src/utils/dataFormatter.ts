// src/utils/dataFormatter.ts

import React from 'react';
import { Star } from 'lucide-react';

/**
 * 숫자 점수를 별점(Star Rating) UI로 변환하는 함수
 * @param score 점수 (1-5)
 * @returns 5개의 별 아이콘으로 구성된 React Node
 */
export const renderStarRating = (score: number | null | undefined): React.ReactNode => {
  if (score === null || score === undefined) {
    return React.createElement('span', { className: 'text-gray-400' }, 'N/A');
  }
  
  return React.createElement(
    'div',
    { className: 'flex items-center' },
    [...Array(5)].map((_, i) =>
      React.createElement(Star, {
        key: i,
        className: `h-5 w-5 ${i < score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`
      })
    )
  );
};

/**
 * 숫자 점수에 맞는 텍스트 라벨을 반환하는 함수
 * @param score 점수 (1-5)
 * @returns '매우 낮음' ~ '매우 높음' 사이의 텍스트
 */
export const getRatingLabel = (score: number | null | undefined): string => {
    if (score === null || score === undefined) return '정보 없음';
    if (score <= 1) return '매우 낮음';
    if (score === 2) return '낮음';
    if (score === 3) return '보통';
    if (score === 4) return '높음';
    if (score >= 5) return '매우 높음';
    return '정보 없음';
};

/**
 * 범위 문자열을 사람이 읽기 쉬운 텍스트로 변환하는 함수
 * 예: "(23,41)" -> "23 ~ 41 kg"
 * @param rangeString 범위 문자열 (e.g., "(23,41)")
 * @param unit 단위 (e.g., "kg", "cm")
 * @returns 변환된 문자열
 */
export const formatRange = (rangeString: string | null | undefined, unit: string): string => {
  if (!rangeString) return '정보 없음';
  
  const matches = rangeString.match(/\(?(\d+),(\d+)\)?/);
  if (matches && matches.length === 3) {
    return `${matches[1]} ~ ${matches[2]} ${unit}`;
  }
  
  return rangeString; // 형식에 맞지 않으면 원본 반환
};
