import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { 
  BarChart3, 
  BrainCircuit, 
  PlaySquare, 
  Users, 
  ArrowRight,
  Menu,
  X,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "", direction = "up", scale = false, blur = false }: any) => {
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset, scale: scale ? 0.9 : 1, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const TiltImage = ({ src, alt, containerClassName = "", imgClassName = "" }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={containerClassName}
    >
      <motion.img
        src={src}
        alt={alt}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={imgClassName}
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
};

const InteractiveCompass = () => {
  const compassRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const prevAngleRef = useRef(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!compassRef.current) return;
      const rect = compassRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = rad * (180 / Math.PI) + 90;

      let delta = deg - prevAngleRef.current;
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      rotationRef.current += delta;
      prevAngleRef.current = deg;
      
      setCurrentRotation(rotationRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div 
        ref={compassRef}
        className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-gray-50 to-white shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_0_20px_rgba(255,255,255,1)] border-[8px] border-hermes flex items-center justify-center ring-4 ring-hermes/10"
      >
        {/* Inner dial */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-inner border border-gray-100"></div>
        
        {/* Ticks */}
        <div className="absolute inset-4 rounded-full opacity-20" style={{ background: 'repeating-conic-gradient(from 0deg, transparent 0deg, transparent 2deg, #000000 2deg, #000000 3deg)' }}></div>
        <div className="absolute inset-8 rounded-full bg-gradient-to-b from-gray-50 to-white shadow-[inset_0_0_15px_rgba(0,0,0,0.05)]"></div>

        {/* Labels */}
        <div className="absolute top-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040" alt="Bitcoin" className="w-full h-full object-contain" />
        </div>
        <div className="absolute right-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040" alt="Ethereum" className="w-full h-full object-contain" />
        </div>
        <div className="absolute bottom-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=040" alt="Solana" className="w-full h-full object-contain" />
        </div>
        <div className="absolute left-6 font-bold text-4xl md:text-5xl text-charcoal drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">?</div>

        {/* Needle */}
        <div 
          className="absolute w-8 h-[85%] z-10 flex flex-col items-center justify-center transition-transform duration-100 ease-out drop-shadow-2xl"
          style={{ transform: `rotate(${currentRotation}deg)` }}
        >
          {/* North pointing needle (Red/Hermes) */}
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[110px] md:border-b-[160px] border-l-transparent border-r-transparent border-b-[#F37021] relative">
            <div className="absolute -left-[12px] top-0 w-[12px] h-[110px] md:h-[160px] bg-black/20 skew-y-[85deg] origin-bottom"></div>
          </div>
          {/* South pointing needle (White/Silver) */}
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[110px] md:border-t-[160px] border-l-transparent border-r-transparent border-t-gray-200 relative">
            <div className="absolute -left-[12px] bottom-0 w-[12px] h-[110px] md:h-[160px] bg-black/10 -skew-y-[85deg] origin-top"></div>
          </div>
        </div>

        {/* Center Pin */}
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-20 border-2 border-gray-400">
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-black"></div>
        </div>
        
        {/* Glass glare */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-white text-charcoal font-sans overflow-x-hidden selection:bg-hermes/20 selection:text-charcoal">
      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="font-bold text-2xl tracking-tight text-[#0A0B0D]">Krypto<span className="text-hermes">Kompass</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <a href="#features" className="hover:text-hermes transition-colors">Leistungen</a>
            <a href="#mindset" className="hover:text-hermes transition-colors">Mindset</a>
            <a href="#pricing" className="hover:text-hermes transition-colors">Preise</a>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a href="#login" className="text-sm font-medium text-gray-600 hover:text-charcoal transition-colors">Mitglieder-Login</a>
            <a href="#pricing" className="bg-hermes text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-hermes-dark transition-all duration-300">
              Jetzt beitreten
            </a>
          </div>

          <button className="md:hidden text-charcoal" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Leistungen</a>
            <a href="#mindset" onClick={() => setMobileMenuOpen(false)}>Mindset</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>Preise</a>
            <div className="h-px bg-gray-100 w-full my-2"></div>
            <a href="#login" onClick={() => setMobileMenuOpen(false)}>Mitglieder-Login</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="bg-hermes text-white px-6 py-3 rounded-lg text-center mt-4 font-bold">Jetzt beitreten</a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden min-h-[80vh] flex items-center bg-white">
        {/* Background Image - Fixed width container, no zoom/distortion */}
        <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="w-full max-w-7xl h-full relative flex items-center justify-center">
            <img 
              src="https://s1.directupload.eu/images/260226/reta6zp3.webp" 
              alt="KryptoKompass Hero" 
              className="w-full h-full object-contain object-center opacity-80"
              referrerPolicy="no-referrer"
            />
            {/* Cleaner gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-white/10 md:from-white/95 md:via-white/40 md:to-transparent"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-2xl">
            <FadeIn blur scale className="mb-6">
              <span className="inline-flex items-center gap-2 text-hermes font-bold text-sm uppercase tracking-wider">
                Die Nr. 1 Krypto-Schule in DACH
              </span>
            </FadeIn>
            
            <FadeIn blur scale delay={0.2}>
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.05] mb-8 text-[#0A0B0D]">
                Krypto-Welt noch <br />
                <span className="text-hermes">Neuland für dich?</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4} direction="right">
              <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed mb-10 max-w-xl">
                Wir navigieren dich sicher durch den digitalen Dschungel. Erst lernen, dann investieren.
              </p>
            </FadeIn>

            <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <a href="#pricing" className="w-full sm:w-auto bg-hermes text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-hermes-dark transition-all duration-300 text-center">
                Kostenlos starten
              </a>
              <a href="#features" className="w-full sm:w-auto bg-white text-charcoal border border-gray-200 px-10 py-4 rounded-lg text-lg font-bold hover:border-hermes hover:text-hermes transition-all duration-300 text-center">
                Unser Konzept
              </a>
            </FadeIn>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scrollen</span>
          <div className="w-px h-12 bg-gradient-to-b from-gray-400 to-transparent"></div>
        </motion.div>
      </section>

      {/* Trust Bar */}
      <section className="py-10 bg-charcoal relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4">
            <FadeIn direction="right" className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-hermes/10 border border-hermes/20 flex items-center justify-center">
                <X className="text-hermes" size={24} />
              </div>
              <span className="text-white font-black tracking-widest text-sm md:text-base">KEIN COACHING</span>
            </FadeIn>
            <FadeIn direction="right" delay={0.1} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-hermes/10 border border-hermes/20 flex items-center justify-center">
                <X className="text-hermes" size={24} />
              </div>
              <span className="text-white font-black tracking-widest text-sm md:text-base">KEIN INVESTMENT</span>
            </FadeIn>
            <FadeIn direction="right" delay={0.2} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-hermes/10 border border-hermes/20 flex items-center justify-center">
                <X className="text-hermes" size={24} />
              </div>
              <span className="text-white font-black tracking-widest text-sm md:text-base">KEIN SCAM</span>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section id="features" className="py-24 md:py-32 relative px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" blur>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight text-[#0A0B0D]">
                Wir leben im <span className="text-hermes">21. Jahrhundert.</span> <br />
                Das ist die Zukunft.
              </h2>
              <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                <p>
                  Die Welt verändert sich rasant, doch die meisten Menschen trauen sich nicht, den ersten Schritt in Richtung Kryptowährungen zu machen. Warum? Weil sie keine Ahnung haben, wie es funktioniert, was man braucht und wem man vertrauen kann.
                </p>
                <p className="font-bold text-charcoal">
                  Genau hier setzt KryptoKompass an. Wir nehmen dich an die Hand.
                </p>
                <p>
                  Wir sind keine Investment-Berater und wir wollen nicht dein Geld verwalten. Wir sind Lehrer. Wir erklären dir die Technologie, die Wallets und die Strategien, damit DU die Kontrolle über deine finanzielle Zukunft übernimmst.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-2 gap-4">
              <FadeIn delay={0.2} scale blur className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000&auto=format&fit=crop" alt="Crypto 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </FadeIn>
              <FadeIn delay={0.4} scale blur className="aspect-square rounded-3xl overflow-hidden shadow-2xl mt-12">
                <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" alt="Crypto 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Glassmorphism Features */}
      <section className="py-24 md:py-32 relative px-6 overflow-hidden bg-gray-50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-hermes/5 blur-[120px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn scale blur>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[#0A0B0D]">
                Dein Lehrplan für <span className="text-hermes">maximale Souveränität.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-gray-600 leading-relaxed">
                Vom absoluten Anfänger zum Krypto-Kenner. Wir begleiten dich Schritt für Schritt durch den Dschungel.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BrainCircuit className="w-10 h-10 text-hermes" />,
                title: "Grundlagen-Mastery",
                desc: "Was ist eine Blockchain? Wie funktionieren Transaktionen? Wir erklären es so, dass es jeder versteht."
              },
              {
                icon: <Users className="w-10 h-10 text-hermes" />,
                title: "Community-Support",
                desc: "Du bist nie allein. Unsere Gemeinschaft hilft sich gegenseitig bei jeder Hürde und jeder Frage."
              },
              {
                icon: <BarChart3 className="w-10 h-10 text-hermes" />,
                title: "Analyse & Strategie",
                desc: "Lerne, wie man Projekte bewertet und Trends erkennt, ohne auf Hype oder Scam hereinzufallen."
              }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={0.2 * idx} direction="up" scale className="bg-white/40 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-500 group">
                <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-5 text-charcoal">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Compass Section */}
      <section className="py-24 md:py-32 px-6 bg-white overflow-hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right" blur>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight text-[#0A0B0D]">
                Dein <span className="text-hermes">Kompass</span> im <br /> Krypto-Dschungel.
              </h2>
              <p className="text-2xl text-gray-800 font-bold mb-8">
                Präzise Orientierung in einem volatilen Markt.
              </p>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed mb-10">
                <p>
                  Egal ob Bitcoin, Ethereum oder Solana – wir geben dir die Werkzeuge an die Hand, um die Richtung des Marktes zu verstehen. Kein Raten mehr, keine Angst vor dem Unbekannten.
                </p>
                <p>
                  Unsere Anleitungen sind darauf ausgelegt, dir Sicherheit zu geben. Wir zeigen dir nicht nur, wo es langgeht, sondern warum der Markt sich so bewegt, wie er es tut.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-bold text-gray-500">Über 500+ Mitglieder navigieren bereits mit uns.</p>
              </div>
            </FadeIn>
            
            <FadeIn direction="left" scale delay={0.3} className="flex justify-center">
              <InteractiveCompass />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-24 md:py-32 bg-gray-50 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right" scale>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight text-[#0A0B0D]">
                Lernen auf <br /> <span className="text-hermes">höchstem Niveau.</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 font-medium leading-relaxed">
                Vergiss unübersichtliche Chats. Unsere Plattform ist dein digitales Klassenzimmer. Strukturiert, modern und jederzeit erreichbar.
              </p>
              <div className="space-y-4 mb-12">
                {["Exklusive Video-Tutorials", "Tägliche Markt-Updates", "Interaktive Lernmodule", "Direkter Community-Austausch"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg font-bold text-charcoal">
                    <div className="w-6 h-6 rounded-full bg-hermes flex items-center justify-center">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <a href="#pricing" className="inline-flex items-center gap-3 bg-hermes text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-hermes-dark transition-all duration-300">
                Plattform entdecken <ArrowRight size={22} />
              </a>
            </FadeIn>
            
            <FadeIn direction="left" blur delay={0.4} className="relative">
              <img 
                src="https://s1.directupload.eu/images/260226/oczij49d.jpg" 
                alt="KryptoKompass Plattform" 
                className="w-full h-auto rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section id="mindset" className="py-24 md:py-32 px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <FadeIn direction="down" blur>
              <h2 className="text-4xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight text-[#0A0B0D]">
                Warum du dich uns <br /> <span className="text-hermes">anschließen solltest.</span>
              </h2>
            </FadeIn>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 text-xl text-gray-600 leading-relaxed">
              <FadeIn delay={0.2} direction="right">
                <p>
                  Wenn du wirklich keine Ahnung hast, was Krypto ist und wie das funktioniert, aber es verstehen und lernen willst, dann bist du bei uns genau richtig.
                </p>
              </FadeIn>
              
              <FadeIn delay={0.4} scale>
                <div className="bg-hermes/5 p-10 rounded-[3rem] border border-hermes/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-hermes/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                  <p className="leading-relaxed mb-8 italic text-charcoal font-bold text-2xl">
                    "Erhalte kostenlos und ohne Investment-Zwang Anleitungen, wie du dich im Kryptodschungel zurechtfindest."
                  </p>
                  <p className="leading-relaxed text-hermes font-black text-xl">
                    Lass dich von uns an die Hand nehmen. Wir geben dir die genaue Richtung und Anleitung, wie auch du von Krypto profitieren kannst.
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.6} direction="up">
                <p>
                  Wir helfen uns gemeinsam in einer starken Gemeinschaft. KryptoKompass erklärt dir alles Schritt für Schritt, damit du sicher in die Zukunft starten kannst.
                </p>
              </FadeIn>
            </div>

            <FadeIn direction="left" blur delay={0.4} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-hermes/30 to-transparent rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop" 
                alt="Crypto Future Vision" 
                className="rounded-[3rem] shadow-2xl object-cover aspect-square md:aspect-[4/3] w-full hover:scale-[1.02] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-40 bg-charcoal px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-hermes/40 blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn scale blur>
              <h2 className="text-4xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight text-white">
                Werde Teil der <br /> <span className="text-hermes">Zukunft.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <p className="text-xl text-gray-400 leading-relaxed">
                Wähle den Zugang, der zu deinen Zielen passt. Alle Pläne beinhalten den vollen Zugriff auf unsere Lernplattform und die Community.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* Essential */}
            <FadeIn delay={0.2} direction="up" className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 flex flex-col hover:bg-white/10 transition-all duration-500">
              <h3 className="text-2xl font-bold mb-2 text-white">Basis-Zugang</h3>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">€199</span>
                <span className="text-gray-400 text-lg block mt-1 font-medium">Einmalig / Monat</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow text-gray-300">
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Voller Plattform-Zugriff</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Community-Austausch</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Alle Grundlagen-Module</li>
              </ul>
              <button className="w-full py-4 rounded-lg bg-[#0A0B0D] text-white font-bold text-lg hover:bg-hermes transition-all duration-300">
                Jetzt starten
              </button>
            </FadeIn>

            {/* Mastery (Highlighted) */}
            <FadeIn delay={0.4} scale className="bg-white rounded-[3rem] p-12 border-4 border-hermes shadow-[0_0_60px_rgba(243,112,33,0.3)] relative lg:scale-110 z-10 flex flex-col">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-hermes text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-xl">
                Meistgewählt
              </div>
              <h3 className="text-2xl font-bold mb-2 text-charcoal mt-2">Jahres-Mastery</h3>
              <div className="mb-8">
                <span className="text-6xl font-black text-charcoal">€1.290</span>
                <span className="text-gray-500 text-lg block mt-1 font-medium">Pro Jahr</span>
              </div>
              <p className="text-hermes font-black mb-8 bg-hermes/10 py-3 px-6 rounded-2xl text-center">Spare über 45% gegenüber Einzelmonaten</p>
              <ul className="space-y-4 mb-10 flex-grow text-gray-600 font-medium">
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Alles aus dem Basis-Zugang</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Exklusive Deep-Dive Webinare</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Priorisierter Support</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Zertifikat nach Abschluss</li>
              </ul>
              <button className="w-full py-4 rounded-lg bg-hermes text-white font-bold text-xl hover:bg-hermes-dark transition-all duration-300">
                Meisterschaft wählen
              </button>
            </FadeIn>

            {/* Elite */}
            <FadeIn delay={0.6} direction="up" className="bg-white/5 backdrop-blur-md rounded-[3rem] p-10 border border-white/10 flex flex-col hover:bg-white/10 transition-all duration-500">
              <h3 className="text-2xl font-bold mb-2 text-white">Halbjahres-Fokus</h3>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">€790</span>
                <span className="text-gray-400 text-lg block mt-1 font-medium">6 Monate</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow text-gray-300">
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Voller Plattform-Zugriff</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Community-Austausch</li>
                <li className="flex items-center gap-3"><ArrowRight size={16} className="text-hermes" /> Bonus: Wallet-Sicherheits-Guide</li>
              </ul>
              <button className="w-full py-4 rounded-lg border-2 border-white/20 text-white font-bold text-lg hover:bg-white hover:text-charcoal transition-all duration-300">
                Fokus-Plan wählen
              </button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-bold text-2xl tracking-tight">Krypto<span className="text-hermes">Kompass</span></span>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              Die Nummer 1 Krypto Schule in Deutschland, Österreich und der Schweiz. Lerne die Welt der Kryptowährungen verstehen und profitiere gemeinsam in einer starken Community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hermes transition-colors duration-300 hover:scale-110">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hermes transition-colors duration-300 hover:scale-110">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-hermes transition-colors duration-300 hover:scale-110">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 text-lg">Support</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="#" className="hover:text-hermes transition-colors">Kontakt</a></li>
              <li><a href="#" className="hover:text-hermes transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-hermes transition-colors">AGB</a></li>
              <li><a href="#" className="hover:text-hermes transition-colors">Datenschutz</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg">Über uns</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="#" className="hover:text-hermes transition-colors">Unsere Geschichte</a></li>
              <li><a href="#" className="hover:text-hermes transition-colors">Regulatorische Richtlinien</a></li>
              <li><a href="#" className="hover:text-hermes transition-colors">Cookie-Richtlinie</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} KryptoKompass. Alle Rechte vorbehalten.</p>
          <p>Entwickelt für die Zukunft.</p>
        </div>
      </footer>
    </div>
  );
}
