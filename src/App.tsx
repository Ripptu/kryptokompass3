import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  BrainCircuit, 
  PlaySquare, 
  Users, 
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Instagram,
  Twitter,
  Youtube,
  ChevronDown,
  Check,
  Shield,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Award
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "", direction = "up", scale = false, blur = false }: any) => {
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset, scale: scale ? 0.95 : 1 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

const InteractiveCompass = () => {
  const compassRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const prevAngleRef = useRef(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!compassRef.current) {
            ticking = false;
            return;
          }
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
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 w-full">
      <div 
        ref={compassRef}
        className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-bg-surface shadow-none md:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.05)] border-[1px] border-border-strong flex items-center justify-center ring-1 ring-brand-primary/20"
      >
        {/* Inner dial */}
        <div className="absolute inset-2 rounded-full bg-bg-elevated shadow-inner border border-border-subtle"></div>
        
        {/* Ticks */}
        <div className="absolute inset-4 rounded-full opacity-20" style={{ background: 'repeating-conic-gradient(from 0deg, transparent 0deg, transparent 2deg, rgba(255,255,255,0.2) 2deg, rgba(255,255,255,0.2) 3deg)' }}></div>
        <div className="absolute inset-8 rounded-full bg-bg-surface shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]"></div>

        {/* Labels */}
        <div className="absolute top-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-none md:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <img src="https://assets.coingecko.com/coins/images/1/large/bitcoin.png" alt="Bitcoin" className="w-full h-full object-contain opacity-80" referrerPolicy="no-referrer" loading="lazy" />
        </div>
        <div className="absolute right-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-none md:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <img src="https://assets.coingecko.com/coins/images/279/large/ethereum.png" alt="Ethereum" className="w-full h-full object-contain opacity-80" referrerPolicy="no-referrer" loading="lazy" />
        </div>
        <div className="absolute bottom-4 w-10 h-10 md:w-14 md:h-14 drop-shadow-none md:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <img src="https://assets.coingecko.com/coins/images/4128/large/solana.png" alt="Solana" className="w-full h-full object-contain opacity-80" referrerPolicy="no-referrer" loading="lazy" />
        </div>
        <div className="absolute left-6 font-mono font-bold text-4xl md:text-5xl text-text-secondary drop-shadow-none md:drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">?</div>

        {/* Needle */}
        <div 
          className="absolute w-8 h-[85%] z-10 flex flex-col items-center justify-center transition-transform duration-100 ease-out drop-shadow-none md:drop-shadow-2xl will-change-transform"
          style={{ transform: `rotate(${currentRotation}deg)` }}
        >
          {/* North pointing needle (Brand Primary) */}
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-b-[110px] md:border-b-[160px] border-l-transparent border-r-transparent border-b-brand-primary relative">
            <div className="absolute -left-[12px] top-0 w-[12px] h-[110px] md:h-[160px] bg-black/40 skew-y-[85deg] origin-bottom"></div>
          </div>
          {/* South pointing needle (Dark) */}
          <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[110px] md:border-t-[160px] border-l-transparent border-r-transparent border-t-text-muted relative">
            <div className="absolute -left-[12px] bottom-0 w-[12px] h-[110px] md:h-[160px] bg-black/40 -skew-y-[85deg] origin-top"></div>
          </div>
        </div>

        {/* Center Pin */}
        <div className="absolute w-10 h-10 rounded-full bg-bg-elevated shadow-none md:shadow-[0_4px_10px_rgba(0,0,0,0.8)] z-20 border border-border-strong">
          <div className="absolute inset-2 rounded-full bg-bg-base"></div>
        </div>
      </div>
    </div>
  );
};

const AccordionItem = ({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-border-subtle">
      <button 
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-lg font-medium text-text-primary group-hover:text-brand-primary transition-colors">{question}</span>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center flex-shrink-0 ml-4 group-hover:border-brand-primary/50"
        >
          <ChevronDown size={16} className="text-text-secondary group-hover:text-brand-primary" />
        </motion.div>
      </button>
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-6 text-text-secondary leading-relaxed pr-12">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

const impressumContent = (
  <>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">Angaben gemäß § 5 TMG</h2>
    <p>Max Mustermann<br />Musterstraße 1<br />12345 Musterstadt</p>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">Kontakt</h2>
    <p>Telefon: +49 (0) 123 44 55 66<br />E-Mail: info@musterstadt.de</p>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">Umsatzsteuer-ID</h2>
    <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />DE999999999</p>
  </>
);

const datenschutzContent = (
  <>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">1. Datenschutz auf einen Blick</h2>
    <h3 className="text-xl font-medium text-text-primary mt-6 mb-2">Allgemeine Hinweise</h3>
    <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>
    <h3 className="text-xl font-medium text-text-primary mt-6 mb-2">Datenerfassung auf dieser Website</h3>
    <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle“ in dieser Datenschutzerklärung entnehmen.</p>
  </>
);

const agbContent = (
  <>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">1. Geltungsbereich</h2>
    <p>Für alle Bestellungen über unseren Online-Shop durch Verbraucher und Unternehmer gelten die nachfolgenden AGB.</p>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">2. Vertragspartner, Vertragsschluss</h2>
    <p>Der Kaufvertrag kommt zustande mit KryptoKompass. Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar.</p>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">3. Vertragssprache, Vertragstextspeicherung</h2>
    <p>Die für den Vertragsschluss zur Verfügung stehende Sprache ist Deutsch. Wir speichern den Vertragstext und senden Ihnen die Bestelldaten und unsere AGB per E-Mail zu.</p>
  </>
);

const risikohinweisContent = (
  <>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">1. Allgemeine Risiken</h2>
    <p>Der Handel mit Kryptowährungen birgt ein hohes Risiko und kann zum vollständigen Verlust Ihres eingesetzten Kapitals führen. Die bereitgestellten Informationen stellen keine Anlageberatung dar.</p>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">2. Keine Finanzberatung</h2>
    <p>Alle Inhalte auf dieser Website dienen ausschließlich Informations- und Bildungszwecken. Sie sollten nicht als finanzielle, rechtliche oder steuerliche Beratung verstanden werden.</p>
    <h2 className="text-2xl font-medium text-text-primary mt-8 mb-4">3. Volatilität</h2>
    <p>Kryptowährungsmärkte sind extrem volatil. Preise können innerhalb kürzester Zeit stark schwanken. Investieren Sie nur Geld, dessen Verlust Sie sich leisten können.</p>
  </>
);

const LegalPage = ({ title, content, onBack }: { title: string, content: React.ReactNode, onBack: () => void }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="pt-32 pb-24 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn direction="down" className="mb-12">
          <button 
            onClick={(e) => { e.preventDefault(); onBack(); }}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors font-medium bg-bg-surface px-4 py-2 rounded-full border border-border-subtle shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={16} />
            Zurück zur Startseite
          </button>
        </FadeIn>
        
        <FadeIn blur>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary mb-12">
            {title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.2} direction="up" className="space-y-6 text-lg text-text-secondary font-light leading-relaxed glass-panel p-8 md:p-12 rounded-3xl border border-border-subtle">
          {content}
        </FadeIn>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'impressum' | 'datenschutz' | 'agb' | 'risikohinweis'>('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Only update state if values actually changed to prevent re-renders
          setIsScrolled(prev => prev !== (currentScrollY > 20) ? (currentScrollY > 20) : prev);

          if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
            setIsVisible(prev => prev !== false ? false : prev);
          } else {
            setIsVisible(prev => prev !== true ? true : prev);
          }
          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      question: "Brauche ich Vorwissen oder Startkapital?",
      answer: "Nein. Unser System ist so aufgebaut, dass du bei null starten kannst. Wir zeigen dir Schritt für Schritt, wie du den Markt verstehst und mit ersten kleinen Beträgen sicher agierst, bevor du skalierst."
    },
    {
      question: "Wie viel Zeit muss ich wöchentlich investieren?",
      answer: "Etwa 2-3 Stunden pro Woche reichen aus, um die Inhalte zu verinnerlichen und die Strategien umzusetzen. Die Plattform ist 24/7 verfügbar, du lernst in deinem eigenen Tempo."
    },
    {
      question: "Ist das wieder nur eine 'Schnell-Reich-Werden' Gruppe?",
      answer: "Absolut nicht. Wir lehnen riskantes Trading und unrealistische Versprechen ab. KryptoKompass steht für datenbasierte Entscheidungen, Risikomanagement und langfristigen Vermögensaufbau."
    },
    {
      question: "Gibt es persönlichen Support, wenn ich feststecke?",
      answer: "Ja. Neben der aktiven Community bieten wir regelmäßige Live-Q&As und direkten Support durch unsere Experten an. Du wirst auf deinem Weg nicht alleingelassen."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans overflow-x-hidden selection:bg-brand-primary/30 selection:text-white">
      {/* Navbar */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${isVisible || currentPage !== 'home' ? 'translate-y-0' : '-translate-y-full'} ${(isScrolled || currentPage !== 'home') ? 'bg-bg-base/80 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <span className="font-bold text-xl tracking-tight text-text-primary">Krypto<span className="text-brand-primary">Kompass</span></span>
          </div>
          
          {currentPage === 'home' ? (
            <>
              <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-text-secondary">
                <a href="#system" className="hover:text-brand-primary transition-colors">System</a>
                <a href="#features" className="hover:text-brand-primary transition-colors">Architektur</a>
                <a href="#faq" className="hover:text-brand-primary transition-colors">FAQ</a>
              </nav>

              <div className="hidden md:flex items-center gap-6">
                <a href="#login" className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Digitales Klassenzimmer</a>
                <a href="#start" className="bg-text-primary text-bg-base px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-text-secondary transition-all duration-300 shadow-md hover:shadow-lg">
                  Zugang anfragen
                </a>
              </div>

              <button className="md:hidden text-text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => setCurrentPage('home')} className="text-sm font-medium text-text-secondary hover:text-brand-primary transition-colors">Zurück zur Startseite</button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && currentPage === 'home' && (
        <div className="fixed inset-0 z-40 bg-bg-base pt-24 px-6 md:hidden border-b border-border-subtle">
          <nav className="flex flex-col gap-6 text-lg font-medium">
            <a href="#system" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-brand-primary">System</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-brand-primary">Architektur</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-brand-primary">FAQ</a>
            <div className="h-px bg-border-subtle w-full my-2"></div>
            <a href="#login" onClick={() => setMobileMenuOpen(false)} className="text-text-secondary hover:text-brand-primary">Digitales Klassenzimmer</a>
            <a href="#start" onClick={() => setMobileMenuOpen(false)} className="bg-text-primary text-bg-base px-6 py-3 rounded-full text-center mt-4 font-semibold shadow-md">Zugang anfragen</a>
          </nav>
        </div>
      )}

      {currentPage === 'home' ? (
        <>
          {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden min-h-[70vh] flex flex-col justify-center border-b border-border-subtle">
        {/* Hero Image as Background */}
        <div className="absolute inset-0 z-0 pointer-events-none flex justify-end opacity-30 md:opacity-100">
          <img 
            src="https://s1.directupload.eu/images/260226/reta6zp3.webp" 
            alt="KryptoKompass Dashboard" 
            className="w-full md:w-4/5 lg:w-2/3 xl:w-3/5 h-full object-contain object-right transform scale-[1.65] lg:scale-150 origin-right"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
          />
          {/* Gradients to ensure text readability without washing out the image */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-base via-bg-base/90 to-transparent w-full md:w-2/3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full px-6 relative z-10 flex flex-col items-start text-left">
            <FadeIn blur delay={0.1}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05] mb-8 text-text-primary max-w-3xl">
                Die Nummer 1 <br />
                <span className="text-brand-primary font-serif italic">Krypto Schule</span> <br />
                <span className="text-3xl sm:text-4xl md:text-5xl text-text-secondary mt-4 block">in Deutschland/Schweiz/Österreich</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="mb-10 max-w-2xl w-full">
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl text-text-primary font-medium mb-4 leading-snug">
                    Erst Krypto lernen und verstehen, <br className="hidden sm:block" />
                    <span className="text-brand-primary">dann investieren und profitieren.</span>
                  </h3>
                  <p className="text-base md:text-lg text-text-secondary leading-relaxed mb-5">
                    Wir sind eine Community für Krypto-Einsteiger und Neulinge.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-text-secondary">
                      <div className="mt-1 w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-brand-primary" />
                      </div>
                      <span className="text-base">Lerne von Profis und tausche dich aus mit unseren Schülern.</span>
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                      <div className="mt-1 w-5 h-5 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-brand-primary" />
                      </div>
                      <span className="text-base">Gemeinsam zu erfolgreichem Krypto-Wissen durch klare Navigation durch den Krypto-Dschungel.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface border border-border-strong text-sm font-medium text-text-primary shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center"><X size={12} className="text-red-500" /></div>
                      Kein Coaching
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface border border-border-strong text-sm font-medium text-text-primary shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center"><X size={12} className="text-red-500" /></div>
                      Kein Investment
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-surface border border-border-strong text-sm font-medium text-text-primary shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center"><X size={12} className="text-red-500" /></div>
                      Kein Scam
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-medium text-emerald-600 shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><Check size={12} className="text-emerald-600" /></div>
                      KryptoKompass ist eine Kryptoschule & Community
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-sm font-medium text-brand-primary shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center"><Shield size={12} className="text-brand-primary" /></div>
                      Du hast die komplette Kontrolle
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-start gap-4 w-full sm:w-auto mt-8">
              <a href="#start" className="w-full sm:w-auto bg-brand-primary text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-brand-secondary transition-all duration-300 text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Kostenlose Einschulung starten
              </a>
            </FadeIn>
            
            <FadeIn delay={0.5} className="mt-12 flex items-center justify-start gap-6 border-t border-border-subtle pt-8 w-full max-w-md">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-base bg-bg-surface overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Member" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-text-primary font-medium text-sm">500+ verifizierte Mitglieder</span>
                <span className="text-text-muted text-xs">Im D-A-CH Raum</span>
              </div>
            </FadeIn>
          </div>
      </section>

      {/* Architecture Section (Moved from Popup) */}
      <section className="py-24 bg-bg-base relative border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <FadeIn blur className="text-center mb-16">
            <span className="micro-label text-brand-primary mb-4 block">Architektur</span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary mb-4">
              Dein klarer <span className="font-serif italic text-text-secondary">Ausbildungsweg.</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Du entwickelst dich Schritt für Schritt, mit klarer Struktur statt Chaos. 
              Vier aufeinander aufbauende Module für deinen Krypto-Erfolg.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <FadeIn delay={0.1} direction="up" className="bg-bg-surface border border-border-subtle p-8 rounded-[2rem] hover:border-brand-primary/50 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border-strong flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <BookOpen className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2 relative z-10">1. Grundlagen</h3>
              <p className="text-sm text-text-secondary mb-6 h-10 relative z-10">Das Fundament für deinen sicheren Start in die Kryptowelt.</p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Bitcoin & Blockchain</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Wallets richtig nutzen</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Börsen verstehen</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Marktmechaniken</li>
              </ul>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={0.2} direction="up" className="bg-bg-surface border border-border-subtle p-8 rounded-[2rem] hover:border-brand-primary/50 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border-strong flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <TrendingUp className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2 relative z-10">2. Strategie</h3>
              <p className="text-sm text-text-secondary mb-6 h-10 relative z-10">Lerne den Markt zu lesen und Muster zu erkennen.</p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Chart-Lesen & Zyklen</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Support & Resistance</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Marktstruktur</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Liquidität verstehen</li>
              </ul>
            </FadeIn>

            {/* Card 3 */}
            <FadeIn delay={0.3} direction="up" className="bg-bg-surface border border-border-subtle p-8 rounded-[2rem] hover:border-brand-primary/50 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border-strong flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <ShieldCheck className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2 relative z-10">3. Sicherheit</h3>
              <p className="text-sm text-text-secondary mb-6 h-10 relative z-10">Kapitalerhalt durch striktes Risiko- und Mindset-Management.</p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Risk-Management</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Emotionale Kontrolle</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Kapital-Management</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Positionsgrößen</li>
              </ul>
            </FadeIn>

            {/* Card 4 */}
            <FadeIn delay={0.4} direction="up" className="bg-bg-surface border border-border-subtle p-8 rounded-[2rem] hover:border-brand-primary/50 transition-all duration-500 group relative overflow-hidden shadow-sm hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-500"></div>
              <div className="w-14 h-14 rounded-2xl bg-bg-elevated border border-border-strong flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-sm relative z-10">
                <Award className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-xl font-medium text-text-primary mb-2 relative z-10">4. Meisterschaft</h3>
              <p className="text-sm text-text-secondary mb-6 h-10 relative z-10">Werde zum unabhängigen Architekten deines Portfolios.</p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Advanced Strategien</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Eigenständige Analyse</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Portfolio-Aufbau</li>
                <li className="flex items-center gap-3 text-sm text-text-secondary"><div className="w-1.5 h-1.5 rounded-full bg-brand-primary/50"></div> Elite Netzwerk</li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The System Section */}
      <section id="system" className="py-24 md:py-32 relative px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right" blur>
              <span className="micro-label text-brand-primary mb-4 block">Die Methodik</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 tracking-tight leading-[1.1] text-text-primary">
                Logik schlägt <span className="font-serif italic text-text-secondary">Emotion.</span>
              </h2>
              <div className="space-y-6 text-lg text-text-secondary font-light leading-relaxed">
                <p className="font-medium text-text-primary">Bei uns stehst du im Fokus.</p>
                <p>
                  Wir sind überzeugt, dass nachhaltiger Erfolg im Kryptobereich aus der richtigen Kombination von Wissen, klarer Strategie und mentaler Stärke entsteht.
                </p>
                <p>
                  Unser Ziel ist es, dich nicht einfach mit einzelnen Tools auszustatten, sondern dir ein ganzheitliches System zu vermitteln, das:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>dir hilft, Risiken im Kryptomarkt besser zu verstehen</li>
                  <li>deine Entscheidungen fundierter und sicherer macht</li>
                  <li>deine Möglichkeiten im Umgang mit digitalen Assets erweitert</li>
                </ul>
                <p>
                  Und das ganz ohne leere Versprechen oder unrealistische Renditen —<br />
                  sondern mit einem klaren, strukturierten Weg zu echtem Verständnis und selbstbestimmtem Handeln im Kryptobereich.
                </p>
              </div>
            </FadeIn>
            
            <div className="relative">
              <FadeIn delay={0.2} scale blur className="glass-panel rounded-3xl overflow-hidden aspect-[4/3] relative">
                <img src="https://s1.directupload.eu/images/260302/ae76asy8.png" alt="Data Analysis" className="w-full h-full object-cover opacity-80 mix-blend-multiply" referrerPolicy="no-referrer" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent"></div>
                
                {/* Overlay UI Element */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-xl p-4 flex items-center justify-between bg-white/90">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center border border-border-subtle">
                      <BarChart3 size={20} className="text-text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">Market Structure</div>
                      <div className="text-xs text-text-muted font-mono">Analysis Complete</div>
                    </div>
                  </div>
                  <div className="text-emerald-500 font-mono text-sm font-medium">Optimal</div>
                </div>
              </FadeIn>
            </div>
          </div>

          <FadeIn direction="up" delay={0.4} className="mt-24 max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-medium text-text-primary mb-8">
              Die Krypto Kompass Schule steht für Klarheit in einer Welt voller Unsicherheit.
            </h3>
            <div className="space-y-6 text-lg text-text-secondary font-light leading-relaxed">
              <p>
                Wir begleiten dich Schritt für Schritt durch die Grundlagen von Bitcoin, Blockchain und digitalen Vermögenswerten — mit einem strukturierten Ansatz, der dir hilft, den Kryptomarkt wirklich zu verstehen, statt ihm nur zu folgen.
              </p>
              <p>
                Unser Fokus liegt nicht auf kurzfristigen Trends, sondern auf echtem Wissen und nachhaltiger Kompetenz.
              </p>
              <p className="text-xl font-medium text-text-primary py-4">
                Denn langfristige Sicherheit entsteht nicht durch Hype —<br />
                sondern durch Verständnis.
              </p>
              
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 text-left max-w-2xl mx-auto my-8">
                <p className="font-medium text-text-primary mb-4">Bei uns findest du:</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-primary"></div> Orientierung in einem komplexen Markt</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-primary"></div> Struktur statt Informationsflut</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-primary"></div> Wissen, das dich unabhängig macht</li>
                </ul>
              </div>
              
              <p className="font-medium text-text-primary">
                Keine schnellen Versprechen.<br />
                Keine unrealistischen Erwartungen.
              </p>
              <p className="text-xl text-brand-primary font-medium mt-6">
                Sondern ein klarer Weg zu fundierten Entscheidungen im Kryptobereich.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 md:py-32 relative px-6 bg-bg-surface border-y border-border-subtle">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <FadeIn scale blur>
                <span className="micro-label text-brand-primary mb-4 block">Infrastruktur</span>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] text-text-primary">
                  Das Fundament deines <span className="font-serif italic text-text-secondary">Erfolgs.</span>
                </h2>
              </FadeIn>
            </div>
            <FadeIn delay={0.2} direction="left">
              <p className="text-text-secondary max-w-md">
                Wir stellen dir die Werkzeuge, das Wissen und das Netzwerk zur Verfügung, um im Markt als Architekt zu agieren, nicht als Konsument.
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <BrainCircuit className="w-6 h-6 text-brand-primary" />,
                title: "Signal vs. Noise",
                desc: "Filtere den Lärm. Lerne Marktstrukturen zu lesen und echte von falschen Ausbrüchen zu unterscheiden."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-brand-primary" />,
                title: "Risiko-Architektur",
                desc: "Kapitalerhalt steht an erster Stelle. Implementiere professionelles Risikomanagement für dein Portfolio."
              },
              {
                icon: <PlaySquare className="w-6 h-6 text-brand-primary" />,
                title: "Masterclasses",
                desc: "Hochverdichtetes Wissen in Videoform. Von den Grundlagen bis zu fortgeschrittenen On-Chain-Metriken."
              },
              {
                icon: <Users className="w-6 h-6 text-brand-primary" />,
                title: "Elite Netzwerk",
                desc: "Umgebe dich mit Akteuren, die das gleiche Ziel verfolgen. Direkter Austausch und Live-Analysen."
              }
            ].map((feature, idx) => (
              <FadeIn key={idx} delay={0.1 * idx} direction="up" className="glass-panel p-8 rounded-2xl hover:bg-white transition-colors duration-300 group shadow-sm hover:shadow-md">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium mb-3 text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Compass Section */}
      <section className="py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <FadeIn direction="right" blur>
              <span className="micro-label text-brand-primary mb-4 block">Navigation</span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 tracking-tight leading-[1.1] text-text-primary">
                Behalte die <span className="font-serif italic text-text-secondary">Orientierung.</span>
              </h2>
              <div className="space-y-6 text-lg text-text-secondary font-light leading-relaxed mb-10">
                <p>
                  Der Markt ist volatil. Ohne Kompass verlierst du dich in den Schwankungen.
                </p>
                <p className="text-text-primary font-medium">
                  Wir liefern dir die Koordinaten. Du steuerst das Schiff.
                </p>
              </div>
              
              <ul className="space-y-4 mb-10">
                {["Makroökonomische Zusammenhänge", "On-Chain Datenanalyse", "Marktpsychologie & Zyklen"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-text-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            
            <FadeIn direction="left" scale delay={0.3} className="flex justify-center">
              <InteractiveCompass />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-32 bg-bg-surface border-t border-border-subtle px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn blur className="text-center mb-16">
            <span className="micro-label text-brand-primary mb-4 block">Klarheit</span>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-text-primary">
              Häufig gestellte <span className="font-serif italic text-text-secondary">Fragen.</span>
            </h2>
          </FadeIn>

          <div className="border-t border-border-subtle">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={0.1 * index} direction="up">
                <AccordionItem 
                  question={faq.question} 
                  answer={faq.answer} 
                  isOpen={openFaqIndex === index}
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="start" className="py-24 md:py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(243, 112, 33, 0.15) 0%, rgba(243, 112, 33, 0) 70%)' }}></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center glass-panel p-12 md:p-20 rounded-[3rem] border border-border-strong bg-white/80 shadow-xl">
          <FadeIn scale blur>
            <h2 className="text-4xl md:text-6xl font-medium mb-6 tracking-tight leading-tight text-text-primary">
              Initialisiere dein <br />
              <span className="font-serif italic text-text-secondary">System-Upgrade.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2} direction="up">
            <p className="text-lg text-text-secondary font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Tritt dem exklusiven Netzwerk bei und erhalte sofortigen Zugriff auf die Architektur, die deinen Krypto-Erfolg systematisiert.
            </p>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="E-Mail Adresse eingeben" 
                className="px-6 py-4 rounded-full bg-white border border-border-strong text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 flex-grow transition-all shadow-sm"
                required
              />
              <button type="submit" className="bg-brand-primary text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-brand-secondary transition-all duration-300 whitespace-nowrap shadow-md hover:shadow-lg">
                Zugang anfragen
              </button>
            </form>
            <p className="text-xs text-text-muted mt-6 font-mono uppercase tracking-wider">Secure Connection • No Spam</p>
          </FadeIn>
        </div>
      </section>
      </>
      ) : (
        <LegalPage 
          title={currentPage === 'impressum' ? 'Impressum' : currentPage === 'datenschutz' ? 'Datenschutzerklärung' : currentPage === 'agb' ? 'Allgemeine Geschäftsbedingungen' : 'Risikohinweis'} 
          content={currentPage === 'impressum' ? impressumContent : currentPage === 'datenschutz' ? datenschutzContent : currentPage === 'agb' ? agbContent : risikohinweisContent} 
          onBack={() => setCurrentPage('home')} 
        />
      )}

      {/* Footer */}
      <footer className="bg-bg-surface border-t border-border-subtle py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-bold text-xl tracking-tight text-text-primary">Krypto<span className="text-brand-primary">Kompass</span></span>
            </div>
            <p className="text-text-secondary text-sm max-w-sm mb-8 leading-relaxed">
              Die systematische Krypto-Ausbildung für den D-A-CH Raum. Datenbasiert, transparent und fokussiert auf langfristigen Vermögensaufbau.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center hover:border-brand-primary hover:text-brand-primary text-text-secondary transition-all duration-300 bg-white">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center hover:border-brand-primary hover:text-brand-primary text-text-secondary transition-all duration-300 bg-white">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center hover:border-brand-primary hover:text-brand-primary text-text-secondary transition-all duration-300 bg-white">
                <Youtube size={16} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-sm text-text-primary uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li><a href="#system" className="hover:text-brand-primary transition-colors">System</a></li>
              <li><a href="#features" className="hover:text-brand-primary transition-colors">Architektur</a></li>
              <li><a href="#faq" className="hover:text-brand-primary transition-colors">FAQ</a></li>
              <li><a href="#login" className="hover:text-brand-primary transition-colors">Digitales Klassenzimmer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-sm text-text-primary uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-text-secondary text-sm">
              <li><button onClick={() => setCurrentPage('impressum')} className="hover:text-brand-primary transition-colors text-left">Impressum</button></li>
              <li><button onClick={() => setCurrentPage('datenschutz')} className="hover:text-brand-primary transition-colors text-left">Datenschutz</button></li>
              <li><button onClick={() => setCurrentPage('agb')} className="hover:text-brand-primary transition-colors text-left">AGB</button></li>
              <li><button onClick={() => setCurrentPage('risikohinweis')} className="hover:text-brand-primary transition-colors text-left">Risikohinweis</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border-subtle">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-xs font-mono mb-8">
            <p>&copy; {new Date().getFullYear()} KryptoKompass. All rights reserved.</p>
            <p>System Version 2.0.4</p>
          </div>
          <div className="text-center">
            <a href="http://vamela.info" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-primary transition-colors font-medium">
              <span>Website designed by</span>
              <span className="font-bold text-text-primary">VAMELA</span>
              <span className="text-brand-primary">→</span>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
