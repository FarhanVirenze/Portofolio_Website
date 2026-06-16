import { Typewriter } from "@/components/typewriter";
import { Download, ArrowDown } from "lucide-react";
import { getServiceSupabase } from "@/lib/supabase";

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";

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

  // Collect carousel images from projects
  let carouselImages: { src: string; alt: string }[] = [];

  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    const { data } = await supabase.from("home_content").select("*").limit(1).single();
    if (data) {
      if (data.roles && data.roles.length > 0) {
        const filtered = data.roles.filter((r: string) => r && r.trim() !== "");
        if (filtered.length > 0) roles = filtered;
      }
      if (data.cv_url) cvUrl = data.cv_url;
      if (data.greeting) greeting = data.greeting;
      if (data.description) description = data.description;
      if (data.profile_image_url) profileImageUrl = data.profile_image_url;
    }

    // Fetch projects for carousel
    const { data: projects } = await supabase
      .from("projects")
      .select("title, image_url")
      .order("sort_order")
      .limit(6);
    
    if (projects && projects.length > 0) {
      carouselImages = projects.map((p: { title: string; image_url: string | null }) => ({
        src: p.image_url?.startsWith("http") 
          ? p.image_url 
          : `/img/portfolio-${p.image_url}.png`,
        alt: p.title,
      }));
    }
  }

  // Fallback carousel images from local
  if (carouselImages.length === 0) {
    carouselImages = [
      { src: "/img/portfolio-portofoliowebsite.png", alt: "Portfolio Website" },
      { src: "/img/portfolio-weather.png", alt: "Weather App" },
      { src: "/img/portfolio-diskominfodiy.png", alt: "Diskominfo DIY" },
    ];
  }

  return (
    <div className="flex flex-col justify-center min-h-[70vh] w-full">
      {/* Hero Section */}
      <section className="flex flex-col-reverse gap-10 items-center md:flex-row md:gap-16 md:justify-between animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Text Content */}
        <div className="space-y-5 text-center md:text-left flex-1">

          <p className="text-muted-foreground font-medium text-lg">{greeting}</p>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Muhamad
            <span className="block bg-gradient-to-r from-primary via-violet-400 to-indigo-400 bg-clip-text text-transparent dark:from-primary dark:via-violet-300 dark:to-indigo-300">
              Farhan
            </span>
          </h1>
          
          <div className="py-1 h-10">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground/80">
              <Typewriter words={roles} />
            </h2>
          </div>
          
          <p className="text-muted-foreground text-base max-w-lg mx-auto md:mx-0 leading-relaxed">
            {description}
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
            <a
              href={cvUrl}
              download="Resume_CV_Muhamad_Farhan.pdf"
              className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex justify-center md:justify-end flex-shrink-0 animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="relative w-56 h-56 md:w-86 md:h-86">
            {/* Glow ring */}
            <div className="absolute -inset-3 bg-gradient-to-tr from-primary/50 via-violet-500/40 to-indigo-500/50 dark:-inset-2 dark:from-primary/30 dark:via-violet-400/20 dark:to-indigo-400/30 rounded-full blur-2xl dark:blur-xl animate-pulse-glow" />
            {/* Border ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-violet-500 to-indigo-500 dark:via-violet-400 dark:to-indigo-400 opacity-80 dark:opacity-50 shadow-lg shadow-primary/20 dark:shadow-none" />
            {/* Image container */}
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-2xl">
              <img
                src={profileImageUrl}
                alt="Muhamad Farhan"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
