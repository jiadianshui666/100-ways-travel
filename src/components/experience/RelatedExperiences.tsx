import { ExperienceCard } from "@/components/home/ExperienceCard";
import { type ExperienceData } from "@/hooks/useExperiences";

interface RelatedExperiencesProps {
  experiences: ExperienceData[];
}

export function RelatedExperiences({ experiences }: RelatedExperiencesProps) {
  if (experiences.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-display font-bold text-white mb-8 flex items-center gap-3">
        <span className="w-1 h-8 rounded-full bg-neon-gradient" />
        同分类体验
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp, i) => (
          <div key={exp.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <ExperienceCard experience={exp} priority={i < 3} />
          </div>
        ))}
      </div>
    </section>
  );
}
