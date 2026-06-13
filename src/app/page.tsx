import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Snapshot from "@/components/Snapshot";
import ProjectsSection from "@/components/ProjectsSection";
import Experience from "@/components/Experience";
import TechnicalExpertise from "@/components/TechnicalExpertise";
import Certifications from "@/components/Certifications";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getAllProjects,
  getBlog,
  getCertifications,
  getEducation,
  getExperience,
  getExpertise,
  getSiteContent,
} from "@/lib/content";

export default function HomePage() {
  const site = getSiteContent();
  const projects = getAllProjects();
  const experience = getExperience();
  const education = getEducation();
  const certifications = getCertifications();
  const expertise = getExpertise();
  const blog = getBlog();

  return (
    <>
      <Nav />
      <main>
        <Hero site={site} />
        <Snapshot site={site} />
        <ProjectsSection projects={projects} />
        <Experience items={experience} education={education} />
        <TechnicalExpertise groups={expertise} />
        <Certifications items={certifications} />
        <Blog
          posts={blog.posts}
          publication={blog.publication}
          publicationUrl={blog.publicationUrl}
        />
        <Contact site={site} />
      </main>
      <Footer site={site} />
    </>
  );
}
