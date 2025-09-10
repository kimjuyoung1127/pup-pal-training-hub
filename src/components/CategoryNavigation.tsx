import React from 'react';

interface CategoryNavigationProps {
  categories: { name: string; icon: string; active: boolean }[];
  onCategoryChange: (category: string) => void;
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({ categories, onCategoryChange }) => {
  return (
    <div className="grid grid-cols-4 gap-4 text-center mb-8">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-slate-700 transition-colors ${
            category.active
              ? 'bg-blue-50 hover:bg-blue-100'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onCategoryChange(category.name)}
        >
          <span className="material-symbols-outlined text-3xl text-blue-600">
            {category.icon}
          </span>
          <p className="text-sm font-bold">{category.name}</p>
        </button>
      ))}
    </div>
  );
};

export default CategoryNavigation;