import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

interface RecentPostItemProps {
  id: number;
  title: string;
  category: string;
  author: string;
  time: string;
  comments: number;
}

const RecentPostItem: React.FC<RecentPostItemProps> = ({ id, title, category, author, time, comments }) => {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex-1">
        <p className="text-slate-800 text-base font-medium leading-normal line-clamp-1">
          {title}
        </p>
        <p className="text-slate-500 text-sm font-normal leading-normal line-clamp-2">
          {category} · by {author} · {time}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-slate-500">
        <MessageSquare className="w-4 h-4" />
        <p className="text-sm font-medium">{comments}</p>
      </div>
    </div>
  );
};

export default RecentPostItem;