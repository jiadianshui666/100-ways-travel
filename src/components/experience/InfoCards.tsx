interface InfoCardsProps {
  duration: string;
  price: number;
  location: string;
}

const cards = [
  {
    key: "duration",
    icon: "⏱️",
    title: "体验时长",
    color: "cyan" as const,
  },
  {
    key: "price",
    icon: "💰",
    title: "预算区间",
    color: "green" as const,
  },
  {
    key: "season",
    icon: "🌤️",
    title: "最佳季节",
    color: "purple" as const,
  },
] as const;

const colorMap = {
  cyan: { bg: "bg-neon-cyan/5", border: "border-neon-cyan/20", text: "text-neon-cyan" },
  green: { bg: "bg-neon-green/5", border: "border-neon-green/20", text: "text-neon-green" },
  purple: { bg: "bg-neon-purple/5", border: "border-neon-purple/20", text: "text-neon-purple" },
};

function getDurationText(duration: string): string {
  const hours = parseInt(duration);
  if (!isNaN(hours) && hours <= 8) return "半天至一天";
  if (duration.includes("天")) return duration;
  if (duration.includes("小时") && parseInt(duration) <= 8) return "1 天";
  return "2–3 天";
}

function getBudgetText(price: number): string {
  if (price < 500) return "经济实惠";
  if (price < 2000) return "中等预算";
  if (price < 10000) return "高端体验";
  return "奢华之旅";
}

function getSeasonText(location: string): string {
  if (location.includes("冰岛") || location.includes("北欧")) return "9月–次年3月";
  if (location.includes("日本") || location.includes("京都")) return "3–5月 / 10–11月";
  if (location.includes("泰国") || location.includes("曼谷")) return "11月–次年2月";
  if (location.includes("新西兰")) return "10月–次年4月";
  return "全年皆宜";
}

export function InfoCards({ duration, price, location }: InfoCardsProps) {
  const values: Record<string, string> = {
    duration: getDurationText(duration),
    price: getBudgetText(price),
    season: getSeasonText(location),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const c = colorMap[card.color];
        return (
          <div
            key={card.key}
            className={`${c.bg} ${c.border} border rounded-2xl p-5 group hover:shadow-neon-purple transition-all duration-300`}
          >
            <div className="text-2xl mb-3">{card.icon}</div>
            <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">
              {card.title}
            </p>
            <p className={`text-lg font-display font-semibold ${c.text}`}>
              {values[card.key]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
