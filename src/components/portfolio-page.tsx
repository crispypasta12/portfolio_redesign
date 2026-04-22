"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Spotlight = {
  label: string;
  title: string;
  description: string;
};

type Highlight = {
  title: string;
  blurb: string;
  image: string;
};

type TechCardData = {
  title: string;
  description: string;
  tags: string[];
};

type ExperienceRole = {
  title: string;
  time: string;
  bullets: string[];
  tags: string[];
};

type ExperienceCompany = {
  company: string;
  logo: string;
  tenure: string;
  roles: ExperienceRole[];
};

type EducationItem = {
  name: string;
  logo: string;
  degree: string;
  thesis: string;
};

type Publication = {
  title: string;
  authors: string;
  venue: string;
  location: string;
  year: string;
  citations: number | null;
  doi: string | null;
  funding: string | null;
  abstract: string;
  keywords: string[];
};

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
};

const typedPhrases = [
  "I'm Raqueed - Platform & Systems Engineer",
  "4+ years building edge-to-cloud IoT infrastructure",
  "STM32 | FreeRTOS | BLE | AWS IoT | PyTest",
];

const sectionIds = ["hero", "about", "work", "publications", "experience"];

const spotlights: Spotlight[] = [
  {
    label: "// embedded",
    title: "Embedded Systems",
    description: "STM32 | FreeRTOS | BLE | Cellular | GPS",
  },
  {
    label: "// cloud",
    title: "Data & Telemetry",
    description: "AWS Athena | MQTT | Python | Pipelines",
  },
  {
    label: "// test",
    title: "Validation",
    description: "PyTest | Jenkins | HIL and lab rigs",
  },
];

const highlights: Highlight[] = [
  {
    title: "Connected Tools Platform",
    blurb:
      "Fleet-aware firmware plus secure device-to-cloud patterns across BLE, Cellular, Wi-Fi, MQTT, and HTTPS.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF5843",
  },
  {
    title: "HIL & Validation",
    blurb:
      "PyTest, Jenkins, and HIL rigs to scale regression around GNSS, power behavior, and OTA reliability.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Tennessee/DSCF4775",
  },
  {
    title: "Field Telemetry",
    blurb:
      "Signed URLs, structured logs, and Athena queries to observe device behavior in the field.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF3797",
  },
  {
    title: "Firmware Craft",
    blurb:
      "STM32 drivers, FreeRTOS, power modes, and watchdog systems designed to survive production reality.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF1714",
  },
];

const techCards: TechCardData[] = [
  {
    title: "Embedded Firmware",
    description:
      "HAL and LL work, interrupt-safe drivers, state machines, watchdog recovery, and OTA flows.",
    tags: ["C", "C++", "STM32", "FreeRTOS"],
  },
  {
    title: "Connectivity & Protocols",
    description:
      "BLE, Cellular, Wi-Fi, GPS/GNSS, plus MQTT, HTTP, CoAP, and secure provisioning work.",
    tags: ["BLE", "MQTT", "HTTP", "GNSS"],
  },
  {
    title: "Device to Cloud",
    description:
      "AWS IoT Core, signed URLs, fleet registry patterns, monitoring, and telemetry ingestion pipelines.",
    tags: ["AWS", "Azure", "Athena"],
  },
  {
    title: "Test Automation & HIL",
    description:
      "PyTest and GoogleTest, Jenkins CI, power analysis, and GNSS simulation for practical regression coverage.",
    tags: ["PyTest", "GoogleTest", "Jenkins", "ADO"],
  },
];

const experience: ExperienceCompany[] = [
  {
    company: "Milwaukee Tool",
    logo: "/uploads/work_milwaukee.webp",
    tenure: "Jun 2022 - Present | Milwaukee, WI",
    roles: [
      {
        title: "Electrical Engineer II | Platform IoT",
        time: "Jan 2024 - Present",
        bullets: [
          "Built and scaled firmware across BLE, Cellular, and Wi-Fi from device communications through secure cloud integration on a connected-tools platform serving thousands of field devices.",
          "Implemented OTA update flows and device-to-cloud patterns with MQTT and HTTPS, credential hygiene, signed URLs, and fleet registry considerations.",
          "Established PyTest-based regression fixtures and expanded automated coverage across BLE, Wi-Fi, Cellular, and GPS/GNSS with Jenkins CI validation.",
        ],
        tags: ["C", "C++", "STM32", "BLE", "OTA", "MQTT", "AWS IoT", "PyTest", "Jenkins"],
      },
      {
        title: "Electrical Engineer I | Platform IoT",
        time: "Jun 2022 - Dec 2023",
        bullets: [
          "Shipped production firmware features on STM32 and Silabs platforms, including BLE advertisement patterns, watchdog recovery, ADC pipelines, power-manager state machines, and UART/DMA drivers.",
          "Led hardware debugging and validation campaigns and introduced GoogleTest as the first structured unit-testing layer on the platform.",
          "Prototyped MQTT plus GPS tracking on Quectel cellular modules and delivered an AWS-backed Python GUI for real-time field monitoring.",
          "Authored design documents and review materials while coordinating with hardware, cloud, and QA teams.",
        ],
        tags: ["C", "STM32", "Silabs", "FreeRTOS", "GoogleTest", "MQTT", "Python", "Quectel", "AWS"],
      },
    ],
  },
  {
    company: "Texas A&M University - Kingsville",
    logo: "/uploads/work_A_and_M.webp",
    tenure: "Jan 2021 - Jun 2022 | Kingsville, TX",
    roles: [
      {
        title: "Graduate Research Assistant | Cyber-Physical Power & Energy Lab",
        time: "May 2021 - Jun 2022",
        bullets: [
          "Conducted cybersecurity and machine-learning research under DOE and KERI grants, focused on threats to smart-grid critical infrastructure.",
          "Designed HIL security testbeds for digital substations using real-time power simulators with live cyber-attack injection and penetration testing.",
          "Developed a deep transfer learning approach that reached 98% firmware malware detection accuracy for smart inverters and published the work at IEEE DMC 2022.",
          "Modeled ransomware attack profiles on digital substations and built CNN-based detection reaching 96.22% accuracy for IEEE eGRID 2021.",
        ],
        tags: ["Python", "PyTorch", "CNN", "Transfer Learning", "MATLAB", "HIL", "Cybersecurity"],
      },
      {
        title: "Graduate Teaching Assistant | DSP & Speech Processing",
        time: "Jan-May 2021, Aug-Dec 2021",
        bullets: [
          "Designed lab exercises and rubrics for graduate-level DSP and speech processing courses.",
          "Mentored students on MATLAB and Python implementations of FFT analysis, FIR/IIR filter design, and speech feature extraction.",
          "Ran weekly office hours and graded problem sets and semester projects for 20+ graduate students.",
        ],
        tags: ["MATLAB", "Python", "DSP", "FFT", "Signal Processing"],
      },
    ],
  },
];

const education: EducationItem[] = [
  {
    name: "Texas A&M University - Kingsville",
    logo: "/uploads/studies_A_and_M.webp",
    degree: "M.S. Electrical & Electronics Engineering, 2020-2022",
    thesis: "Thesis: AI-Based Ransomware Detection for Digital Substations",
  },
  {
    name: "American International University-Bangladesh (AIUB)",
    logo: "/uploads/studies_aiub.webp",
    degree: "B.S. Electrical & Electronics Engineering, 2016-2020",
    thesis: "Thesis: On-body Humidity Sensing Antenna for BAN Applications over 5G Networks",
  },
];

const publications: Publication[] = [
  {
    title:
      "Ransomware Attack Modeling and Artificial Intelligence-Based Ransomware Detection for Digital Substations",
    authors: "S. R. B. Alvee, B. Ahn, T. Kim, Y. Su, Y. Youn, M. Ryu",
    venue: "IEEE Workshop on the Electronic Grid (eGRID)",
    location: "New Orleans, LA, USA",
    year: "2021",
    citations: 43,
    doi: "https://doi.org/10.1109/eGRID52793.2021.9662158",
    funding: "DOE (DE-EE0009026) | NSF (EEC-1359414) | KERI",
    abstract:
      "This paper models ransomware attacks targeting digital substations and evaluates a CNN-based detection approach using 2-D grayscale image files converted from binaries, reaching 96.22% detection accuracy.",
    keywords: ["AI", "CNN", "cybersecurity", "smart grid", "ransomware"],
  },
  {
    title:
      "Device-Centric Firmware Malware Detection for Smart Inverters using Deep Transfer Learning",
    authors: "S. R. B. Alvee, B. Ahn, S. Ahmad, K.-T. Kim, T. Kim, J. Zeng",
    venue: "IEEE Design Methodologies Conference (DMC)",
    location: "Bath, United Kingdom",
    year: "2022",
    citations: 15,
    doi: "https://doi.org/10.1109/DMC55175.2022.9906538",
    funding: null,
    abstract:
      "This work explores malware attacks on smart inverters and proposes a deep transfer-learning framework that improves development speed while reaching 98% firmware malware detection accuracy.",
    keywords: ["deep transfer learning", "firmware security", "malware", "smart inverter"],
  },
  {
    title:
      "Advanced Persistent Threat (APT)-Style Attack Modeling and Testbed for Power Transformer Diagnosis System in a Substation",
    authors: "S. Ahmad, B. Ahn, S. R. B. Alvee, D. Trevino, T. Kim, Y. Youn, M. H. Ryu",
    venue: "IEEE Power & Energy Society ISGT",
    location: "New Orleans, LA, USA",
    year: "2022",
    citations: 13,
    doi: "https://doi.org/10.1109/ISGT50606.2022.9817518",
    funding: "Korea Electrotechnology Research Institute (KERI)",
    abstract:
      "Provides practical APT attack models and a security testbed for power transformer diagnosis systems in digital substations, including a real-time simulator and penetration testing environment.",
    keywords: ["APT", "digital substation", "cybersecurity", "attack modeling", "testbed"],
  },
  {
    title: "Ransomware Security Threat Modeling for Photovoltaic Systems",
    authors: "Y. Su, B. Ahn, S. R. B. Alvee, T. Kim, J. Choi, S. C. Smith",
    venue: "IEEE Workshop on the Electronic Grid (eGRID)",
    location: "New Orleans, LA, USA",
    year: "2021",
    citations: 13,
    doi: "https://doi.org/10.1109/eGRID52793.2021.9662163",
    funding: "NSF (EEC-1359414)",
    abstract:
      "Introduces a ransomware threat-modeling method for photovoltaic systems and validates it through a real-time HIL PV security testbed.",
    keywords: ["PV systems", "ransomware", "HIL", "threat modeling", "penetration testing"],
  },
  {
    title:
      "On-Body Humidity Sensing Antenna with Polyimide for BAN Applications over 5G Networks",
    authors: "M. M. Rahman, M. A. Nayeem, S. Nahid, S. R. Bin Alvee, R. R. Hasan, M. A. Rahman",
    venue: "IEEE IEMTRONICS",
    location: "Vancouver, BC, Canada",
    year: "2020",
    citations: 7,
    doi: "https://doi.org/10.1109/IEMTRONICS51293.2020.9216331",
    funding: null,
    abstract:
      "Proposes an on-body humidity sensing antenna with polyimide operating at 38 GHz for BAN and 5G applications, comparing two antenna constructions and their humidity sensitivity.",
    keywords: ["5G", "antenna", "humidity sensing", "wearable", "mm-wave", "BAN"],
  },
  {
    title:
      "Study on Artificial Intelligence-Based Ransomware Detection for Digital Substations",
    authors: "S. R. B. Alvee",
    venue: "M.S. Thesis | Texas A&M University-Kingsville",
    location: "Kingsville, TX",
    year: "2022",
    citations: null,
    doi: null,
    funding: "DOE (DE-EE0009026) | NSF (EEC-1359414) | KERI",
    abstract:
      "Master's thesis expanding on the ransomware detection research for digital substations, covering attack modeling and CNN-based detection methods with broader experimental analysis.",
    keywords: ["ransomware", "AI", "CNN", "smart grid", "substation", "thesis"],
  },
];

const hobbies = [
  {
    title: "Music",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Tennessee/DSCF4943",
  },
  {
    title: "Photography",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF5707",
  },
  {
    title: "Traveling",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/New%20York/DSCF2088",
  },
  {
    title: "Gaming",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Minnesota/DSCF1835",
  },
  {
    title: "Guitar Rig",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Ohio/DSCF3254",
  },
];

const testimonials: Testimonial[] = [
  {
    quote:
      "Raqueed's firmware landed cleanly in production with robust drivers, clear state machines, and logs that made fleet issues debuggable.",
    name: "Srinivas K.",
    role: "Sr. Platform Architect",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Srinivas&backgroundColor=b6e3f4",
  },
  {
    quote:
      "He built a pragmatic OTA and telemetry pipeline end-to-end. Our field teams finally had real signal instead of guesswork.",
    name: "Amy L.",
    role: "Product Manager, Connected Tools",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amy&backgroundColor=d1d4f9",
  },
  {
    quote:
      "Brought discipline to validation with PyTest and HIL rigs. Regression coverage improved and so did our sleep.",
    name: "Dave R.",
    role: "Validation Lead",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DaveR&backgroundColor=c0aede",
  },
  {
    quote:
      "Solid communicator who moves features from bench to fleet with observability in place.",
    name: "Anita P.",
    role: "Firmware Manager",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita&backgroundColor=ffdfbf",
  },
];

function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function useTypewriter(phrases: string[], speed = 52) {
  const [display, setDisplay] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    const delay = isDeleting ? speed * 0.45 : charIndex === current.length ? 2600 : speed;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && charIndex < current.length) {
        setDisplay(current.slice(0, charIndex + 1));
        setCharIndex((value) => value + 1);
        return;
      }

      if (!isDeleting && charIndex === current.length) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && charIndex > 0) {
        setDisplay(current.slice(0, charIndex - 1));
        setCharIndex((value) => value - 1);
        return;
      }

      setIsDeleting(false);
      setPhraseIndex((value) => (value + 1) % phrases.length);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex, phrases, speed]);

  return display;
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((value): value is HTMLElement => Boolean(value));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function CircuitCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;
    let tick = 0;
    const columns = 14;
    const rows = 9;
    type GridNode = { gx: number; gy: number; phase: number };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const nodes: GridNode[] = [];
    for (let column = 0; column <= columns; column += 1) {
      for (let row = 0; row <= rows; row += 1) {
        nodes.push({ gx: column, gy: row, phase: Math.random() * Math.PI * 2 });
      }
    }

    const traces = Array.from({ length: 22 }, () => {
      const start = nodes[Math.floor(Math.random() * nodes.length)];
      const end = nodes[Math.floor(Math.random() * nodes.length)];
      return {
        start,
        end,
        progress: 0,
        speed: 0.004 + Math.random() * 0.005,
        delay: Math.random() * 180,
        alpha: 0.25 + Math.random() * 0.35,
      };
    });

    const draw = () => {
      tick += 1;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const width = canvas.width;
      const height = canvas.height;
      const nodeX = (value: { gx: number }) => (value.gx / columns) * width;
      const nodeY = (value: { gy: number }) => (value.gy / rows) * height;

      nodes.forEach((node) => {
        const pulse = Math.sin(tick * 0.018 + node.phase) * 0.5 + 0.5;
        context.beginPath();
        context.arc(nodeX(node), nodeY(node), 1.8, 0, Math.PI * 2);
        context.fillStyle = `rgba(210,140,0,${0.05 + pulse * 0.09})`;
        context.fill();
      });

      traces.forEach((trace) => {
        if (tick < trace.delay) return;

        trace.progress = Math.min(trace.progress + trace.speed, 1);
        if (Math.random() < 0.0006) {
          trace.progress = 0;
          trace.delay = tick + 80 + Math.random() * 160;
        }

        const startX = nodeX(trace.start);
        const startY = nodeY(trace.start);
        const endX = nodeX(trace.end);
        const endY = nodeY(trace.end);
        const firstLeg = Math.min(trace.progress * 2, 1);
        const secondLeg = Math.max((trace.progress - 0.5) * 2, 0);
        const midX = startX + (endX - startX) * firstLeg;
        const currentY = startY + (endY - startY) * secondLeg;

        context.strokeStyle = `rgba(210,140,0,${trace.alpha * Math.min(trace.progress * 3, 1)})`;
        context.lineWidth = 0.85;
        context.lineCap = "square";
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(midX, startY);
        if (trace.progress > 0.5) {
          context.lineTo(endX, currentY);
        }
        context.stroke();

        if (trace.progress > 0.08) {
          context.beginPath();
          context.arc(startX, startY, 3, 0, Math.PI * 2);
          context.strokeStyle = `rgba(210,140,0,${trace.alpha * 0.75})`;
          context.lineWidth = 1;
          context.stroke();
        }

        if (trace.progress > 0.55) {
          context.beginPath();
          context.arc(endX, endY, 3, 0, Math.PI * 2);
          context.strokeStyle = `rgba(210,140,0,${trace.alpha * 0.75 * secondLeg})`;
          context.stroke();
        }
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="hero-canvas" />;
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "in" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="section-head">
      <Reveal>
        <span className="section-label">{label}</span>
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className="section-subtitle">{subtitle}</p> : null}
      </Reveal>
    </div>
  );
}

function Hero() {
  const typed = useTypewriter(typedPhrases, 50);
  const heroRef = useRef<HTMLElement | null>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  const onMove = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const bounds = heroRef.current?.getBoundingClientRect();
    if (!bounds) return;

    setMouse({
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    });
  }, []);

  const headline = useMemo(() => {
    const text = "Platform engineering\nfrom silicon to cloud";
    const output: React.ReactNode[] = [];
    let visibleIndex = 0;

    text.split("\n").forEach((line, lineIndex) => {
      line.split(" ").forEach((word, wordIndex, words) => {
        output.push(
          <span key={`word-${lineIndex}-${wordIndex}`} className="headline-word">
            {word.split("").map((character, characterIndex) => {
              const node = (
                <span
                  key={`char-${lineIndex}-${wordIndex}-${characterIndex}`}
                  className="headline-char"
                  style={{ animationDelay: `${0.3 + visibleIndex * 0.022}s` }}
                >
                  {character}
                </span>
              );
              visibleIndex += 1;
              return node;
            })}
          </span>,
        );

        if (wordIndex < words.length - 1) {
          output.push(
            <span key={`space-${lineIndex}-${wordIndex}`} className="headline-space">
              {" "}
            </span>,
          );
        }
      });

      if (lineIndex < text.split("\n").length - 1) {
        output.push(<br key={`break-${lineIndex}`} />);
      }
    });

    return output;
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef} onMouseMove={onMove}>
      <CircuitCanvas />
      <div className="hero-glow" />
      <div
        className="hero-spotlight"
        style={{
          background: `radial-gradient(650px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(210,140,0,0.07), transparent 70%)`,
        }}
      />
      <div className="hero-content">
        <div className="hero-avatar-stage">
          <div className="hero-avatar-halo" />
          <div className="hero-avatar-orbit" />
          <div className="hero-avatar-wrap">
            <img src="/uploads/avatar.webp" alt="Syed Raqueed" className="hero-avatar" />
          </div>
          <div className="hero-float-card hero-float-card-right">
            <span className="hero-float-label">Focus</span>
            <strong>Platform IoT</strong>
          </div>
          <div className="hero-float-card hero-float-card-left">
            <span className="hero-float-label">Shipped</span>
            <strong>Embedded + Cloud</strong>
          </div>
        </div>
        <div className="hero-badge">
          <span className="badge-dot" />
          Open to collaborations
        </div>
        <h1 className="hero-title">{headline}</h1>
        <p className="hero-subline">
          {typed}
          <span className="cursor" />
        </p>
        <p className="hero-supporting">
          I build embedded and IoT systems that hold up in production, from firmware and
          connectivity to telemetry, validation, and fleet-scale reliability.
        </p>
        <div className="hero-actions">
          <a href="#work" className="button button-primary">
            View my work
          </a>
          <a href="#about" className="button button-secondary">
            About me
          </a>
          <a href="/uploads/CV_Raqueed.pdf" className="button button-secondary" download>
            Download CV
          </a>
        </div>
        <div className="hero-stats">
          <span>
            <strong>91</strong> citations
          </span>
          <span className="dot-separator" />
          <span>
            <strong>6</strong> papers & thesis
          </span>
          <span className="dot-separator" />
          <span>
            <strong>4+</strong> yrs experience
          </span>
        </div>
        <div className="hero-meta">
          <span>Embedded</span>
          <span>IoT Platform</span>
          <span>Validation</span>
          <span>Research</span>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

function Spotlights() {
  return (
    <section className="section page" id="about">
      <SectionHeading
        label="// areas"
        title="Core Strengths"
        subtitle="Where I focus most of my engineering energy"
      />
      <div className="spotlights">
        {spotlights.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.1}>
            <article className="spot-card">
              <div className="mono-label">{item.label}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Highlights() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % highlights.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  const active = highlights[activeIndex];

  return (
    <section className="section page" id="work">
      <SectionHeading
        label="// highlights"
        title="Signature Work"
        subtitle="A few focus areas the portfolio is built around"
      />
      <Reveal>
        <div className="carousel">
          <article className="carousel-main">
            <img key={active.image} src={active.image} alt={active.title} className="carousel-image" />
            <div className="carousel-body">
              <h3>{active.title}</h3>
              <p>{active.blurb}</p>
              <a href="#experience" className="inline-link">
                See related experience
              </a>
            </div>
          </article>
          <div className="carousel-thumbs" role="tablist" aria-label="Work highlights">
            {highlights.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`carousel-thumb ${index === activeIndex ? "is-active" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <img src={item.image} alt="" className="carousel-thumb-image" />
                <span className="carousel-thumb-body">
                  <span className="carousel-thumb-title">{item.title}</span>
                  <span className="carousel-thumb-text">{item.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function TechCard({ card, delay }: { card: TechCardData; delay: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const dx = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const dy = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    const px = ((event.clientX - bounds.left) / bounds.width) * 100;
    const py = ((event.clientY - bounds.top) / bounds.height) * 100;

    element.style.transition = "none";
    element.style.transform = `perspective(700px) rotateY(${dx * 14}deg) rotateX(${-dy * 14}deg) translateZ(16px)`;
    element.style.boxShadow = `${-dx * 28}px ${-dy * 18}px 70px rgba(0,0,0,0.55), 0 0 50px rgba(210,140,0,0.1)`;
    element.style.borderColor = `rgba(210,140,0,${0.15 + Math.abs(dx) * 0.2 + Math.abs(dy) * 0.2})`;
    element.style.background = `radial-gradient(180px circle at ${px}% ${py}%, rgba(210,140,0,0.08), rgba(255,255,255,0.03) 60%, transparent)`;
  };

  const onLeave = () => {
    const element = ref.current;
    if (!element) return;

    element.style.transition =
      "transform 0.65s ease, box-shadow 0.65s ease, border-color 0.65s ease, background 0.65s ease";
    element.style.transform = "";
    element.style.boxShadow = "";
    element.style.borderColor = "";
    element.style.background = "";
  };

  return (
    <Reveal delay={delay}>
      <article className="tech-card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        <h3>{card.title}</h3>
        <p>{card.description}</p>
        <div className="tag-row">
          {card.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

function TechStack() {
  return (
    <section className="section page">
      <SectionHeading
        label="// stack"
        title="Tech Stack & Capabilities"
        subtitle="Tools, platforms, and protocols I work with most"
      />
      <div className="tech-grid">
        {techCards.map((card, index) => (
          <TechCard key={card.title} card={card} delay={index * 0.08} />
        ))}
      </div>
    </section>
  );
}

function Publications() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section className="section page" id="publications">
      <SectionHeading
        label="// research"
        title="Publications"
        subtitle="IEEE peer-reviewed work on cybersecurity, AI, and embedded systems"
      />
      <div className="publication-stats">
        <div>
          <span className="publication-stat-number">91</span>
          <span className="publication-stat-label">total citations</span>
        </div>
        <div>
          <span className="publication-stat-number">6</span>
          <span className="publication-stat-label">papers & thesis</span>
        </div>
        <div>
          <span className="publication-stat-number">5</span>
          <span className="publication-stat-label">h-index</span>
        </div>
        <div>
          <span className="publication-stat-number">4</span>
          <span className="publication-stat-label">i10-index</span>
        </div>
      </div>
      <div className="publication-list">
        {publications.map((publication, index) => {
          const isOpen = expandedIndex === index;
          return (
            <Reveal key={publication.title} delay={index * 0.06}>
              <article className={`publication-card ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="publication-toggle"
                  onClick={() => setExpandedIndex(isOpen ? null : index)}
                >
                  <span className="publication-main">
                    <span className="publication-copy">
                      <span className="publication-title">{publication.title}</span>
                      <span className="publication-authors">{publication.authors}</span>
                      <span className="publication-meta">
                        {publication.venue} | {publication.location} | {publication.year}
                      </span>
                    </span>
                    <span className="publication-side">
                      {publication.citations !== null ? (
                        <span className="publication-citations">
                          <strong>{publication.citations}</strong>
                          <span>citations</span>
                        </span>
                      ) : null}
                      <span className="publication-expand">{isOpen ? "collapse" : "expand"}</span>
                    </span>
                  </span>
                </button>
                {isOpen ? (
                  <div className="publication-detail">
                    <p>{publication.abstract}</p>
                    {publication.funding ? (
                      <div className="publication-funding">
                        <span className="publication-funding-label">Funding</span>
                        <span>{publication.funding}</span>
                      </div>
                    ) : null}
                    <div className="tag-row">
                      {publication.keywords.map((keyword) => (
                        <span key={keyword} className="tag">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    {publication.doi ? (
                      <a href={publication.doi} target="_blank" rel="noreferrer" className="inline-link">
                        View on IEEE Xplore
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section page" id="experience">
      <SectionHeading
        label="// career"
        title="Work Experience"
        subtitle="Where the firmware, validation, and research work shipped"
      />
      <div className="experience-list">
        {experience.map((company, index) => (
          <Reveal key={company.company} delay={index * 0.1}>
            <article className="experience-card">
              <header className="experience-header">
                <div className="logo-shell logo-wide">
                  <img src={company.logo} alt={company.company} />
                </div>
                <div>
                  <h3 className="experience-company">{company.company}</h3>
                  <p className="experience-tenure">{company.tenure}</p>
                </div>
              </header>
              <div className="experience-roles">
                {company.roles.map((role) => (
                  <section key={role.title} className="experience-role">
                    <h4>{role.title}</h4>
                    <p className="experience-time">{role.time}</p>
                    <ul>
                      {role.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="tag-row">
                      {role.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="section page">
      <SectionHeading label="// academia" title="Education" />
      <div className="education-grid">
        {education.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.12}>
            <article className="education-card">
              <div className="logo-shell">
                <img src={item.logo} alt={item.name} />
              </div>
              <div>
                <h3>{item.name}</h3>
                <p className="education-degree">{item.degree}</p>
                <p className="education-thesis">{item.thesis}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Hobbies() {
  return (
    <section className="section page">
      <SectionHeading
        label="// life"
        title="Hobbies & Life"
        subtitle="Outside work: music, photography, travel, and hands-on tinkering"
      />
      <Reveal>
        <div className="hobbies-grid">
          {hobbies.map((hobby) => (
            <article key={hobby.title} className="hobby-card">
              <img src={hobby.image} alt={hobby.title} className="hobby-image" />
              <div className="hobby-overlay" />
              <span className="hobby-label">{hobby.title}</span>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

function Testimonials() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="section testimonial-section">
      <div className="page">
        <SectionHeading
          label="// social proof"
          title="Testimonials"
          subtitle="What teammates say about the way I build"
        />
      </div>
      <Reveal>
        <div className="testimonial-wrap">
          <div className="testimonial-track">
            {doubled.map((item, index) => (
              <article key={`${item.name}-${index}`} className="testimonial-card">
                <img src={item.image} alt={item.name} className="testimonial-avatar" />
                <div>
                  <p className="testimonial-quote">&quot;{item.quote}&quot;</p>
                  <p className="testimonial-name">
                    {item.name} | {item.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="section page">
      <Reveal>
        <div className="cta-card">
          <div className="cta-glow" />
          <div>
            <div className="cta-badge">
              <span className="badge-dot" />
              Open to collaborations
            </div>
            <h2>Have a device that needs secure, reliable firmware?</h2>
            <p>
              Firmware prototypes, fleet hardening, validation automation, or just a useful technical
              conversation.
            </p>
          </div>
          <div className="cta-actions">
            <a href="mailto:raqueed@outlook.com" className="button button-primary">
              Get in touch
            </a>
            <a href="/uploads/CV_Raqueed.pdf" className="button button-secondary" download>
              Download CV
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function PortfolioPage() {
  const activeSection = useActiveSection(sectionIds);

  return (
    <>
      <nav className="nav">
        <a href="#hero" className="nav-logo">
          sra.engineer
        </a>
        <ul className="nav-links">
          {[
            ["hero", "Home"],
            ["work", "Work"],
            ["publications", "Research"],
            ["experience", "Experience"],
            ["about", "About"],
          ].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={activeSection === id ? "is-active" : ""}>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href="mailto:raqueed@outlook.com">Contact</a>
          </li>
        </ul>
      </nav>

      <main>
        <Hero />
        <div className="divider" />
        <Spotlights />
        <div className="divider" />
        <Highlights />
        <div className="divider" />
        <TechStack />
        <div className="divider" />
        <Publications />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Education />
        <div className="divider" />
        <Hobbies />
        <div className="divider" />
        <Testimonials />
        <CallToAction />
      </main>

      <footer className="footer">
        <div className="page footer-inner">
          <span>© 2026 Syed Raqueed Bin Alvee</span>
          <a href="mailto:raqueed@outlook.com">raqueed@outlook.com</a>
        </div>
      </footer>
    </>
  );
}
