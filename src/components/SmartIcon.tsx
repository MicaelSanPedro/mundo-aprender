"use client";

import AnimatedIcon, { type IconName } from "./AnimatedIcon";

const emojiIconMap: Record<string, IconName> = {
  "🔢": "calculator",
  "📝": "pencil",
  "📚": "book",
  "✏️": "pencil",
  "🎲": "game",
  "📖": "notebook",
  "✍️": "pencil",
  "🔍": "search",
  "💳": "credit-card",
  "📥": "download",
  "🖨️": "document",
  "👨‍🎓": "users",
  "🛡️": "shield",
  "📄": "document",
  "👨‍👩‍👧‍👦": "users",
  "⭐": "star",
  "🏫": "store",
  "📱": "phone",
  "🏦": "lock",
  "🎒": "package",
  "📋": "document",
  "❓": "question",
  "🔑": "key",
  "✅": "check",
  "🎉": "sparkle",
  "🛒": "cart",
  "🚀": "sparkle",
  "💡": "sparkle",
  "🔥": "sparkle",
  "💬": "mail",
  "🎧": "phone",
  "🤝": "users",
  "💪": "award",
  "💛": "heart",
  "⏰": "clock",
  "🛍️": "store",
  "➡️": "arrow-right",
};

const emojiColorMap: Record<string, string> = {
  "🔢": "#3b82f6",
  "📝": "#ec4899",
  "📚": "#f97316",
  "✏️": "#8b5cf6",
  "🎲": "#22c55e",
  "📖": "#06b6d4",
  "✍️": "#f43f5e",
  "⭐": "#eab308",
  "🛡️": "#6366f1",
  "📥": "#22c55e",
};

interface SmartIconProps {
  emoji: string;
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function SmartIcon({ emoji, size = 28, className = "", animated = true }: SmartIconProps) {
  const iconName = emojiIconMap[emoji];

  if (iconName) {
    const color = emojiColorMap[emoji] || undefined;
    return (
      <AnimatedIcon
        name={iconName}
        size={size}
        color={color}
        className={className}
        animated={animated}
      />
    );
  }

  // Fallback: render original emoji with nice styling
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size * 0.75, lineHeight: 1 }}
    >
      {emoji}
    </span>
  );
}
