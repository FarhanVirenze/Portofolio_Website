import { Typewriter } from "@/components/typewriter";
import { Download } from "lucide-react";
import { getServiceSupabase } from "@/lib/supabase";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { HomeHero } from "@/components/home-hero";
import { ThreeJsHeroLazy } from "@/components/three-js-hero-lazy";
import { AboutSection } from "@/components/sections/about-section";
import { PortfolioSection } from "@/components/sections/portfolio-section";
import { CertificationSection } from "@/components/sections/certification-section";
import { StoreSection } from "@/components/sections/store-section";
import { SupportSection } from "@/components/sections/support-section";
import { Skill, Project, Certification } from "@/lib/types";
import type { Product } from "@/lib/store";

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

  // Default values
  let roles = [
    "Informatics Student",
    "Web Developer",
    "Mobile Developer",
    "Full-stack Engineer",
  ];
  let cvUrl = "/resume.pdf";
  let greeting = "Hey there, I'm";
  let description = "Welcome to my personal website.";
  let profileImageUrl = "/img/Foto.png";
  
  let skills: Skill[] = [];
  let bioParagraphs = [
    "Hi everyone! I'm Muhamad Farhan, an Information Technology student at Universitas Muhammadiyah Yogyakarta. My journey in programming began in September 2022, and since then, I've been deeply passionate about Programming.",
    "With hands-on experience in full-stack web and mobile development, I work with a wide range of technologies including HTML, CSS, Python, ReactJS, Tailwind CSS, Node.js, Spring Boot, Laravel, PHP, VueJS and Kotlin. I also have a strong background in UI/UX design, data visualization, and digital media production.",
    "I'm always excited to explore new tools and frameworks, constantly pushing myself to learn and grow. I enjoy turning ideas into real-world applications, collaborating with others, and contributing to impactful tech projects."
  ];
  let projects: Project[] = [];
  let certifications: Certification[] = [];
  let products: Product[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    
    // Fetch Home Content
    const homeRes = await supabase.from("home_content").select("*").limit(1).single();
    if (homeRes.data) {
      if (homeRes.data.roles && homeRes.data.roles.length > 0) {
        const filtered = homeRes.data.roles.filter((r: string) => r && r.trim() !== "");
        if (filtered.length > 0) roles = filtered;
      }
      if (homeRes.data.cv_url) cvUrl = homeRes.data.cv_url;
      if (homeRes.data.greeting) greeting = homeRes.data.greeting;
      if (homeRes.data.description) description = homeRes.data.description;
      if (homeRes.data.profile_image_url) profileImageUrl = homeRes.data.profile_image_url;
    }

    // Fetch About Content
    const aboutRes = await supabase.from("about_content").select("*").limit(1).single();
    if (aboutRes.data && aboutRes.data.paragraphs && aboutRes.data.paragraphs.length > 0) {
      bioParagraphs = aboutRes.data.paragraphs;
    }

    // Fetch Skills
    const skillsRes = await supabase.from("skills").select("*").order("sort_order");
    if (skillsRes.data) skills = skillsRes.data;

    // Fetch Projects
    const projRes = await supabase.from("projects").select("*").order("sort_order");
    if (projRes.data) projects = projRes.data;

    // Fetch Certifications
    const certRes = await supabase.from("certifications").select("*").order("sort_order");
    if (certRes.data) certifications = certRes.data;

    // Fetch Products
    const prodRes = await supabase.from("products").select("*").eq("is_active", true).order("sort_order");
    if (prodRes.data) products = prodRes.data;
  }

  // Fallback for skills if empty
  if (skills.length === 0) {
    skills = [
      { id: "1", name: 'HTML', icon_url: 'https://cdn-icons-png.flaticon.com/512/1051/1051277.png', category: 'tech', level: 'Advanced', sort_order: 1, created_at: "" },
      { id: "101", name: 'Git', icon_url: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png', category: 'tool', level: 'Version Control', sort_order: 1, created_at: "" },
    ];
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      
      {/* 1. Hero Section */}
      <section id="hero" className="relative w-full overflow-hidden">
        <ThreeJsHeroLazy />
        
        {/* Main Hero Content */}
        <div className="relative z-10 w-full pt-24 md:pt-32 min-h-screen flex items-center justify-center px-6 md:px-10 lg:px-16">
            <HomeHero>
            <div className="flex flex-col-reverse gap-10 items-center md:flex-row md:gap-16 md:justify-between w-full">
              {/* Text Content */}
              <div className="space-y-5 text-center md:text-left flex-1">
                <p className="hero-greeting text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">{greeting}</p>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-foreground leading-[1.05] flex flex-col md:inline-block overflow-hidden pb-2">
                  <span className="hero-name-left inline-block md:pr-4">Muhamad</span>
                  <span className="hero-name-right inline-block text-primary">Farhan</span>
                </h1>
                
                <div className="hero-roles-wrapper py-1 h-10 mt-2">
                  <h2 className="text-lg md:text-xl font-medium text-foreground/70 tracking-tight">
                    <Typewriter words={roles} />
                  </h2>
                </div>
                
                <p className="hero-desc text-muted-foreground text-base max-w-lg mx-auto md:mx-0 leading-relaxed overflow-hidden">
                  {description.split(" ").map((word, i) => (
                    <span key={i} className="hero-desc-word inline-block mr-1">{word}</span>
                  ))}
                </p>
                
                <div className="hero-buttons pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <MagneticButton>
                    <a
                      href={cvUrl}
                      download="Resume_CV_Muhamad_Farhan.pdf"
                      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
                    >
                      <Download className="w-4 h-4" />
                      Download Resume
                    </a>
                  </MagneticButton>
                </div>
              </div>

              {/* Profile Image */}
              <div className="hero-image-wrapper flex justify-center md:justify-end flex-shrink-0">
                <div className="hero-image relative w-56 h-56 md:w-80 md:h-80">
                  <div className="absolute -inset-3 bg-gradient-to-tr from-primary/50 via-violet-500/40 to-indigo-500/50 dark:-inset-2 dark:from-primary/30 dark:via-violet-400/20 dark:to-indigo-400/30 rounded-full blur-2xl dark:blur-xl animate-pulse-glow" />
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-violet-500 to-indigo-500 dark:via-violet-400 dark:to-indigo-400 opacity-80 dark:opacity-50 shadow-lg shadow-primary/20 dark:shadow-none" />
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
                    <img
                      src={profileImageUrl}
                      alt="Muhamad Farhan"
                      width={320}
                      height={320}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </div>
              </div>
            </div>
          </HomeHero>
        </div>
      </section>

      {/* 2. About Section */}
      <AboutSection 
        skills={skills} 
        bioParagraphs={bioParagraphs} 
        profileImageUrl={profileImageUrl} 
      />

      {/* 3. Portfolio Section */}
      <PortfolioSection projects={projects} />

      {/* 4. Product Section */}
      <StoreSection products={products} />

      {/* 5. Certification Section */}
      <CertificationSection certifications={certifications} />

      {/* 6. Support Section */}
      <SupportSection />
      
    </div>
  );
}
