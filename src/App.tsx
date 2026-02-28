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
          <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" alt="Bitcoin" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute right-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img src="https://assets.coingecko.com/coins/images/279/large/ethereum.png" alt="Ethereum" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute bottom-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img src="https://assets.coingecko.com/coins/images/4128/large/solana.png" alt="Solana" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
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
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-white/95 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="font-bold text-2xl tracking-tight text-[#0A0B0D]">Krypto<span className="text-hermes">Kompass</span></span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
            <a href="#features" className="hover:text-hermes transition-colors">Leistungen</a>
            <a href="#mindset" className="hover:text-hermes transition-colors">Mindset</a>
            <a href="#faq" className="hover:text-hermes transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a href="#login" className="text-sm font-medium text-gray-600 hover:text-charcoal transition-colors">Digitales Klassenzimmer</a>
            <a href="#start" className="bg-hermes text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-hermes-dark transition-all duration-300">
              Jetzt kostenlos starten
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
            <a href="#faq" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <div className="h-px bg-gray-100 w-full my-2"></div>
            <a href="#login" onClick={() => setMobileMenuOpen(false)}>Digitales Klassenzimmer</a>
            <a href="#start" onClick={() => setMobileMenuOpen(false)} className="bg-hermes text-white px-6 py-3 rounded-lg text-center mt-4 font-bold">Jetzt kostenlos starten</a>
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
              className="hidden md:block w-full h-full object-contain object-right opacity-100"
              referrerPolicy="no-referrer"
            />
            {/* Cleaner gradient overlay for readability */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent md:from-white/80 md:via-white/20 md:to-transparent"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-2xl">
            <FadeIn blur scale className="mb-6">
              <span className="inline-flex items-center gap-2 text-hermes font-bold text-sm uppercase tracking-wider">
                Die führende Krypto-Schule im D-A-CH Raum
              </span>
            </FadeIn>
            
            <FadeIn blur scale delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] md:leading-[0.9] mb-6 text-[#0A0B0D] break-words sm:break-normal">
                Dein Wegweiser zur <br className="hidden sm:block" />
                <span className="text-hermes font-serif italic font-medium tracking-normal">finanziellen Freiheit.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.4} direction="right">
              <div className="text-base sm:text-lg md:text-xl text-gray-600 font-medium leading-relaxed mb-8 max-w-xl space-y-4">
                <p>
                  Der Kryptomarkt bietet historische Chancen. Wir zeigen dir, wie du sie nutzt.
                </p>
                <p className="font-bold text-charcoal text-2xl">
                  Ohne Vorwissen. Ohne Stress. Mit System.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.6} className="flex flex-col sm:flex-row items-center justify-start gap-4">
              <a href="#start" className="w-full sm:w-auto bg-hermes text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-hermes-dark transition-all duration-300 text-center">
                Jetzt kostenlos starten
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
          <div className="flex flex-col sm:flex-row flex-wrap justify-center md:justify-between items-start sm:items-center gap-6 md:gap-4">
            <FadeIn direction="right" className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-hermes/10 border border-hermes/20 flex items-center justify-center flex-shrink-0">
                <X className="text-hermes" size={20} />
              </div>
              <span className="text-white font-black tracking-widest text-xs sm:text-sm md:text-base">KEIN COACHING-ZIRKUS</span>
            </FadeIn>
            <FadeIn direction="right" delay={0.1} className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-hermes/10 border border-hermes/20 flex items-center justify-center flex-shrink-0">
                <X className="text-hermes" size={20} />
              </div>
              <span className="text-white font-black tracking-widest text-xs sm:text-sm md:text-base">KEINE INVESTMENTANNAHME</span>
            </FadeIn>
            <FadeIn direction="right" delay={0.2} className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-hermes/10 border border-hermes/20 flex items-center justify-center flex-shrink-0">
                <X className="text-hermes" size={20} />
              </div>
              <span className="text-white font-black tracking-widest text-xs sm:text-sm md:text-base">KEIN "WIR HANDELN FÜR DICH"</span>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The Vision Section */}
      <section id="features" className="py-24 md:py-32 relative px-6 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" blur>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.1] md:leading-none text-[#0A0B0D] break-words sm:break-normal">
                Deine Abkürzung zum <span className="text-hermes font-serif italic font-medium tracking-normal">Krypto-Erfolg.</span>
              </h2>
              <div className="space-y-6 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                <p>
                  Keine graue Theorie. Keine falschen Versprechen.
                </p>
                <p>
                  Wir liefern dir <span className="font-bold text-charcoal">100% anwendbare Praxis</span>, damit du sofort durchstarten kannst.
                </p>
                <p className="font-black text-hermes text-3xl mt-8">
                  Dein Vorsprung beginnt hier.
                </p>
              </div>
            </FadeIn>
            
            <div className="grid grid-cols-2 gap-4">
              <FadeIn delay={0.2} scale blur className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1000&auto=format&fit=crop" alt="Crypto 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </FadeIn>
              <FadeIn delay={0.4} scale blur className="aspect-square rounded-3xl overflow-hidden shadow-2xl mt-12">
                <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1000&auto=format&fit=crop" alt="Crypto 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
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
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 tracking-tighter leading-[1.1] md:leading-none text-[#0A0B0D] break-words sm:break-normal">
                Was dich <span className="text-hermes font-serif italic font-medium tracking-normal">erwartet.</span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Alles, was du brauchst, um im Kryptomarkt durchzustarten.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BrainCircuit className="w-10 h-10 text-hermes" />,
                title: "Klarheit statt Chaos",
                desc: "Verstehe den Markt in Rekordzeit. Wir filtern den Lärm und zeigen dir, was wirklich zählt."
              },
              {
                icon: <BarChart3 className="w-10 h-10 text-hermes" />,
                title: "Strategien der Profis",
                desc: "Investiere mit System, nicht nach Gefühl. Erlerne bewährte Methoden für nachhaltigen Erfolg."
              },
              {
                icon: <PlaySquare className="w-10 h-10 text-hermes" />,
                title: "Insider-Insights",
                desc: "Erkenne Trends, bevor sie Mainstream werden und positioniere dich frühzeitig."
              },
              {
                icon: <Users className="w-10 h-10 text-hermes" />,
                title: "Starke Community",
                desc: "Profitiere vom Wissen und Netzwerk von über 500+ gleichgesinnten Mitgliedern."
              }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={0.2 * idx} direction="up" scale className="bg-white/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] hover:-translate-y-3 transition-all duration-500 group flex flex-col">
                <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-white group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-charcoal">{feature.title}</h3>
                <p className="text-gray-600 font-medium text-sm flex-grow">{feature.desc}</p>
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
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.1] md:leading-tight text-[#0A0B0D] break-words sm:break-normal">
                Volle <span className="text-hermes font-serif italic font-medium tracking-normal">Kontrolle.</span>
              </h2>
              <div className="space-y-6 text-base sm:text-lg text-gray-600 leading-relaxed mb-10">
                <p className="font-bold text-charcoal text-2xl">
                  Du triffst die Entscheidungen.<br />Wir zeigen dir den Weg.
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-md">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" referrerPolicy="no-referrer" />
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
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[1.1] md:leading-tight text-[#0A0B0D] break-words sm:break-normal">
                Alles, was du brauchst, <br className="hidden sm:block" /> <span className="text-hermes font-serif italic font-medium tracking-normal">an einem Ort.</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 font-medium leading-relaxed">
                Premium-Inhalte, interaktive Tools und eine Community, die dich voranbringt. Starte jetzt und sichere dir deinen Vorsprung.
              </p>
              <div className="space-y-4 mb-12">
                {["Exklusive Video-Masterclasses", "Live Markt-Analysen", "1-zu-1 Support", "Premium Community Zugang"].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-lg font-bold text-charcoal">
                    <div className="w-6 h-6 rounded-full bg-hermes flex items-center justify-center flex-shrink-0">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <a href="#start" className="inline-flex items-center gap-3 bg-hermes text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-hermes-dark transition-all duration-300">
                Jetzt Zugang sichern <ArrowRight size={22} />
              </a>
            </FadeIn>
            
            <FadeIn direction="left" blur delay={0.4} className="relative">
              <img 
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_2zg6kRsQgLvpBAc5mmGVtMaqZi0%2Fhf_20260225_203429_79b3f6a2-76c7-445b-990c-d52bcc2be55c.jpeg&w=1280&q=85" 
                alt="KryptoKompass Plattform" 
                className="w-full h-auto rounded-3xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section (Replaces Pricing) */}
      <section id="start" className="py-24 md:py-40 bg-charcoal px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-hermes/40 blur-[150px]"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <FadeIn scale blur>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-white break-words sm:break-normal">
              Bereit für den <br className="hidden sm:block" /> <span className="text-hermes font-serif italic font-medium tracking-normal">nächsten Schritt?</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl mx-auto">
              Sichere dir jetzt deinen kostenlosen Zugang und beginne deine Reise zu mehr Souveränität und Marktverständnis im Krypto-Space.
            </p>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Deine E-Mail Adresse" 
                className="px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-hermes flex-grow"
                required
              />
              <button type="submit" className="bg-hermes text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-hermes-dark transition-all duration-300 whitespace-nowrap">
                Kostenlos starten
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-6">Kein Spam. Jederzeit abmeldbar.</p>
          </FadeIn>
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
