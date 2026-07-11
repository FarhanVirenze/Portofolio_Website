import { Skill } from "@/lib/types";
import { Code, Sparkles } from "lucide-react";
import { AboutSections } from "@/components/about-sections";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import Image from "next/image";

interface AboutSectionProps {
  skills: Skill[];
  bioParagraphs: string[];
  profileImageUrl: string;
}

export function AboutSection({ skills, bioParagraphs, profileImageUrl }: AboutSectionProps) {
  const techSkills = skills.filter((s) => s.category === 'tech');
  const toolSkills = skills.filter((s) => s.category === 'tool');

  return (
    <div id="about" className="w-full relative z-10 bg-background pt-24 pb-16 transition-colors duration-1000">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <AboutSections>
          <div className="space-y-20">
            {/* About Me — Bento Grid */}
            <section>
              <ScrollReveal direction="up" distance={30}>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight">About me</h2>
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mt-2">Get to know who I am</p>
                  </div>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Profile Photo Card */}
                <div className="lg:col-span-5 group about-profile-card opacity-0">
                  <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                    <div className="absolute inset-0">
                      <Image 
                        src={profileImageUrl} 
                        alt="Muhamad Farhan" 
                        width={500}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                      {/* Name at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-8">
                        <h2 className="text-3xl font-bold text-foreground">Muhamad Farhan</h2>
                        <p className="text-primary font-medium text-lg mt-1">Informatics Student</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio Cards */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {bioParagraphs.map((paragraph, idx) => (
                    <div 
                      key={idx} 
                      className="about-bio-paragraph opacity-0 h-full rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
                    >
                      <p className="text-muted-foreground leading-relaxed text-base md:text-xl text-justify indent-14">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Skills Section */}
            <section className="overflow-hidden">
              <ScrollReveal direction="up" distance={30}>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground leading-tight">Tech stack & tools</h2>
                    <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mt-2">Technologies I work with</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Marquee Container */}
              <div className="about-marquee-container opacity-0 relative flex flex-col gap-10 w-full max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0,black_100px,black_calc(100%-100px),transparent_100%)] py-8">
                
                {/* Row 1: Tech Stack */}
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
                  {[...techSkills, ...techSkills, ...techSkills, ...techSkills].map((skill, index) => (
                    <div key={`tech-${index}`} className="flex items-center justify-center px-8 md:px-12 group cursor-pointer">
                      <Image 
                        src={skill.icon_url || "/favicon.ico"} 
                        alt={skill.name} 
                        title={skill.name}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-125 transition-all duration-300 drop-shadow-md group-hover:drop-shadow-xl"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

                {/* Row 2: Tools (Reverse) */}
                <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused] items-center">
                  {[...toolSkills, ...toolSkills, ...toolSkills, ...toolSkills].map((skill, index) => (
                    <div key={`tool-${index}`} className="flex items-center justify-center px-8 md:px-12 group cursor-pointer">
                      <Image 
                        src={skill.icon_url || "/favicon.ico"} 
                        alt={skill.name} 
                        title={skill.name}
                        width={64}
                        height={64}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-125 transition-all duration-300 drop-shadow-md group-hover:drop-shadow-xl"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>

              </div>
            </section>
          </div>
        </AboutSections>
      </div>
    </div>
  );
}
