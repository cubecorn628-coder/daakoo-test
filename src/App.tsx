import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Shield, 
  Menu, 
  X,
  Github,
  Twitter,
  Instagram,
  ArrowUp,
  Info,
  ChevronRight,
  ChevronLeft,
  Play,
  MessageSquare
} from 'lucide-react';
import { cn } from './lib/utils';
import CommentPage from './pages/CommentPage';

// --- Components ---

const Button = ({ 
  children, 
  variant = 'primary', 
  className, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }) => {
  const variants = {
    primary: 'bg-m3-primary text-m3-on-primary hover:shadow-lg active:scale-95',
    secondary: 'bg-m3-secondary text-m3-on-secondary hover:shadow-md active:scale-95',
    outline: 'border border-m3-outline text-m3-primary hover:bg-m3-primary/5 active:scale-95',
    ghost: 'text-m3-on-surface hover:bg-m3-on-surface/5 active:scale-95',
  };

  return (
    <button 
      className={cn(
        'px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div 
    className={cn('lightmorph-card p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300', className)}
    {...props}
  >
    {children}
  </div>
);

// --- Onboarding Guide ---

const OnboardingGuide = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to Lumina",
      desc: "Let's take a quick tour of your new workspace. It's designed for speed and beauty.",
      icon: <Zap className="text-m3-primary" size={40} />
    },
    {
      title: "Dynamic Themes",
      desc: "Switch between Light and Dark mode seamlessly. Our Material 3 theme adapts to your needs.",
      icon: <Sun className="text-yellow-500" size={40} />
    },
    {
      title: "LightMorph Design",
      desc: "Experience our unique LightMorph effect—diffused light that creates a premium ambience.",
      icon: <Layers className="text-purple-500" size={40} />
    },
    {
      title: "Ready to Start?",
      desc: "You're all set! Click finish to start building your dream project.",
      icon: <CheckCircle2 className="text-green-500" size={40} />
    }
  ];

  const next = () => step < steps.length - 1 ? setStep(step + 1) : onComplete();
  const prev = () => step > 0 && setStep(step - 1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-m3-on-surface/40 backdrop-blur-sm p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-m3-surface max-w-md w-full rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-m3-surface-variant">
          <motion.div 
            className="h-full bg-m3-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 text-m3-on-surface-variant hover:text-m3-on-surface text-sm font-bold"
        >
          SKIP
        </button>

        <div className="flex flex-col items-center text-center mt-4">
          <div className="mb-6 p-4 bg-m3-surface-variant rounded-3xl">
            {steps[step].icon}
          </div>
          <h3 className="text-2xl font-bold mb-4">{steps[step].title}</h3>
          <p className="text-m3-on-surface-variant mb-8 leading-relaxed">
            {steps[step].desc}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={prev}
            disabled={step === 0}
            className={cn(
              "p-3 rounded-full transition-colors",
              step === 0 ? "text-m3-outline/30" : "text-m3-on-surface hover:bg-m3-on-surface/5"
            )}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === step ? "w-6 bg-m3-primary" : "bg-m3-outline/30"
                )}
              />
            ))}
          </div>

          <button 
            onClick={next}
            className="p-3 bg-m3-primary text-m3-on-primary rounded-full hover:shadow-lg transition-all"
          >
            {step === steps.length - 1 ? <CheckCircle2 size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ThemeToggle = ({ isDarkMode, onToggle }: { isDarkMode: boolean; onToggle: () => void }) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-16 h-9 rounded-full p-1 transition-all duration-500 ease-in-out overflow-hidden group active:scale-90",
        isDarkMode ? "bg-m3-primary/20" : "bg-m3-on-surface/5"
      )}
      aria-label="Toggle theme"
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 opacity-20 blur-md"
        animate={{
          background: isDarkMode 
            ? "radial-gradient(circle at center, var(--m3-primary), transparent)" 
            : "radial-gradient(circle at center, #fbbf24, transparent)"
        }}
      />
      
      {/* Sliding Knob */}
      <motion.div
        className={cn(
          "relative z-10 w-7 h-7 rounded-full flex items-center justify-center shadow-lg",
          isDarkMode ? "bg-m3-primary text-m3-on-primary" : "bg-white text-yellow-500"
        )}
        animate={{
          x: isDarkMode ? 28 : 0,
          rotate: isDarkMode ? 360 : 0
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDarkMode ? (
            <motion.div
              key="moon"
              initial={{ x: -10, opacity: 0, rotate: -45 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: 10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.25, ease: "circOut" }}
            >
              <Moon size={16} fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ x: 10, opacity: 0, rotate: 45 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              exit={{ x: -10, opacity: 0, rotate: -45 }}
              transition={{ duration: 0.25, ease: "circOut" }}
            >
              <Sun size={16} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle Icons in Background */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none opacity-20">
        <Sun size={14} className={cn(isDarkMode ? "text-m3-on-surface" : "text-yellow-500")} />
        <Moon size={14} className={cn(isDarkMode ? "text-m3-primary" : "text-m3-on-surface")} />
      </div>
    </button>
  );
};

// --- Main App ---

function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('lumina_guide_seen');
    if (!hasSeenGuide) {
      setShowGuide(true);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const completeGuide = () => {
    setShowGuide(false);
    localStorage.setItem('lumina_guide_seen', 'true');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <div className="min-h-screen selection:bg-m3-primary/30">
      <AnimatePresence>
        {showGuide && <OnboardingGuide onComplete={completeGuide} />}
      </AnimatePresence>

      {/* Fixed Background Hero Image */}
      <div 
        className="fixed inset-0 z-[-1] overflow-hidden"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.div 
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.05 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: isDarkMode 
                ? `url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2564&auto=format&fit=crop')` 
                : `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')`,
              filter: isDarkMode ? 'brightness(0.4) saturate(0.7)' : 'brightness(1) saturate(1)'
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-m3-surface/10 to-m3-surface" />
      </div>

      {/* Navigation */}
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-4 border-b border-transparent',
        scrolled 
          ? 'bg-m3-surface/40 border-m3-outline/5 shadow-[0_10px_40px_-10px_rgba(var(--m3-primary-rgb),0.2)] backdrop-blur-sm' 
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-m3-on-surface/5 transition-colors md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 bg-m3-primary rounded-xl flex items-center justify-center text-m3-on-primary shadow-[0_0_20px_rgba(var(--m3-primary-rgb),0.4)] transition-transform group-hover:scale-110">
                <Zap size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tighter lightmorph-text">Lumina</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold hover:text-m3-primary transition-all relative group tracking-wide"
              >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-m3-primary transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
            <Link to="/comment" className="text-sm font-semibold hover:text-m3-primary transition-all relative group tracking-wide flex items-center gap-1">
              <MessageSquare size={16} /> Comments
              <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-m3-primary transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
            <div className="h-6 w-[1px] bg-m3-outline/20" />
            <div className="flex items-center gap-4">
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              <Button className="shadow-[0_10px_20px_-5px_rgba(var(--m3-primary-rgb),0.3)] px-8">Get Started</Button>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/comment" className="p-2 rounded-full hover:bg-m3-on-surface/5">
              <MessageSquare size={22} />
            </Link>
            <button className="p-2 rounded-full hover:bg-m3-on-surface/5">
              <Github size={22} />
            </button>
            <Button variant="primary" className="px-5 py-2.5 text-xs font-bold shadow-lg">Join</Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-m3-surface pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex items-center justify-between p-4 rounded-3xl bg-m3-on-surface/5">
                <span className="font-bold">Theme</span>
                <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              </div>
              <Button className="w-full py-4 text-lg">Get Started</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-m3-primary/10 text-m3-primary text-sm font-bold tracking-wider uppercase border border-m3-primary/20 lightmorph-glow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-m3-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-m3-primary"></span>
              </span>
              Next Generation Design
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] lightmorph-text">
              Experience the <br />
              <span className="text-m3-primary">LightMorph</span> Era
            </h1>
            
            <p className="text-lg md:text-xl text-m3-on-surface/70 max-w-2xl mx-auto font-medium leading-relaxed">
              Beyond glassmorphism. A new design language focused on diffused light, 
              ambient glows, and pure visual harmony.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Button size="lg" className="px-10 py-7 text-lg shadow-[0_20px_40px_-10px_rgba(var(--m3-primary-rgb),0.4)] rounded-2xl group">
                Get Started Free
                <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </Button>
              <button className="flex items-center gap-3 font-bold text-m3-on-surface/80 hover:text-m3-primary transition-colors group">
                <div className="w-12 h-12 rounded-full border-2 border-m3-outline/20 flex items-center justify-center group-hover:border-m3-primary transition-colors">
                  <Play size={18} fill="currentColor" />
                </div>
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-m3-on-surface/40">Scroll</span>
          <div className="w-[2px] h-12 bg-gradient-to-b from-m3-primary to-transparent rounded-full overflow-hidden">
            <motion.div 
              animate={{ y: [0, 48, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-1/3 bg-m3-primary"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 lightmorph-text">Everything you need to succeed</h2>
            <p className="text-m3-on-surface-variant text-lg">
              We've built all the tools you need to launch your next project in record time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Zap className="text-yellow-500" />, 
                title: 'Lightning Fast', 
                desc: 'Optimized for performance and speed. Your users won\'t wait.' 
              },
              { 
                icon: <Shield className="text-blue-500" />, 
                title: 'Secure by Default', 
                desc: 'Enterprise-grade security built into every layer of the stack.' 
              },
              { 
                icon: <Layers className="text-purple-500" />, 
                title: 'Highly Scalable', 
                desc: 'Grows with your business. From 1 to 1 million users effortlessly.' 
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card className="h-full lightmorph-card">
                  <div className="w-12 h-12 rounded-2xl bg-m3-primary/10 flex items-center justify-center mb-6 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-m3-on-surface-variant leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-m3-primary text-m3-on-primary rounded-[3rem] mx-6 mb-24 shadow-2xl shadow-m3-primary/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Active Users', value: '50K+' },
            { label: 'Projects Built', value: '120K+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Support', value: '24/7' },
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-m3-on-primary/70 font-medium uppercase tracking-widest text-xs">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 lightmorph-text">Loved by developers worldwide</h2>
              <p className="text-m3-on-surface-variant text-lg">
                Don't just take our word for it. Here's what our community has to say.
              </p>
            </div>
            <Button variant="outline">Read all stories</Button>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {[
              { name: 'Sarah Chen', role: 'CTO at TechFlow', text: 'Lumina has completely transformed how we build prototypes. The speed is unmatched.' },
              { name: 'Marcus Wright', role: 'Freelance Designer', text: 'The Material 3 implementation is the best I\'ve seen. Clean, modern, and accessible.' },
              { name: 'Elena Rodriguez', role: 'Product Manager', text: 'Finally a landing page that actually converts. Our sign-up rate increased by 40%.' },
              { name: 'David Kim', role: 'Fullstack Dev', text: 'The documentation is incredible. I was up and running in less than 10 minutes.' },
              { name: 'Jessica Lee', role: 'Startup Founder', text: 'Perfect for our MVP. It looks professional right out of the box.' },
              { name: 'Tom Baker', role: 'UX Researcher', text: 'The attention to detail in the animations and transitions is superb.' },
            ].map((t, idx) => (
              <Card key={idx} className="break-inside-avoid">
                <p className="italic text-lg mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-m3-primary/20 flex items-center justify-center font-bold text-m3-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-m3-on-surface-variant">{t.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center bg-m3-surface-variant/50 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 border border-m3-outline/20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 lightmorph-text">Ready to illuminate your ideas?</h2>
          <p className="text-xl text-m3-on-surface-variant mb-12 max-w-2xl mx-auto">
            Join thousands of creators building the future of the web. 
            No credit card required. Cancel anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-12 py-5 text-xl">Get Started Free</Button>
            <Button variant="ghost" className="w-full sm:w-auto px-12 py-5 text-xl">Contact Sales</Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-m3-on-surface-variant">
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" /> Free Trial</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" /> No Setup Fee</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={18} className="text-green-500" /> 24/7 Support</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-m3-surface-variant/20 pt-20 pb-10 px-6 border-t border-m3-outline/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-m3-primary rounded-lg flex items-center justify-center text-m3-on-primary">
                  <Zap size={18} />
                </div>
                <span className="text-xl font-bold lightmorph-text">Lumina</span>
              </div>
              <p className="text-m3-on-surface-variant max-w-xs mb-8">
                The modern standard for web development and design. 
                Built for creators, by creators.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full bg-m3-surface hover:bg-m3-primary hover:text-m3-on-primary transition-all">
                  <Twitter size={20} />
                </a>
                <a href="#" className="p-2 rounded-full bg-m3-surface hover:bg-m3-primary hover:text-m3-on-primary transition-all">
                  <Github size={20} />
                </a>
                <a href="#" className="p-2 rounded-full bg-m3-surface hover:bg-m3-primary hover:text-m3-on-primary transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-m3-on-surface-variant text-sm">
                <li><a href="#" className="hover:text-m3-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Resources</h4>
              <ul className="space-y-4 text-m3-on-surface-variant text-sm">
                <li><a href="#" className="hover:text-m3-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">API Reference</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-m3-on-surface-variant text-sm">
                <li><a href="#" className="hover:text-m3-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-m3-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-m3-outline/10 gap-4">
            <p className="text-sm text-m3-on-surface-variant">
              © 2026 Lumina Inc. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm text-m3-on-surface-variant">
              <a href="#" className="hover:text-m3-primary transition-colors">Status</a>
              <a href="#" className="hover:text-m3-primary transition-colors">Security</a>
              <a href="#" className="hover:text-m3-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-[60] w-14 h-14 bg-m3-primary text-m3-on-primary rounded-2xl shadow-2xl flex items-center justify-center group overflow-hidden"
            aria-label="Scroll to top"
          >
            {/* Instant Fill Background */}
            <div className="absolute inset-0 bg-m3-on-primary/20 scale-0 group-hover:scale-100 transition-transform duration-75 origin-center fab-fill" />
            <ArrowUp size={24} className="relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Help Button to trigger guide again */}
      <button 
        onClick={() => setShowGuide(true)}
        className="fixed bottom-8 left-8 z-[60] w-14 h-14 bg-m3-surface-variant text-m3-on-surface-variant rounded-2xl shadow-lg flex items-center justify-center hover:bg-m3-primary hover:text-m3-on-primary transition-all duration-300"
        aria-label="Show help"
      >
        <Info size={24} />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comment" element={<CommentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
