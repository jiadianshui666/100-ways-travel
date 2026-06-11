interface StorySectionProps {
  description: string;
}

export function StorySection({ description }: StorySectionProps) {
  // Split on double newlines for paragraph breaks
  const paragraphs = description.split(/\n\n+/).filter(Boolean);

  return (
    <section className="max-w-3xl">
      <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-1 h-8 rounded-full bg-neon-gradient" />
        体验故事
      </h2>

      <div className="prose prose-invert prose-lg max-w-none">
        {paragraphs.length > 1 ? (
          paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-dark-200 leading-relaxed mb-5 text-base sm:text-lg"
            >
              {p.trim()}
            </p>
          ))
        ) : (
          <p className="text-dark-200 leading-relaxed text-base sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
