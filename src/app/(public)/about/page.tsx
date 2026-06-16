import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skill } from "@/lib/types";
import { getServiceSupabase } from "@/lib/supabase";
import { Code, Wrench, Sparkles } from "lucide-react";

// Mock data (fallback if Supabase isn't connected yet)
let defaultBioParagraphs = [
  "Hi everyone! I'm Muhamad Farhan, an Information Technology student at Universitas Muhammadiyah Yogyakarta. My journey in programming began in September 2022, and since then, I've been deeply passionate about Programming.",
  "With hands-on experience in full-stack web and mobile development, I work with a wide range of technologies including HTML, CSS, Python, ReactJS, Tailwind CSS, Node.js, Spring Boot, Laravel, PHP, VueJS and Kotlin. I also have a strong background in UI/UX design, data visualization, and digital media production.",
  "I'm always excited to explore new tools and frameworks, constantly pushing myself to learn and grow. I enjoy turning ideas into real-world applications, collaborating with others, and contributing to impactful tech projects."
];

const mockSkills: Skill[] = [
  { id: "1", name: 'HTML', icon_url: 'https://cdn-icons-png.flaticon.com/512/1051/1051277.png', category: 'tech', level: 'Advanced', sort_order: 1, created_at: "" },
  { id: "2", name: 'CSS', icon_url: 'https://cdn-icons-png.flaticon.com/512/732/732190.png', category: 'tech', level: 'Advanced', sort_order: 2, created_at: "" },
  { id: "3", name: 'Javascript', icon_url: 'https://cdn.icon-icons.com/icons2/2415/PNG/512/javascript_original_logo_icon_146455.png', category: 'tech', level: 'Advance', sort_order: 3, created_at: "" },
  { id: "4", name: 'Python', icon_url: 'https://cdn.iconscout.com/icon/free/png-256/free-python-2-226051.png?f=webp', category: 'tech', level: 'Intermediate', sort_order: 4, created_at: "" },
  { id: "12", name: 'ReactJS', icon_url: 'https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png', category: 'tech', level: 'Intermediate', sort_order: 5, created_at: "" },
  { id: "5", name: 'PHP', icon_url: 'https://cdn.iconscout.com/icon/free/png-256/free-php-2038871-1720084.png', category: 'tech', level: 'Intermediate', sort_order: 6, created_at: "" },
  { id: "6", name: 'Laravel', icon_url: 'https://cdn.worldvectorlogo.com/logos/laravel-2.svg', category: 'tech', level: 'Intermediate', sort_order: 7, created_at: "" },
  { id: "7", name: 'VueJS', icon_url: 'https://cdn.iconscout.com/icon/free/png-256/free-vue-282497.png?f=webp', category: 'tech', level: 'Intermediate', sort_order: 8, created_at: "" },
  { id: "10", name: 'Tailwind', icon_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', category: 'tech', level: 'Intermediate', sort_order: 9, created_at: "" },
  
  { id: "101", name: 'Git', icon_url: 'https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png', category: 'tool', level: 'Version Control', sort_order: 1, created_at: "" },
  { id: "102", name: 'GitHub', icon_url: 'https://cdn-icons-png.flaticon.com/512/25/25231.png', category: 'tool', level: 'Git Hosting', sort_order: 2, created_at: "" },
  { id: "103", name: 'NPM', icon_url: 'https://cdn.iconscout.com/icon/free/png-256/free-npm-3-1175132.png', category: 'tool', level: 'Package Manager', sort_order: 3, created_at: "" },
  { id: "104", name: 'MySQL', icon_url: 'https://cdn-icons-png.flaticon.com/512/5968/5968313.png', category: 'tool', level: 'Database', sort_order: 4, created_at: "" },
];

export default async function About() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseConfigured = supabaseUrl && supabaseUrl !== "your_supabase_project_url";
  
  let skills = mockSkills;
  let bioParagraphs = defaultBioParagraphs;
  let profileImageUrl = "/img/Foto.png";
  
  if (isSupabaseConfigured) {
    const supabase = getServiceSupabase();
    
    // Fetch Skills
    const s = await supabase.from("skills").select("*").order("sort_order");
    if (s.data && s.data.length > 0) {
      skills = s.data;
    }

    // Fetch About Content
    const a = await supabase.from("about_content").select("*").limit(1).single();
    if (a.data) {
      if (a.data.paragraphs && a.data.paragraphs.length > 0) {
        bioParagraphs = a.data.paragraphs;
      }
      if (a.data.profile_image_url) {
        profileImageUrl = a.data.profile_image_url;
      }
    }
  }

  const techSkills = skills.filter((s: Skill) => s.category === 'tech');
  const toolSkills = skills.filter((s: Skill) => s.category === 'tool');

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-10">
      
      {/* About Me — Bento Grid */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">About Me</h1>
            <p className="text-sm text-muted-foreground">Get to know who I am</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Photo Card */}
          <div className="lg:col-span-5 group">
            <div className="relative h-full min-h-[400px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
              <div className="absolute inset-0">
                {profileImageUrl.startsWith("http") ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Muhamad Farhan" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img 
                    src={profileImageUrl} 
                    alt="Muhamad Farhan" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
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
                className="h-full rounded-3xl border border-border bg-card p-8 shadow-sm hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-base md:text-xl text-justify indent-14">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Code className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Skills & Tools</h2>
            <p className="text-sm text-muted-foreground">Technologies I work with</p>
          </div>
        </div>

        <Tabs defaultValue="tech" className="w-full">
          <TabsList className="mb-8 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-full p-1">
            <TabsTrigger 
              value="tech" 
              className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all"
            >
              <Code className="w-4 h-4 mr-2" />
              Tech Stack
            </TabsTrigger>
            <TabsTrigger 
              value="tool" 
              className="rounded-full px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25 transition-all"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tech" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {techSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tool" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {toolSkills.map((skill, index) => (
                <SkillCard key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <div 
      className="group relative flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 cursor-default overflow-hidden"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-11 h-11 flex items-center justify-center shrink-0 rounded-lg bg-muted/50 border border-border/50 group-hover:border-primary/20 transition-colors">
        <img 
          src={skill.icon_url || "/favicon.ico"} 
          alt={skill.name} 
          width={28} 
          height={28} 
          className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
        />
      </div>
      <div className="relative flex flex-col min-w-0">
        <span className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm truncate">
          {skill.name}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {skill.level}
        </span>
      </div>
    </div>
  );
}
