import React from 'react';
import { Link } from 'react-router-dom';

interface PopularPostCardProps {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  likes: number;
  comments: number;
  image: string;
}

const PopularPostCard: React.FC<PopularPostCardProps> = ({ id, title, excerpt, author, likes, comments, image }) => {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div
          className="w-full h-40 bg-center bg-no-repeat bg-cover rounded-t-lg"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
        <div className="p-4">
          <h3 className="text-slate-800 text-lg font-bold leading-snug">
            {title}
          </h3>
          <p className="text-slate-500 text-sm font-normal leading-normal mt-1 mb-3">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>By {author}</span>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">thumb_up</span> {likes}
              <span className="material-symbols-outlined text-base">chat_bubble</span> {comments}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularPostCard;