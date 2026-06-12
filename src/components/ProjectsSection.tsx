import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import SectionHeading from "./SectionHeading";

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="projects"
      className="border-y border-line-soft bg-panel/30"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <SectionHeading
          eyebrow="featured_projects"
          title="Featured projects"
          intro="Production-style data platforms and pipelines, written up as case studies — problem, architecture, decisions, and measured impact."
        />
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
