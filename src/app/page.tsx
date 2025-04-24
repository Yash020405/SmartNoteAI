import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from '@supabase/supabase-js';
import { SparklesIcon, LockIcon, LayoutGridIcon, MonitorIcon, FileIcon, SearchIcon, StarIcon, BrainIcon } from "lucide-react";
import { BackgroundBlur } from '@/components/ui/background-blur';

export default async function Home() {
  // Check if user is already logged in
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data } = await supabase.auth.getSession();
  
  if (data?.session) {
    redirect('/dashboard');
  }

  const features = [
    {
      title: "AI-Powered Analysis",
      description: "Write less, get more. Our AI analyzes and summarizes your notes instantly, extracting key points so you don't have to.",
      icon: <SparklesIcon className="h-10 w-10 text-purple-400" />,
    },
    {
      title: "Seamless Encryption",
      description: "Industry-standard security with smooth login options keeps your ideas safe. Your private thoughts stay private, always.",
      icon: <LockIcon className="h-10 w-10 text-blue-400" />,
    },
    {
      title: "Smart Organization",
      description: "Powerful but simple interface to find and organize your thoughts effortlessly. No more searching through endless folders.",
      icon: <SearchIcon className="h-10 w-10 text-emerald-400" />,
    },
    {
      title: "Cross-Device Sync",
      description: "Access your notes from any device with perfect consistency and reliability. Your ideas follow you everywhere you go.",
      icon: <MonitorIcon className="h-10 w-10 text-amber-400" />,
    },
  ];
  
  const benefits = [
    "Capture ideas instantly",
    "Organize thoughts automatically",
    "Find information quickly",
    "Share notes securely",
    "Never lose important details",
    "Work across all devices"
  ];

  return (
    <div className="relative w-full overflow-x-hidden bg-black text-white scrollbar-hidden snap-y snap-mandatory scroll-smooth">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center snap-start">
        <BackgroundBlur className="absolute inset-0">
          <div aria-hidden="true"></div>
        </BackgroundBlur>
        <div className="container px-6 mx-auto relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-6 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-full blur-md animate-pulse-slow"></div>
              <h1 className="relative text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 font-bold animate-gradient-text">
                SmartNote AI
              </h1>
            </div>
            <p className="text-xl sm:text-2xl md:text-3xl mb-12 text-gray-300 max-w-3xl mx-auto animate-fade-in">
              Intelligent note-taking that actually works for you.
            </p>
            
            <div className="flex justify-center mb-16 animate-fade-in">
              <Link 
                href="/auth"
                className="px-12 py-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform-gpu animate-pulse-subtle"
              >
                Get Started
              </Link>
            </div>
            
            {/* Quick benefits list */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl mx-auto">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-full text-sm text-gray-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <StarIcon className="h-3 w-3 text-purple-400" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Moving lines */}
        <div className="absolute inset-x-0 top-1/3 h-px animate-moving-line"></div>
        <div className="absolute inset-x-0 top-2/3 h-px animate-moving-line" style={{ animationDelay: '1s' }}></div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
      
      {/* Features Section - Redesigned */}
      <section className="min-h-screen py-20 bg-black relative flex items-center snap-start">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/5 to-black"></div>
        <div className="container px-6 mx-auto relative">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 animate-fade-in">
              Powerful <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto animate-fade-in">
              Everything you need for efficient note-taking and organization
            </p>
          </div>
          
          {/* Features in 2x2 grid for more space */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative bg-black/60 border border-white/10 shadow-xl p-10 rounded-xl flex items-start hover:bg-black/80 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="mr-8 bg-black p-4 rounded-xl border border-white/5">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-lg text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Moving lines */}
        <div className="absolute inset-x-0 top-1/4 h-px animate-moving-line"></div>
        <div className="absolute inset-x-0 bottom-1/4 h-px animate-moving-line" style={{ animationDelay: '1.5s' }}></div>
      </section>
      
      {/* Interface Preview Section */}
      <section className="min-h-screen py-24 bg-black relative flex items-center snap-start">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/10 to-black"></div>
        <div className="container px-6 mx-auto relative">
          <div className="max-w-6xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 animate-fade-in">
                Beautifully Engineered for <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 animate-gradient-text">Focus</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in">
                Our clean, minimal interface lets you focus on what truly matters - your ideas.
              </p>
            </div>
            
            {/* Premium App screenshot mockup */}
            <div className="relative animate-fade-in">
              <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-2xl blur-xl animate-pulse-slow"></div>
              <div className="relative bg-black/80 border border-white/10 shadow-2xl rounded-xl p-3 md:p-6">
                <div className="w-full h-[500px] bg-black/90 rounded-lg flex items-center justify-center overflow-hidden">
                  {/* App interface preview with premium design */}
                  <div className="w-full h-full flex flex-col bg-black relative overflow-hidden">
                    {/* App header */}
                    <div className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/90">
                      <div className="flex items-center gap-3">
                        <FileIcon className="h-5 w-5 text-blue-400" />
                        <span className="font-medium text-white">Weekly Meeting Notes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-gray-400">Saved</span>
                      </div>
                    </div>
                    {/* App content */}
                    <div className="flex-1 p-8 flex">
                      <div className="flex-1 pr-6 border-r border-white/5">
                        <div className="mb-4 h-5 w-1/3 bg-white/5 rounded"></div>
                        <div className="space-y-3">
                          <div className="h-3 w-full bg-white/10 rounded"></div>
                          <div className="h-3 w-5/6 bg-white/10 rounded"></div>
                          <div className="h-3 w-4/6 bg-white/10 rounded"></div>
                        </div>
                        <div className="my-6 h-0.5 w-full bg-white/5 rounded"></div>
                        <div className="space-y-3">
                          <div className="h-3 w-full bg-white/10 rounded"></div>
                          <div className="h-3 w-3/4 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="w-1/3 px-6">
                        <div className="p-4 rounded-lg bg-black/80 border border-purple-500/20">
                          <div className="mb-3 flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                            </div>
                            <span className="text-xs font-medium text-purple-400">AI Summary</span>
                          </div>
                          <div className="space-y-2">
                            <div className="h-2 w-full bg-white/5 rounded"></div>
                            <div className="h-2 w-5/6 bg-white/5 rounded"></div>
                            <div className="h-2 w-4/5 bg-white/5 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features bullet points */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="flex items-start animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="mr-4 p-2 bg-black/80 rounded-lg border border-white/10">
                  <BrainIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-white">AI-Powered</h3>
                  <p className="text-gray-400">Automatic summaries and insights powered by advanced AI</p>
                </div>
              </div>
              <div className="flex items-start animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="mr-4 p-2 bg-black/80 rounded-lg border border-white/10">
                  <LayoutGridIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-white">Organized</h3>
                  <p className="text-gray-400">Structured layout keeps everything clean and accessible</p>
                </div>
              </div>
              <div className="flex items-start animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div className="mr-4 p-2 bg-black/80 rounded-lg border border-white/10">
                  <MonitorIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2 text-white">Responsive</h3>
                  <p className="text-gray-400">Works perfectly on all your devices, big or small</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Moving lines */}
        <div className="absolute inset-x-0 top-1/3 h-px animate-moving-line" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute inset-x-0 bottom-1/3 h-px animate-moving-line" style={{ animationDelay: '2s' }}></div>
      </section>
      
      {/* CTA Section */}
      <section className="min-h-screen py-24 relative flex items-center justify-center snap-start">
        <BackgroundBlur className="absolute inset-0">
          <div aria-hidden="true"></div>
        </BackgroundBlur>
        <div className="container px-6 mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 animate-fade-in">
              Ready to Upgrade Your Note-Taking?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in">
              Join SmartNote AI and experience the future of intelligent productivity.
            </p>
            
            <div className="flex justify-center animate-fade-in">
              <Link 
                href="/auth"
                className="px-12 py-6 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform-gpu animate-pulse-subtle"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
        
        {/* Moving lines */}
        <div className="absolute inset-x-0 top-1/4 h-px animate-moving-line" style={{ animationDelay: '0.75s' }}></div>
        <div className="absolute inset-x-0 bottom-1/4 h-px animate-moving-line" style={{ animationDelay: '1.25s' }}></div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-3xl font-bold mb-2">
                SmartNote AI
              </h3>
              <p className="text-gray-500">Intelligent productivity tools</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-500">© {new Date().getFullYear()} SmartNote AI. All rights reserved.</p>
              <div className="flex gap-6 mt-4 justify-center md:justify-end">
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-500 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
