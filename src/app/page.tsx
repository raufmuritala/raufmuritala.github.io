import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Snapshot from "@/components/Snapshot";
import About from "@/components/About";
import ProjectsSection from "@/components/ProjectsSection";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getAllProjects,
  getCertifications,
  getEducation,
  getExperience,
  getSiteContent,
} from "@/lib/content";

export default function HomePage() {
  const site = getSiteContent();
  const projects = getAllProjects();
  const experience = getExperience();
  const education = getEducation();
  const certifications = getCertifications();

  return (
    <>
      <Nav />
      <main>
        <Hero site={site} />
        <Snapshot site={site} />
        <About site={site} />
        <ProjectsSection projects={projects} />
        <Experience items={experience} education={education} />
        <Certifications items={certifications} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
    </>
  );
}
