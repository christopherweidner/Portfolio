import About from "@/components/home/About";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import LatestPosts from "@/components/home/LatestPosts";
import { PROJECTS } from "@/content/projects";

export default function Home() {
  return (
    <main className="flex-1">
      <Intro />
      <Hero />
      <About />
      <FeaturedProjects projects={PROJECTS} />
      <LatestPosts />
    </main>
  );
}
