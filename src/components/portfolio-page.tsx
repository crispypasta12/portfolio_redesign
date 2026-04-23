"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { GlowCard } from "@/components/ui/spotlight-card";
import { OrbitingSkills } from "./orbiting-skills";

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
  downloadUrl?: string;
  downloadLabel?: string;
  funding: string | null;
  abstract: string;
  keywords: string[];
};

type Testimonial = {
  quote: string;
  highlight: string;
  name: string;
  role: string;
  image: string;
};

const typedPhrases = [
  "I'm Raqueed - Embedded Firmware Engineer",
  "BSP development | Device drivers | ARM Cortex-M",
  "STM32 | Silicon Labs | FreeRTOS | BLE | AWS IoT",
];

const sectionIds = ["hero", "about", "work", "publications", "experience"];

const highlights: Highlight[] = [
  {
    title: "BSP & Driver Development",
    blurb:
      "Built complete Board Support Packages from the ground up for STM32 and Silicon Labs — UART, SPI, I2C, CAN, ADC drivers, DMA controllers, clock trees, PLL configuration, and HAL layers.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF1714",
  },
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
    title: "Power Domain Management",
    blurb:
      "Peripheral power-on/off sequences, sleep/deep sleep/standby transitions, clock gating, and wake-up interrupt handlers — measurably reducing active and standby current consumption.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF3797",
  },
  {
    title: "Field Telemetry",
    blurb:
      "Signed URLs, structured logs, and Athena queries to observe device behavior in the field.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF5843",
  },
];

const techCards: TechCardData[] = [
  {
    title: "Embedded Firmware",
    description:
      "BSP development, peripheral device drivers built from scratch, DMA controllers, clock tree configuration, PLL settings, HAL layers, interrupt-safe state machines, and OTA flows.",
    tags: ["C", "C++", "STM32", "Silicon Labs", "FreeRTOS", "DMA", "ARM Cortex-M"],
  },
  {
    title: "Connectivity & Protocols",
    description:
      "CAN bus, BLE, Cellular, Wi-Fi, GPS/GNSS, plus MQTT, HTTP, TLS/SSL, AT command interfaces, and secure provisioning.",
    tags: ["CAN", "BLE", "MQTT", "GNSS", "TLS/SSL"],
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
    tenure: "Jun 2022 – Mar 2025 | Milwaukee, WI",
    roles: [
      {
        title: "Embedded System Engineer II | Platform IoT",
        time: "Jan 2024 – Mar 2025",
        bullets: [
          "Developed BSP and device drivers for ARM Cortex-M platforms (STM32, Silicon Labs) integrating CAN bus, UART, SPI, I2C, BLE radios, cellular modems, and GNSS receivers — built from the ground up including DMA controllers, clock tree configuration, and PLL settings.",
          "Implemented power domain management firmware including peripheral power-on/off sequences, sleep/deep sleep/standby transitions, clock gating, and wake-up handlers, achieving measurable reductions in active and standby power consumption.",
          "Designed hardware abstraction layers (HAL) enabling firmware portability across STM32 and Silicon Labs platform variants, and debugged hardware integration issues using JTAG/SWD (ST-Link, J-Link), logic analyzers, and oscilloscopes.",
          "Implemented OTA update flows and device-to-cloud patterns with MQTT and HTTPS, and established PyTest-based regression fixtures with Jenkins CI across BLE, Cellular, GPS/GNSS, and CAN.",
        ],
        tags: ["C", "C++", "STM32", "Silicon Labs", "DMA", "CAN", "BLE", "OTA", "MQTT", "AWS IoT", "PyTest", "Jenkins"],
      },
      {
        title: "Embedded System Engineer I | Platform IoT",
        time: "Jun 2022 – Dec 2023",
        bullets: [
          "Built peripheral device drivers from scratch on STM32 and Silicon Labs — UART, SPI, I2C, CAN, ADC, GPIO — with DMA controller configuration for memory-to-peripheral and circular buffer transfer modes.",
          "Configured clock trees including HSI/HSE/PLL sources, AHB/APB prescalers, and peripheral clock enables for optimal performance and power trade-offs.",
          "Shipped FreeRTOS-based multi-threaded firmware with BLE advertisement patterns, watchdog recovery, power-manager state machines, and introduced GoogleTest as the first structured unit-testing layer.",
          "Prototyped MQTT plus GPS tracking on Quectel cellular modules and delivered an AWS-backed Python GUI for real-time field monitoring.",
        ],
        tags: ["C", "STM32", "Silicon Labs", "FreeRTOS", "DMA", "CAN", "GoogleTest", "MQTT", "Python", "Quectel", "AWS"],
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
    downloadUrl: "/uploads/Master%27s%20Thesis.pdf",
    downloadLabel: "Download thesis",
    funding: "DOE (DE-EE0009026) | NSF (EEC-1359414) | KERI",
    abstract:
      "Master's thesis expanding on the ransomware detection research for digital substations, covering attack modeling and CNN-based detection methods with broader experimental analysis.",
    keywords: ["ransomware", "AI", "CNN", "smart grid", "substation", "thesis"],
  },
];

const selfAuthorPattern = /(S\.?\s*R\.?\s*B\.?\s*Alvee|S\.?\s*R\.?\s*Bin\s+Alvee)/g;
const selfAuthorExactPattern = /^(?:S\.?\s*R\.?\s*B\.?\s*Alvee|S\.?\s*R\.?\s*Bin\s+Alvee)$/;

function renderPublicationAuthors(authors: string) {
  return authors.split(selfAuthorPattern).map((part, index) =>
    selfAuthorExactPattern.test(part) ? (
      <span key={`${part}-${index}`} className="publication-author-self">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

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
      "Syed is an accomplished IoT engineer who will be an excellent addition to any team he joins. In my team, he consistently helped other team members while he also took on tricky feature development and data analysis. Point Syed in the right direction, and he will take on big problems quickly.",
    highlight: "Point Syed in the right direction, and he will take on big problems quickly.",
    name: "Frank Welz",
    role: "Engineering Manager at Milwaukee Tool",
    image: "/uploads/testimonial-frank-welz.jpg",
  },
  {
    quote:
      "I had the pleasure of working with Syed Raqueed Bin Alvee, and I consistently found him to be adaptable, thoughtful, and technically capable. He demonstrated a strong ability to learn new tools and languages quickly and apply them effectively, even in unfamiliar problem spaces. Syed brings a balanced skill set that spans both software development and data-driven problem solving, and he approaches challenges with curiosity and persistence. Just as importantly, he is kind-hearted, genuine, and a pleasure to work with. I would gladly work with Syed again and highly recommend him to future employers.",
    highlight: "adaptable, thoughtful, and technically capable",
    name: "Matt Halenka",
    role: "Senior Principal Firmware Engineer at Milwaukee Tool",
    image: "/uploads/testimonial-matt-halenka.jpg",
  },
  {
    quote:
      "Has result-driven mindset. Check off task upon finish.",
    highlight: "result-driven mindset",
    name: "Thomas Liu",
    role: "Embedded System Engineer at Modular Medical",
    image: "/uploads/testimonial-thomas-liu.jpg",
  },
  {
    quote:
      "Working with Syed for over a year has been more than a pleasure. He's a capable engineer with great passion in machine learning, IoT and embedded system. To his peers, he's a great mentor, friend, and supporter regardless of circumstances. Apart from effectively handling difficult tasks using in-depth knowledge and tools at hand, he's always curious of problems of his colleagues, helping bouncing off ideas and cultivating a unified work environment for everyone.",
    highlight: "effectively handling difficult tasks using in-depth knowledge and tools at hand",
    name: "Hanyu Zhu",
    role: "Firmware Engineer at Milwaukee Tool",
    image: "/uploads/testimonial-hanyu-zhu.jpg",
  },
  {
    quote:
      "Syed helped me grow significantly as an EDP. His selfless mindset leads him always willing to lend a hand. No matter what type of question I have, Syed is always willing to listen and try his best to help me out. He is urgent and responsive and always willing to hop on a call. Even in situations where he may not know the answer directly, he always points me in the right direction. He also does a great job at explaining things for anyone to understand. On top of all of that, he carries a consistently positive attitude that energizes the workspace. I think Syed's contributed greatly to the one team mentality in the CHI office.",
    highlight: "he always points me in the right direction",
    name: "Abby Haluska",
    role: "Firmware Engineer II at Milwaukee Tool",
    image: "/uploads/testimonial-abby-haluska.jpg",
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
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? "in" : ""} ${className}`.trim()}
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

function Hero({ totalCitations }: { totalCitations: number }) {
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

  const avatarParallax = useMemo(() => {
    const dx = (mouse.x - 0.5) * 2;
    const dy = (mouse.y - 0.5) * 2;

    return {
      halo: {
        transform: `translate3d(${dx * 10}px, ${dy * 10}px, 0) scale(1.02)`,
      },
      orbit: {
        transform: `translate3d(${dx * -6}px, ${dy * -6}px, 0)`,
      },
    };
  }, [mouse.x, mouse.y]);

  const headline = useMemo(() => {
    const text = "Firmware engineer with 4+ years\nbuilding production IoT platforms";
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
          <div className="hero-avatar-halo" style={avatarParallax.halo} />
          <div className="hero-avatar-orbit" style={avatarParallax.orbit} />
          <div className="hero-avatar-wrap">
            <img src="/uploads/avatar.webp" alt="Syed Raqueed" className="hero-avatar" />
          </div>
        </div>
        <h1 className="hero-title">{headline}</h1>
        <p className="hero-subline">
          {typed}
          <span className="cursor" />
        </p>
        <p className="hero-supporting">
          I build BSPs, peripheral drivers, OTA flows, and connected-device firmware for STM32 and
          Silicon Labs platforms across BLE, Cellular, GNSS, MQTT, and cloud telemetry. My
          background also includes IEEE-published research in cyber-physical systems security.
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
            <strong>{totalCitations}</strong> citations
          </span>
          <span className="dot-separator" />
          <span>
            <strong>5</strong> papers
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
        <div className="hero-socials">
          <a href="https://linkedin.com/in/raqueed" target="_blank" rel="noreferrer" className="hero-social-badge" aria-label="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </a>
          <a href="https://github.com/crispypasta12" target="_blank" rel="noreferrer" className="hero-social-badge" aria-label="GitHub">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            GitHub
          </a>
        </div>
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
    <section className="section page work-section" id="work">
      <SectionHeading
        label="// highlights"
        title="Signature Work"
        subtitle="A few focus areas the portfolio is built around"
      />
      <ContainerScroll>
        <div className="signature-scroll-content">
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
        </div>
      </ContainerScroll>
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
    <Reveal delay={delay} className="tech-reveal">
      <article className="tech-card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="tech-card-body">
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
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
    <section className="section page" id="about">
      <SectionHeading
        label="// stack"
        title="Tech Stack & Capabilities"
        subtitle="Tools, platforms, and protocols I work with most"
      />
      <div className="techstack-split">
        <div className="tech-orbit-wrap">
          <OrbitingSkills />
        </div>
        <div className="tech-grid">
          {techCards.map((card, index) => (
            <TechCard key={card.title} card={card} delay={index * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Publications({ totalCitations }: { totalCitations: number }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="section page" id="publications">
      <SectionHeading
        label="// research"
        title="Publications"
        subtitle="IEEE peer-reviewed work on cybersecurity, AI, and embedded systems"
      />
      <div className="publication-stats">
        <div>
          <span className="publication-stat-number">{totalCitations}</span>
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
              <article
                className={`publication-card ${isOpen ? "is-open" : ""} ${
                  publication.downloadUrl ? "has-download" : ""
                }`}
              >
                <button
                  type="button"
                  className="publication-toggle"
                  onClick={() => setExpandedIndex(isOpen ? null : index)}
                >
                  <span className="publication-main">
                    <span className="publication-copy">
                      <span className="publication-title">{publication.title}</span>
                      <span className="publication-authors">{renderPublicationAuthors(publication.authors)}</span>
                      <span className="publication-meta">
                        {publication.venue} | {publication.location} | {publication.year}
                      </span>
                    </span>
                    <span className="publication-side">
                      {publication.citations !== null && (
                        <span className="publication-citations">
                          <strong>{publication.citations}</strong>
                          <span>citations</span>
                        </span>
                      )}
                      <span className="publication-expand">{isOpen ? "collapse" : "expand"}</span>
                    </span>
                  </span>
                </button>
                {publication.downloadUrl ? (
                  <a
                    href={publication.downloadUrl}
                    download
                    className="publication-download publication-download-persistent"
                  >
                    {publication.downloadLabel ?? "Download publication"}
                  </a>
                ) : null}
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
            <GlowCard as="article" className="experience-card" glowColor="amber" customSize>
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
            </GlowCard>
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
          <Reveal key={item.name} delay={index * 0.12} className="education-reveal">
            <article className="education-card">
              <div className="education-accent" />
              <div className="education-column">
                <div className="logo-shell education-logo-shell">
                  <img src={item.logo} alt={item.name} />
                </div>
              </div>
              <div className="education-card-body">
                <div className="education-head">
                  <h3>{item.name}</h3>
                  <p className="education-degree">{item.degree}</p>
                </div>
                <div className="education-thesis-block">
                  <span className="education-thesis-label">Thesis</span>
                  <p className="education-thesis">{item.thesis.replace(/^Thesis:\s*/, "")}</p>
                </div>
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

function HighlightedQuote({ quote, highlight }: { quote: string; highlight: string }) {
  const start = quote.indexOf(highlight);

  if (start === -1) {
    return <>{quote}</>;
  }

  return (
    <>
      {quote.slice(0, start)}
      <span className="testimonial-highlight">{highlight}</span>
      {quote.slice(start + highlight.length)}
    </>
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
              <article
                key={`${item.name}-${index}`}
                className="testimonial-card"
                style={{ animationDelay: `${(index % testimonials.length) * 0.08}s` }}
              >
                <img src={item.image} alt={item.name} className="testimonial-avatar" />
                <div>
                  <p className="testimonial-quote">
                    &quot;<HighlightedQuote quote={item.quote} highlight={item.highlight} />&quot;
                  </p>
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
            <h2>Looking for an embedded systems engineer who ships?</h2>
            <p>
              BSP development, device drivers, firmware from silicon to cloud — open to full-time
              embedded or platform engineering roles.
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

  const totalCitations = publications.reduce((sum, pub) => sum + (pub.citations ?? 0), 0);

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
        <Hero totalCitations={totalCitations} />
        <div className="post-hero-region">
          <BGPattern variant="grid" mask="fade-y" size={34} fill="rgba(255, 255, 255, 0.055)" />
          <div className="post-hero-content">
            <div className="divider" />
            <TechStack />
            <div className="divider" />
            <Highlights />
            <div className="divider" />
            <Experience />
            <div className="divider" />
            <Education />
            <div className="divider" />
            <Publications totalCitations={totalCitations} />
            <div className="divider" />
            <Hobbies />
            <div className="divider" />
            <Testimonials />
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="page footer-inner">
          <span>© 2026 Syed Raqueed Bin Alvee</span>
          <div className="footer-links">
            <a href="mailto:raqueed@outlook.com">raqueed@outlook.com</a>
            <a href="https://linkedin.com/in/raqueed" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://github.com/crispypasta12" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
