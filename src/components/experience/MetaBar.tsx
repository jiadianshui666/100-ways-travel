import { formatPrice } from "@/lib/utils";

interface MetaBarProps {
  location: string;
  price: number;
  duration: string;
  author: { name: string; avatar?: string | null };
  createdAt: string;
}

export function MetaBar({
  location,
  price,
  duration,
  author,
  createdAt,
}: MetaBarProps) {
  return (
    <div className="glass-strong -mt-8 relative z-10 mx-4 sm:mx-6 lg:mx-auto max-w-5xl rounded-2xl px-6 py-4">
      <div className="flex flex-wrap items-center gap-4 sm:gap-8">
        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-neon-pink/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-dark-400 uppercase tracking-wider">地点</p>
            <p className="text-sm font-medium text-dark-100">{location}</p>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-neon-green/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-dark-400 uppercase tracking-wider">预算</p>
            <p className="text-sm font-medium text-neon-green font-display">{formatPrice(price)}</p>
          </div>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] text-dark-400 uppercase tracking-wider">时长</p>
            <p className="text-sm font-medium text-dark-100">{duration}</p>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <div className="w-9 h-9 rounded-full bg-neon-purple/10 flex items-center justify-center text-sm font-bold text-neon-purple">
            {author.name.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] text-dark-400 uppercase tracking-wider">作者</p>
            <p className="text-sm font-medium text-dark-100">{author.name}</p>
          </div>
        </div>

        {/* Date */}
        <div className="hidden sm:block text-xs text-dark-500 ml-auto">
          {new Date(createdAt).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
