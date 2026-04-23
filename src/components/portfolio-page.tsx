"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BGPattern } from "@/components/ui/bg-pattern";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { GlowCard } from "@/components/ui/spotlight-card";
import { OrbitingSkills } from "./orbiting-skills";

type Highlight = {
  title: string;
  blurb: string;
  image: string;
  featured?: "dma-uart" | "test-framework" | "memory-map" | "ble-scan" | "iot-logger";
};

type ProjectThumbnailType = NonNullable<Highlight["featured"]>;

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
    title: "IoT Data Logger",
    blurb:
      "End-to-end BLE, local buffering, cellular upload, and AWS ingestion architecture for resilient device-to-cloud data delivery.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF1714",
    featured: "iot-logger",
  },
  {
    title: "DMA-Based UART Passthrough System",
    blurb:
      "STM32 WBA55 firmware bridging BLE and cellular modules with DMA-backed, bidirectional UART transfer.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF5843",
    featured: "dma-uart",
  },
  {
    title: "Automated Test Framework",
    blurb:
      "PyTest and Jenkins test infrastructure for BLE, cellular, and hardware-integrated embedded validation.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Tennessee/DSCF4775",
    featured: "test-framework",
  },
  {
    title: "BLE Scan-Only Mode & Stack Integration",
    blurb:
      "Scan-only BLE firmware mode for STM32 WBA55 with advertisement parsing, selective filtering, and stack-aware integration.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF3797",
    featured: "ble-scan",
  },
  {
    title: "Memory Map Intelligence Platform",
    blurb:
      "Large-scale firmware data tooling for normalizing, comparing, clustering, and reporting on 55,000 memory map variables across engineering tools.",
    image:
      "https://res.cloudinary.com/dvgohigq8/image/upload/f_auto,q_auto/portfolio/gallery/USA/Chicago/DSCF5843",
    featured: "memory-map",
  },
];

function ProjectThumbnailVisual({ type, title }: { type?: ProjectThumbnailType; title: string }) {
  const shouldReduceMotion = useReducedMotion();
  const reduceMotion = Boolean(shouldReduceMotion);

  if (!type) {
    return null;
  }

  const idleGlow = reduceMotion
    ? {}
    : {
        opacity: [0.72, 1, 0.78],
        scale: [1, 1.015, 1],
      };

  return (
    <span
      className={`carousel-thumb-image project-thumbnail project-thumbnail--${type}`}
      aria-hidden="true"
      title={title}
    >
      <motion.span
        className="project-thumbnail-core"
        animate={idleGlow}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {type === "iot-logger" ? (
          <IotLoggerThumb reduceMotion={reduceMotion} />
        ) : type === "dma-uart" ? (
          <DmaUartThumb reduceMotion={reduceMotion} />
        ) : type === "test-framework" ? (
          <TestFrameworkThumb reduceMotion={reduceMotion} />
        ) : type === "ble-scan" ? (
          <BleScanThumb reduceMotion={reduceMotion} />
        ) : (
          <MemoryMapThumb reduceMotion={reduceMotion} />
        )}
      </motion.span>
    </span>
  );
}

function PacketPulse({
  delay,
  path,
  reduceMotion,
}: {
  delay: number;
  path: "horizontal" | "vertical" | "diagonal";
  reduceMotion: boolean;
}) {
  const animate =
    path === "horizontal"
      ? { x: [-20, 20], opacity: [0, 1, 0] }
      : path === "vertical"
        ? { y: [-18, 18], opacity: [0, 1, 0] }
        : { x: [-14, 15], y: [12, -13], opacity: [0, 1, 0] };

  return (
    <motion.circle
      r="2.1"
      cx="50"
      cy="50"
      className="project-thumbnail-pulse"
      animate={reduceMotion ? { opacity: 0.68 } : animate}
      transition={{ duration: 2.2, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function IotLoggerThumb({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="project-thumbnail-svg">
      <path className="project-thumbnail-line is-soft" d="M27 62 C27 41 39 38 45 38" />
      <path className="project-thumbnail-line is-soft" d="M55 38 C65 28 75 30 79 39" />
      <path className="project-thumbnail-line is-soft" d="M55 62 C66 68 73 62 78 52" />
      <rect x="38" y="34" width="24" height="28" rx="5" className="project-thumbnail-fill" />
      <rect x="43" y="40" width="14" height="16" rx="2" className="project-thumbnail-stroke" />
      <path className="project-thumbnail-line" d="M30 62 H42 M58 38 H76 M58 62 H75" />
      {[31, 38, 62, 69].map((x) => (
        <line key={x} x1={x} y1="29" x2={x} y2="34" className="project-thumbnail-pin" />
      ))}
      <circle cx="26" cy="62" r="4" className="project-thumbnail-node" />
      <circle cx="79" cy="39" r="4" className="project-thumbnail-node" />
      <circle cx="78" cy="52" r="3" className="project-thumbnail-node is-dim" />
      <PacketPulse delay={0} path="diagonal" reduceMotion={reduceMotion} />
      <PacketPulse delay={1.05} path="horizontal" reduceMotion={reduceMotion} />
    </svg>
  );
}

function DmaUartThumb({ reduceMotion }: { reduceMotion: boolean }) {
  const laneMotion = reduceMotion ? {} : { strokeDashoffset: [28, 0] };

  return (
    <svg viewBox="0 0 100 100" className="project-thumbnail-svg">
      <rect x="38" y="32" width="24" height="36" rx="5" className="project-thumbnail-fill" />
      <rect x="43" y="39" width="14" height="22" rx="2" className="project-thumbnail-stroke" />
      {[31, 38, 62, 69].map((x) => (
        <line key={x} x1={x} y1="27" x2={x} y2="32" className="project-thumbnail-pin" />
      ))}
      {[31, 38, 62, 69].map((x) => (
        <line key={`${x}-b`} x1={x} y1="68" x2={x} y2="73" className="project-thumbnail-pin" />
      ))}
      <motion.path
        className="project-thumbnail-line"
        d="M18 42 H38 M62 42 H82 M82 58 H62 M38 58 H18"
        strokeDasharray="7 7"
        animate={laneMotion}
        transition={{ duration: 1.7, repeat: Infinity, ease: "linear" }}
      />
      <path className="project-thumbnail-arrow" d="M77 37 L83 42 L77 47" />
      <path className="project-thumbnail-arrow" d="M23 53 L17 58 L23 63" />
      <PacketPulse delay={0.15} path="horizontal" reduceMotion={reduceMotion} />
      <PacketPulse delay={1.05} path="horizontal" reduceMotion={reduceMotion} />
    </svg>
  );
}

function TestFrameworkThumb({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="project-thumbnail-svg">
      <rect x="31" y="25" width="34" height="50" rx="6" className="project-thumbnail-fill" />
      <path className="project-thumbnail-stroke" d="M40 25 H56 M39 40 H58 M39 54 H58 M39 67 H52" />
      <motion.path
        className="project-thumbnail-check"
        d="M27 43 L32 48 L42 36"
        initial={false}
        animate={reduceMotion ? { pathLength: 1, opacity: 0.9 } : { pathLength: [0, 1, 1], opacity: [0, 1, 0.72] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        className="project-thumbnail-check"
        d="M27 63 L32 68 L42 56"
        initial={false}
        animate={reduceMotion ? { pathLength: 1, opacity: 0.72 } : { pathLength: [0, 1, 1], opacity: [0, 0.9, 0.62] }}
        transition={{ duration: 2.8, delay: 0.55, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.g
        className="project-thumbnail-gear"
        style={{ originX: "71px", originY: "61px" }}
        animate={reduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="71" cy="61" r="10" className="project-thumbnail-stroke" />
        <circle cx="71" cy="61" r="3" className="project-thumbnail-node" />
        {[0, 45, 90, 135].map((angle) => (
          <line
            key={angle}
            x1="71"
            y1="47"
            x2="71"
            y2="52"
            className="project-thumbnail-pin"
            transform={`rotate(${angle} 71 61)`}
          />
        ))}
      </motion.g>
      <motion.line
        x1="28"
        y1="31"
        x2="70"
        y2="31"
        className="project-thumbnail-scan"
        animate={reduceMotion ? { opacity: 0.32 } : { y: [0, 35, 0], opacity: [0, 0.7, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function BleScanThumb({ reduceMotion }: { reduceMotion: boolean }) {
  const ringMotion = reduceMotion
    ? { opacity: 0.34, scale: 1 }
    : { opacity: [0, 0.62, 0], scale: [0.72, 1.18, 1.38] };

  return (
    <svg viewBox="0 0 100 100" className="project-thumbnail-svg">
      <circle cx="50" cy="53" r="5" className="project-thumbnail-node" />
      {[20, 31, 42].map((radius) => (
        <circle key={radius} cx="50" cy="53" r={radius} className="project-thumbnail-ring" />
      ))}
      <motion.circle
        cx="50"
        cy="53"
        r="22"
        className="project-thumbnail-scan-ring"
        animate={ringMotion}
        transition={{ duration: 2.6, delay: 0.2, repeat: Infinity, ease: "easeOut" }}
      />
      <path className="project-thumbnail-line" d="M50 53 L69 37" />
      <motion.circle
        cx="70"
        cy="36"
        r="3.6"
        className="project-thumbnail-pulse"
        animate={reduceMotion ? { opacity: 0.76 } : { opacity: [0.25, 1, 0.35], scale: [1, 1.35, 1] }}
        transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
      />
      <path className="project-thumbnail-arrow is-soft" d="M44 31 C48 27 53 27 57 31" />
      <path className="project-thumbnail-arrow is-soft" d="M36 24 C44 16 56 16 64 24" />
    </svg>
  );
}

function MemoryMapThumb({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className="project-thumbnail-svg">
      <path className="project-thumbnail-line is-soft" d="M50 31 V69 M31 51 H69 M31 69 H69" />
      <rect x="34" y="22" width="32" height="17" rx="5" className="project-thumbnail-fill" />
      <rect x="25" y="45" width="24" height="15" rx="4" className="project-thumbnail-stroke" />
      <rect x="51" y="45" width="24" height="15" rx="4" className="project-thumbnail-stroke" />
      <rect x="25" y="66" width="24" height="14" rx="4" className="project-thumbnail-stroke" />
      <rect x="51" y="66" width="24" height="14" rx="4" className="project-thumbnail-stroke" />
      {[50, 37, 63, 37, 63].map((cx, index) => (
        <motion.circle
          key={`${cx}-${index}`}
          cx={cx}
          cy={index === 0 ? 31 : index < 3 ? 52 : 73}
          r="2.4"
          className="project-thumbnail-node"
          animate={reduceMotion ? { opacity: 0.75 } : { opacity: [0.35, 1, 0.45], scale: [1, 1.28, 1] }}
          transition={{ duration: 2.4, delay: index * 0.28, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <PacketPulse delay={0.3} path="vertical" reduceMotion={reduceMotion} />
    </svg>
  );
}

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

const dmaProject = {
  category: "Embedded Systems / Real-Time Firmware / STM32",
  summary:
    "Designed and implemented a high-performance UART passthrough system on the STM32 WBA55, bridging BLE and cellular modules with reliable, low-latency, bidirectional transfer in a real embedded environment.",
  contributions: [
    "Implemented DMA-based UART communication using GPDMA linked-list circular mode to reduce CPU overhead.",
    "Designed a buffered message pipeline with newline-based framing for complete packet handling.",
    "Built bidirectional UART passthrough between two independent peripherals.",
    "Integrated cellular power control logic using PWRKEY sequencing.",
    "Added activity-based forwarding so passthrough only engages when valid UART traffic is detected.",
  ],
  impact: [
    "Enables non-blocking, low-latency communication.",
    "Demonstrates depth across DMA, UART, interrupts, and hardware control.",
    "Supports reliable BLE / MCU / cellular bridging in a real embedded system.",
  ],
  focus: [
    "Minimizing CPU load while keeping transfers responsive.",
    "Preserving complete message boundaries.",
    "Coordinating hardware control and communication flow.",
    "Handling two UART directions cleanly and predictably.",
  ],
  tech: ["STM32 WBA55", "UART", "DMA / GPDMA", "Embedded C/C++", "Real-Time Firmware", "Cellular Control Logic"],
};

function DmaUartDiagram() {
  const shouldReduceMotion = useReducedMotion();
  const packetTransition = (duration: number, delay = 0) => ({
    duration,
    delay,
    repeat: shouldReduceMotion ? 0 : Infinity,
    ease: "linear" as const,
  });

  return (
    <div className="dma-diagram" aria-label="BLE module to STM32 MCU to cellular module DMA UART passthrough diagram">
      <div className="dma-grid" />
      <div className="dma-node dma-node-ble">
        <span className="dma-node-kicker">UART A</span>
        <strong>BLE Module</strong>
        <small>RX / TX stream</small>
      </div>
      <div className="dma-node dma-node-mcu">
        <div className="dma-ring" />
        <span className="dma-node-kicker">STM32 WBA55</span>
        <strong>MCU Bridge</strong>
        <div className="dma-mcu-tags">
          <span>UART</span>
          <span>DMA</span>
          <span>Buffer</span>
          <span>Control</span>
        </div>
        <div className="dma-buffer" aria-label="newline framed packet buffer">
          {[0, 1, 2, 3].map((item) => (
            <motion.span
              key={item}
              animate={shouldReduceMotion ? undefined : { opacity: [0.35, 1, 0.45], y: [0, -2, 0] }}
              transition={{ duration: 1.8, delay: item * 0.18, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          <em>\n</em>
        </div>
      </div>
      <div className="dma-node dma-node-cellular">
        <span className="dma-node-kicker">UART B</span>
        <strong>Cellular Module</strong>
        <small>AT / data path</small>
        <div className="dma-power">
          <span className="dma-power-pulse" />
          <span>PWRKEY ready</span>
        </div>
      </div>

      <div className="dma-lane dma-lane-left" aria-hidden="true">
        <motion.span
          className="dma-packet"
          animate={shouldReduceMotion ? undefined : { top: ["4%", "88%"], opacity: [0, 1, 1, 0] }}
          transition={packetTransition(2.35, 0.1)}
        />
        <motion.span
          className="dma-packet dma-packet-reverse"
          animate={shouldReduceMotion ? undefined : { top: ["88%", "6%"], opacity: [0, 0.9, 0.9, 0] }}
          transition={packetTransition(3.4, 1.15)}
        />
      </div>
      <div className="dma-lane dma-lane-right" aria-hidden="true">
        <motion.span
          className="dma-packet"
          animate={shouldReduceMotion ? undefined : { top: ["5%", "90%"], opacity: [0, 1, 1, 0] }}
          transition={packetTransition(2.65, 0.65)}
        />
        <motion.span
          className="dma-packet dma-packet-reverse"
          animate={shouldReduceMotion ? undefined : { top: ["90%", "8%"], opacity: [0, 0.82, 0.82, 0] }}
          transition={packetTransition(4.1, 2.05)}
        />
      </div>
      <div className="dma-activity-lane dma-activity-top" aria-hidden="true" />
      <div className="dma-activity-lane dma-activity-bottom" aria-hidden="true" />
      <div className="dma-status-strip">
        <span>activity detect</span>
        <strong>DMA circular linked-list active</strong>
      </div>
    </div>
  );
}

function DmaProjectHighlight() {
  const shouldReduceMotion = useReducedMotion();
  const childMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <motion.article
      className="carousel-main dma-feature-card"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
    >
      <div className="dma-feature-copy">
        <motion.div {...childMotion} transition={{ duration: 0.42 }}>
          <span className="dma-eyebrow">Featured embedded project</span>
          <h3>DMA-Based UART Passthrough System</h3>
          <p className="dma-category">{dmaProject.category}</p>
          <p className="dma-summary">{dmaProject.summary}</p>
        </motion.div>

        <motion.div className="dma-content-grid" {...childMotion} transition={{ duration: 0.42, delay: 0.08 }}>
          <section className="dma-copy-block">
            <h4>Key Contributions</h4>
            <ul className="dma-check-list">
              {dmaProject.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="dma-copy-block dma-impact-block">
            <h4>Impact</h4>
            <ul className="dma-impact-list">
              {dmaProject.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.section className="dma-copy-block" {...childMotion} transition={{ duration: 0.42, delay: 0.16 }}>
          <h4>Engineering Focus</h4>
          <div className="dma-focus-grid">
            {dmaProject.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.section>

        <motion.div className="tag-row dma-tech-row" {...childMotion} transition={{ duration: 0.42, delay: 0.24 }}>
          {dmaProject.tech.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="dma-feature-visual"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.58, delay: 0.16, ease: "easeOut" }}
      >
        <DmaUartDiagram />
      </motion.div>
    </motion.article>
  );
}

const testFrameworkProject = {
  category: "Test Infrastructure • CI/CD • Embedded Validation",
  summary:
    "Designed and implemented a hardware-integrated automated test framework using Python and Jenkins to validate BLE modules, cellular modules, and embedded systems through scalable, repeatable test workflows.",
  contributions: [
    "Built PyTest-based automated suites for BLE communication validation.",
    "Developed cellular connectivity and AT command validation flows.",
    "Integrated tests into a Jenkins CI pipeline for continuous firmware validation.",
    "Connected workflows to real hardware through FTDI UART and SWD flashing/debug paths.",
    "Added signal-level validation with logic analyzer traces.",
    "Implemented structured logging, reporting, and failure diagnostics.",
  ],
  impact: [
    "Enabled scalable regression testing for embedded systems.",
    "Improved firmware reliability through automated validation pipelines.",
    "Reduced debugging time with structured logs and reproducible test flows.",
    "Introduced CI/CD practices into hardware and firmware workflows.",
  ],
  focus: [
    "Coordinating software tests with real hardware states.",
    "Synchronizing flashing, communication, and validation.",
    "Handling flaky hardware scenarios in automation.",
    "Designing reproducible and debuggable test flows.",
  ],
  tech: [
    "Python",
    "PyTest",
    "Jenkins",
    "UART / FTDI",
    "SWD",
    "Embedded Systems",
    "Test Automation",
    "Hardware Validation",
  ],
};

function TestPipelineVisualization() {
  const shouldReduceMotion = useReducedMotion();
  const pipelineStages = ["Code", "Jenkins", "Runner", "Hardware", "Results"];
  const resultRows = ["BLE link", "AT cmd", "UART rx", "SWD flash"];
  const packetTransition = (duration: number, delay = 0) => ({
    duration,
    delay,
    repeat: shouldReduceMotion ? 0 : Infinity,
    ease: "linear" as const,
  });

  return (
    <div className="test-framework-visual" aria-label="Developer to Jenkins to test runner to hardware to results pipeline diagram">
      <div className="test-framework-grid" />
      <div className="test-framework-pipeline" aria-hidden="true">
        <div className="test-framework-pipeline-line" />
        {[0, 1, 2].map((packet) => (
          <motion.span
            key={packet}
            className="test-framework-packet"
            animate={shouldReduceMotion ? undefined : { left: ["2%", "98%"], opacity: [0, 1, 1, 0] }}
            transition={packetTransition(4.8, packet * 0.9)}
          />
        ))}
      </div>

      <div className="test-framework-stage-row">
        {pipelineStages.map((stage, index) => (
          <motion.div
            key={stage}
            className={`test-framework-stage test-framework-stage-${index + 1}`}
            animate={shouldReduceMotion ? undefined : { borderColor: ["rgba(255,255,255,0.09)", "rgba(210,140,0,0.32)", "rgba(255,255,255,0.09)"] }}
            transition={{ duration: 4.8, delay: index * 0.34, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="test-framework-stage-label">stage 0{index + 1}</span>
            <strong>{stage}</strong>
            <small>
              {index === 0
                ? "test scripts"
                : index === 1
                  ? "orchestrate"
                  : index === 2
                    ? "execute"
                    : index === 3
                      ? "UART + SWD"
                      : "report"}
            </small>
          </motion.div>
        ))}
      </div>

      <div className="test-framework-mid-row">
        <div className="test-framework-runner">
          <span className="test-framework-stage-label">test cycles</span>
          <div className="test-framework-cycle-ring">
            {[0, 1, 2].map((pulse) => (
              <motion.span
                key={pulse}
                animate={shouldReduceMotion ? undefined : { scale: [0.72, 1.16, 0.72], opacity: [0.38, 1, 0.42] }}
                transition={{ duration: 1.9, delay: pulse * 0.28, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          <strong>pytest -m hil</strong>
        </div>

        <div className="test-framework-hardware">
          <span className="test-framework-stage-label">hardware interface</span>
          <div className="test-framework-board">
            <div className="test-framework-chip">
              <span>MCU</span>
            </div>
            <div className="test-framework-pins test-framework-pins-left" />
            <div className="test-framework-pins test-framework-pins-right" />
            <motion.div
              className="test-framework-swd-bar"
              animate={shouldReduceMotion ? undefined : { scaleX: [0.08, 1, 1, 0.08], opacity: [0.45, 1, 0.72, 0.45] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="test-framework-uart-lines" aria-hidden="true">
            {[0, 1, 2].map((line) => (
              <motion.span
                key={line}
                animate={shouldReduceMotion ? undefined : { opacity: [0.26, 1, 0.4], x: [0, 8, 0] }}
                transition={{ duration: 1.6, delay: line * 0.18, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          <motion.div
            className="test-framework-error-flicker"
            animate={shouldReduceMotion ? undefined : { opacity: [0, 0, 0.64, 0, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          >
            retry
          </motion.div>
        </div>
      </div>

      <div className="test-framework-bottom-row">
        <div className="test-framework-logic">
          <span className="test-framework-stage-label">logic analyzer</span>
          <svg viewBox="0 0 220 70" role="img" aria-label="logic analyzer waveform">
            <motion.path
              d="M8 18 H28 V44 H48 V18 H72 V44 H94 V18 H118 V44 H142 V18 H166 V44 H188 V18 H212"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={shouldReduceMotion ? undefined : { pathLength: 0.15 }}
              animate={shouldReduceMotion ? undefined : { pathLength: [0.15, 1, 0.15] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="test-framework-results">
          <span className="test-framework-stage-label">reporting</span>
          <div className="test-framework-result-head">
            <strong>CI summary</strong>
            <motion.span
              animate={shouldReduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(117,210,145,0)", "0 0 16px rgba(117,210,145,0.55)", "0 0 0 rgba(117,210,145,0)"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              pass
            </motion.span>
          </div>
          <div className="test-framework-result-rows">
            {resultRows.map((row, index) => (
              <motion.div
                key={row}
                animate={shouldReduceMotion ? undefined : { opacity: [0.58, 1, 0.72] }}
                transition={{ duration: 2.4, delay: index * 0.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span />
                <small>{row}</small>
              </motion.div>
            ))}
          </div>
          <div className="test-framework-hover-detail">logs • traces • junit xml</div>
        </div>
      </div>
    </div>
  );
}

function TestFrameworkProjectHighlight() {
  const shouldReduceMotion = useReducedMotion();
  const childMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <motion.article
      className="carousel-main test-framework-feature-card"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
    >
      <div className="test-framework-feature-copy">
        <motion.div {...childMotion} transition={{ duration: 0.42 }}>
          <span className="test-framework-eyebrow">Featured validation infrastructure project</span>
          <h3>Automated Test Framework (PyTest + Jenkins)</h3>
          <p className="test-framework-category">{testFrameworkProject.category}</p>
          <p className="test-framework-summary">{testFrameworkProject.summary}</p>
        </motion.div>

        <motion.div className="test-framework-content-grid" {...childMotion} transition={{ duration: 0.42, delay: 0.08 }}>
          <section className="test-framework-copy-block">
            <h4>Key Contributions</h4>
            <ul className="test-framework-check-list">
              {testFrameworkProject.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="test-framework-copy-block test-framework-impact-block">
            <h4>Impact</h4>
            <ul className="test-framework-impact-list">
              {testFrameworkProject.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.section className="test-framework-copy-block" {...childMotion} transition={{ duration: 0.42, delay: 0.16 }}>
          <h4>Engineering Focus</h4>
          <div className="test-framework-focus-grid">
            {testFrameworkProject.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.section>

        <motion.div className="tag-row test-framework-tech-row" {...childMotion} transition={{ duration: 0.42, delay: 0.24 }}>
          {testFrameworkProject.tech.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="test-framework-feature-visual"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.58, delay: 0.16, ease: "easeOut" }}
      >
        <TestPipelineVisualization />
      </motion.div>
    </motion.article>
  );
}

const memoryMapProject = {
  category: "Firmware Tooling / Data Engineering / Reporting & Analysis",
  summary:
    "Built a large-scale analysis and reporting platform to standardize and evaluate approximately 55,000 memory map variables across multiple engineering tools, helping identify naming inconsistencies, address conflicts, and access-level mismatches across teams.",
  contributions: [
    "Normalized labels and standardized text patterns across inconsistent datasets.",
    "Used spaCy and K-means clustering to group semantically similar variables.",
    "Built HTML dashboards for address comparison, access analysis, and consistency review.",
    "Generated Excel outputs for standardization workflows and team-wide review.",
    "Established a cleaner baseline for memory map naming and address usage.",
  ],
  impact: [
    "Solved a cross-team consistency problem at scale.",
    "Exposed address conflicts, label mismatches, and access-level drift.",
    "Connected firmware domain knowledge with large-scale analysis.",
    "Supported future standardization and reliability work.",
  ],
  focus: [
    "Standardizing labels across tools.",
    "Comparing usage across teams.",
    "Surfacing actionable conflicts.",
    "Balancing automation with manual review.",
  ],
  tech: ["Python", "spaCy", "K-means Clustering", "HTML Reports", "Excel Export", "Data Cleaning", "Firmware Memory Maps"],
};

function MemoryMapVisualization() {
  const shouldReduceMotion = useReducedMotion();
  const packetTransition = (duration: number, delay = 0) => ({
    duration,
    delay,
    repeat: shouldReduceMotion ? 0 : Infinity,
    ease: "linear" as const,
  });
  const sourceTools = ["Config Tool", "Service Tool", "Admin Tool", "Factory Tool"];
  const normalizedLabels = ["BattTemp", "battery_temp", "BAT TEMP"];
  const clusters = ["TEMP", "ADDR", "ACCESS"];

  return (
    <div className="memmap-visual" aria-label="Memory map intelligence analysis workflow visualization">
      <div className="memmap-grid" />
      <div className="memmap-stage memmap-sources">
        <span className="memmap-stage-label">sources</span>
        {sourceTools.map((tool, index) => (
          <motion.div
            key={tool}
            className="memmap-source-node"
            animate={shouldReduceMotion ? undefined : { opacity: [0.72, 1, 0.72] }}
            transition={{ duration: 2.8, delay: index * 0.22, repeat: Infinity, ease: "easeInOut" }}
          >
            <span />
            {tool}
          </motion.div>
        ))}
      </div>

      <div className="memmap-flow memmap-flow-a" aria-hidden="true">
        {[0, 1, 2].map((item) => (
          <motion.span
            key={item}
            animate={shouldReduceMotion ? undefined : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={packetTransition(2.4, item * 0.55)}
          />
        ))}
      </div>

      <motion.div
        className="memmap-processor"
        animate={shouldReduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(83,146,255,0)", "0 0 28px rgba(83,146,255,0.12)", "0 0 0 rgba(83,146,255,0)"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="memmap-stage-label">intelligence layer</span>
        <strong>Normalize</strong>
        <div className="memmap-processor-tags">
          <span>Cluster</span>
          <span>Compare</span>
          <span>Analyze</span>
        </div>
      </motion.div>

      <div className="memmap-normalize">
        <span className="memmap-stage-label">cleanup</span>
        {normalizedLabels.map((label, index) => (
          <motion.div
            key={label}
            className="memmap-label-row"
            animate={shouldReduceMotion ? undefined : { x: [0, 5, 0], opacity: [0.62, 1, 0.78] }}
            transition={{ duration: 2.6, delay: index * 0.28, repeat: Infinity, ease: "easeInOut" }}
          >
            <code>{label}</code>
            <span>battery_temp</span>
          </motion.div>
        ))}
      </div>

      <div className="memmap-clusters">
        <span className="memmap-stage-label">semantic groups</span>
        {clusters.map((cluster, clusterIndex) => (
          <div key={cluster} className="memmap-cluster">
            <strong>{cluster}</strong>
            {[0, 1, 2].map((node) => (
              <motion.span
                key={`${cluster}-${node}`}
                animate={shouldReduceMotion ? undefined : { scale: [0.92, 1.08, 0.96], opacity: [0.58, 1, 0.7] }}
                transition={{ duration: 2.4, delay: clusterIndex * 0.24 + node * 0.16, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="memmap-conflicts">
        <span className="memmap-stage-label">diagnostics</span>
        <div className="memmap-diff-row is-warning">
          <span>0x4A10</span>
          <strong>duplicate</strong>
        </div>
        <div className="memmap-diff-row">
          <span>ACCESS</span>
          <strong>RW / RO</strong>
        </div>
        <div className="memmap-diff-row is-warning">
          <span>LABEL</span>
          <strong>mismatch</strong>
        </div>
      </div>

      <div className="memmap-flow memmap-flow-b" aria-hidden="true">
        {[0, 1].map((item) => (
          <motion.span
            key={item}
            animate={shouldReduceMotion ? undefined : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={packetTransition(2.8, item * 0.8)}
          />
        ))}
      </div>

      <div className="memmap-report">
        <span className="memmap-stage-label">report output</span>
        <div className="memmap-metrics">
          <div>
            <strong>55k</strong>
            <span>variables</span>
          </div>
          <div>
            <strong>4</strong>
            <span>toolchains</span>
          </div>
        </div>
        <div className="memmap-bars">
          <span style={{ "--bar": "82%" } as React.CSSProperties} />
          <span style={{ "--bar": "64%" } as React.CSSProperties} />
          <span style={{ "--bar": "74%" } as React.CSSProperties} />
        </div>
        <div className="memmap-table">
          <span>ADDR</span>
          <span>NAME</span>
          <span>ACCESS</span>
          <span>0x4A10</span>
          <span>battery_temp</span>
          <span>RW</span>
          <span>0x4A14</span>
          <span>pack_voltage</span>
          <span>RO</span>
        </div>
      </div>
    </div>
  );
}

function MemoryMapProjectHighlight() {
  const shouldReduceMotion = useReducedMotion();
  const childMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <motion.article
      className="carousel-main memmap-feature-card"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
    >
      <div className="memmap-feature-copy">
        <motion.div {...childMotion} transition={{ duration: 0.42 }}>
          <span className="memmap-eyebrow">Featured systems tooling project</span>
          <h3>Memory Map Intelligence Platform</h3>
          <p className="memmap-category">{memoryMapProject.category}</p>
          <p className="memmap-summary">{memoryMapProject.summary}</p>
        </motion.div>

        <motion.div className="memmap-content-grid" {...childMotion} transition={{ duration: 0.42, delay: 0.08 }}>
          <section className="memmap-copy-block">
            <h4>Key Contributions</h4>
            <ul className="memmap-check-list">
              {memoryMapProject.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="memmap-copy-block memmap-impact-block">
            <h4>Impact</h4>
            <ul className="memmap-impact-list">
              {memoryMapProject.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.section className="memmap-copy-block" {...childMotion} transition={{ duration: 0.42, delay: 0.16 }}>
          <h4>Engineering Focus</h4>
          <div className="memmap-focus-grid">
            {memoryMapProject.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.section>

        <motion.div className="tag-row memmap-tech-row" {...childMotion} transition={{ duration: 0.42, delay: 0.24 }}>
          {memoryMapProject.tech.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="memmap-feature-visual"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.58, delay: 0.16, ease: "easeOut" }}
      >
        <MemoryMapVisualization />
      </motion.div>
    </motion.article>
  );
}

const bleScanProject = {
  category: "Wireless Systems / BLE Stack / Low-Level Firmware",
  summary:
    "Developed a scan-only BLE mode on the STM32 WBA55 and integrated it into a modular firmware platform, enabling efficient discovery, filtering, and processing of nearby BLE advertisements in a resource-constrained embedded environment.",
  contributions: [
    "Configured BLE stack parameters including scan behavior, MTU size, and link-related limits for embedded performance constraints.",
    "Implemented custom advertisement filtering with Service UUID matching and manufacturer-specific data parsing.",
    "Interfaced directly with HCI / GAP scanning behavior instead of treating BLE as a black-box library.",
    "Integrated scan-only behavior into a larger object-oriented firmware architecture.",
    "Designed selective advertisement processing for targeted discovery flows across specific device classes.",
    "Reduced unnecessary packet processing in dense BLE environments.",
  ],
  impact: [
    "Demonstrates BLE understanding beyond application-level usage.",
    "Enables efficient device discovery and filtering in RF-dense environments.",
    "Balances protocol behavior, memory constraints, and firmware architecture.",
    "Supports scalable wireless features inside a modular embedded platform.",
  ],
  focus: [
    "Filtering relevant advertisements without wasting MCU resources.",
    "Working with BLE stack behavior under embedded constraints.",
    "Parsing variable advertisement payload structures safely.",
    "Integrating wireless behavior into an existing modular architecture.",
    "Handling dense scan environments without noisy processing overhead.",
  ],
  tech: [
    "STM32 WBA55",
    "BLE",
    "HCI / GAP",
    "Advertisement Parsing",
    "Service UUID Filtering",
    "Manufacturer Data",
    "Embedded C/C++",
    "OOP Firmware Architecture",
  ],
};

function BleScanVisualization() {
  const shouldReduceMotion = useReducedMotion();
  const packetTransition = (duration: number, delay = 0) => ({
    duration,
    delay,
    repeat: shouldReduceMotion ? 0 : Infinity,
    ease: "linear" as const,
  });
  const devices = [
    { id: "tag-a", label: "svc:180f", className: "ble-scan-device-a", selected: false },
    { id: "tag-b", label: "uuid:tool", className: "ble-scan-device-b", selected: true },
    { id: "tag-c", label: "mfg:0x31", className: "ble-scan-device-c", selected: false },
    { id: "tag-d", label: "svc:feda", className: "ble-scan-device-d", selected: false },
  ];
  const packets = [
    { id: "p0", className: "ble-scan-packet-a", selected: false, duration: 2.9, delay: 0.05 },
    { id: "p1", className: "ble-scan-packet-b is-selected", selected: true, duration: 3.2, delay: 0.72 },
    { id: "p2", className: "ble-scan-packet-c", selected: false, duration: 3.4, delay: 1.18 },
    { id: "p3", className: "ble-scan-packet-d", selected: false, duration: 3.1, delay: 1.72 },
  ];
  const stackLayers = ["App", "GAP", "HCI"];

  return (
    <div className="ble-scan-visual" aria-label="BLE advertisements moving through scan, filter, firmware stack, and selected output">
      <div className="ble-scan-grid" />
      <div className="ble-scan-field" aria-hidden="true" />

      <div className="ble-scan-broadcasts">
        <span className="ble-scan-stage-label">broadcast environment</span>
        {devices.map((device, index) => (
          <motion.div
            key={device.id}
            className={`ble-scan-device ${device.className} ${device.selected ? "is-target" : ""}`}
            animate={shouldReduceMotion ? undefined : { opacity: device.selected ? [0.88, 1, 0.9] : [0.55, 0.82, 0.58] }}
            transition={{ duration: 2.6, delay: index * 0.24, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="ble-scan-wave" />
            <span className="ble-scan-wave ble-scan-wave-delay" />
            <strong>{device.selected ? "target" : "adv"}</strong>
            <small>{device.label}</small>
          </motion.div>
        ))}
      </div>

      <div className="ble-scan-packet-layer" aria-hidden="true">
        {packets.map((packet) => (
          <motion.span
            key={packet.id}
            className={`ble-scan-packet ${packet.className}`}
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    offsetDistance: packet.selected ? ["0%", "50%", "100%"] : ["0%", "50%", "62%"],
                    opacity: packet.selected ? [0, 1, 1, 0.95] : [0, 0.76, 0.24, 0],
                  }
            }
            transition={packetTransition(packet.duration, packet.delay)}
          />
        ))}
      </div>

      <motion.div
        className="ble-scan-filter"
        animate={shouldReduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(83,146,255,0)", "0 0 30px rgba(83,146,255,0.15)", "0 0 0 rgba(83,146,255,0)"] }}
        transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="ble-scan-stage-label">scan field</span>
        <strong>Filter + Parse</strong>
        <div className="ble-scan-filter-grid">
          <span>UUID</span>
          <span>MFG</span>
          <span>RSSI</span>
          <span>TYPE</span>
        </div>
        <div className="ble-scan-filter-status">
          <span>reject noise</span>
          <strong>select target</strong>
        </div>
      </motion.div>

      <div className="ble-scan-stack">
        <span className="ble-scan-stage-label">firmware stack</span>
        {stackLayers.map((layer, index) => (
          <motion.div
            key={layer}
            className="ble-scan-stack-layer"
            animate={shouldReduceMotion ? undefined : { borderColor: ["rgba(255,255,255,0.09)", "rgba(117,210,145,0.24)", "rgba(255,255,255,0.09)"] }}
            transition={{ duration: 2.7, delay: index * 0.28, repeat: Infinity, ease: "easeInOut" }}
          >
            <span>{layer}</span>
            <small>{index === 0 ? "selective logic" : index === 1 ? "scan events" : "controller path"}</small>
          </motion.div>
        ))}
      </div>

      <div className="ble-scan-output">
        <span className="ble-scan-stage-label">selected output</span>
        <div className="ble-scan-output-head">
          <strong>matched advertisements</strong>
          <motion.span
            animate={shouldReduceMotion ? undefined : { opacity: [0.55, 1, 0.66] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          >
            active
          </motion.span>
        </div>
        <div className="ble-scan-output-row is-accepted">
          <span />
          <small>service uuid match</small>
        </div>
        <div className="ble-scan-output-row is-accepted">
          <span />
          <small>manufacturer payload parsed</small>
        </div>
        <div className="ble-scan-output-row">
          <span />
          <small>noise suppressed before app logic</small>
        </div>
      </div>
    </div>
  );
}

function BleScanProjectHighlight() {
  const shouldReduceMotion = useReducedMotion();
  const childMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <motion.article
      className="carousel-main ble-scan-feature-card"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
    >
      <div className="ble-scan-feature-copy">
        <motion.div {...childMotion} transition={{ duration: 0.42 }}>
          <span className="ble-scan-eyebrow">Featured wireless firmware project</span>
          <h3>BLE Scan-Only Mode & Stack Integration</h3>
          <p className="ble-scan-category">{bleScanProject.category}</p>
          <p className="ble-scan-summary">{bleScanProject.summary}</p>
        </motion.div>

        <motion.div className="ble-scan-content-grid" {...childMotion} transition={{ duration: 0.42, delay: 0.08 }}>
          <section className="ble-scan-copy-block">
            <h4>Key Contributions</h4>
            <ul className="ble-scan-check-list">
              {bleScanProject.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="ble-scan-copy-block ble-scan-impact-block">
            <h4>Impact</h4>
            <ul className="ble-scan-impact-list">
              {bleScanProject.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.section className="ble-scan-copy-block" {...childMotion} transition={{ duration: 0.42, delay: 0.16 }}>
          <h4>Engineering Focus</h4>
          <div className="ble-scan-focus-grid">
            {bleScanProject.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.section>

        <motion.div className="tag-row ble-scan-tech-row" {...childMotion} transition={{ duration: 0.42, delay: 0.24 }}>
          {bleScanProject.tech.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="ble-scan-feature-visual"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.58, delay: 0.16, ease: "easeOut" }}
      >
        <BleScanVisualization />
      </motion.div>
    </motion.article>
  );
}

const iotLoggerProject = {
  category: "IoT Systems / Embedded Architecture / Cloud Integration",
  summary:
    "Architected an end-to-end embedded IoT data pipeline that collected data from BLE devices, buffered it locally, and uploaded it to AWS over cellular connectivity, with design decisions driven by reliability, bandwidth, and system constraints.",
  contributions: [
    "Designed the data flow architecture from BLE ingestion to local storage, cellular upload, and cloud processing.",
    "Implemented a local buffering strategy using flash-backed storage to preserve data during connectivity loss or upload delays.",
    "Evaluated MQTT for lightweight telemetry and HTTPS for larger payload or bulk data transfer.",
    "Built retry handling, batching, and failover behavior around unstable cellular availability.",
    "Analyzed tradeoffs across latency, reliability, power, and payload size.",
    "Helped shape a robust device-side design for real-world IoT conditions where connectivity is not guaranteed.",
  ],
  impact: [
    "Demonstrates device-to-cloud systems thinking.",
    "Improves data reliability by preventing loss during poor network conditions.",
    "Balances embedded constraints with cloud integration requirements.",
    "Designs around real-world failure modes instead of ideal lab conditions.",
    "Bridges firmware, storage strategy, communications, and cloud-facing architecture.",
  ],
  focus: [
    "Preserving data integrity during intermittent connectivity.",
    "Choosing protocols for different telemetry and payload patterns.",
    "Buffering efficiently without overcomplicating embedded control logic.",
    "Balancing power, latency, reliability, and payload size.",
    "Coordinating BLE, storage, cellular, and cloud layers in one architecture.",
  ],
  tech: ["BLE", "Cellular", "AWS", "MQTT", "HTTPS", "Local Buffering", "Embedded C/C++", "IoT Architecture", "Data Reliability"],
};

function IotLoggerVisualization() {
  const shouldReduceMotion = useReducedMotion();
  const packetTransition = (duration: number, delay = 0) => ({
    duration,
    delay,
    repeat: shouldReduceMotion ? 0 : Infinity,
    ease: "linear" as const,
  });
  const bleSources = [
    { id: "sensor-a", label: "BLE 01", detail: "temp", className: "iot-logger-source-a" },
    { id: "sensor-b", label: "BLE 02", detail: "usage", className: "iot-logger-source-b" },
    { id: "sensor-c", label: "BLE 03", detail: "state", className: "iot-logger-source-c" },
  ];
  const queueSlots = ["rx", "hold", "batch", "send", "ack"];
  const cloudRows = ["telemetry accepted", "bulk payload stored", "device shadow updated"];

  return (
    <div className="iot-logger-visual" aria-label="BLE devices to embedded buffer to cellular upload to AWS cloud ingestion architecture">
      <div className="iot-logger-grid" />
      <div className="iot-logger-lane iot-logger-lane-ingest" aria-hidden="true">
        {[0, 1, 2].map((packet) => (
          <motion.span
            key={packet}
            className="iot-logger-packet iot-logger-packet-ble"
            animate={shouldReduceMotion ? undefined : { left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={packetTransition(2.7, packet * 0.55)}
          />
        ))}
      </div>
      <div className="iot-logger-lane iot-logger-lane-cellular" aria-hidden="true">
        {[0, 1].map((packet) => (
          <motion.span
            key={packet}
            className="iot-logger-packet iot-logger-packet-upload"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    left: ["0%", "34%", "34%", "100%"],
                    opacity: [0, 1, 0.28, 1, 0],
                    scale: [0.9, 1, 0.88, 1, 0.9],
                  }
            }
            transition={packetTransition(5.4, packet * 1.6)}
          />
        ))}
      </div>
      <div className="iot-logger-lane iot-logger-lane-cloud" aria-hidden="true">
        {[0, 1].map((packet) => (
          <motion.span
            key={packet}
            className="iot-logger-packet iot-logger-packet-cloud"
            animate={shouldReduceMotion ? undefined : { top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
            transition={packetTransition(3.8, packet * 1.15 + 0.5)}
          />
        ))}
      </div>

      <section className="iot-logger-sources">
        <span className="iot-logger-stage-label">BLE ingestion</span>
        {bleSources.map((source, index) => (
          <motion.div
            key={source.id}
            className={`iot-logger-source ${source.className}`}
            animate={shouldReduceMotion ? undefined : { opacity: [0.64, 1, 0.7] }}
            transition={{ duration: 2.4, delay: index * 0.24, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="iot-logger-source-ring" />
            <strong>{source.label}</strong>
            <small>{source.detail}</small>
          </motion.div>
        ))}
      </section>

      <motion.section
        className="iot-logger-device"
        animate={shouldReduceMotion ? undefined : { boxShadow: ["0 0 0 rgba(83,146,255,0)", "0 0 32px rgba(83,146,255,0.14)", "0 0 0 rgba(83,146,255,0)"] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="iot-logger-stage-label">embedded device</span>
        <strong>Collector + Uploader</strong>
        <div className="iot-logger-device-tags">
          <span>BLE RX</span>
          <span>RTC</span>
          <span>FSM</span>
          <span>Modem</span>
        </div>
        <div className="iot-logger-buffer">
          <span className="iot-logger-buffer-head">flash queue</span>
          <div className="iot-logger-buffer-slots" aria-label="local buffered packet queue">
            {queueSlots.map((slot, index) => (
              <motion.span
                key={slot}
                animate={shouldReduceMotion ? undefined : { opacity: [0.38, 1, 0.56], y: [0, -2, 0] }}
                transition={{ duration: 2.2, delay: index * 0.22, repeat: Infinity, ease: "easeInOut" }}
              >
                {slot}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.section>

      <section className="iot-logger-network">
        <span className="iot-logger-stage-label">cellular uplink</span>
        <div className="iot-logger-signal">
          {[0, 1, 2, 3].map((bar) => (
            <motion.span
              key={bar}
              animate={shouldReduceMotion ? undefined : { opacity: bar === 3 ? [0.2, 0.7, 0.28] : [0.38, 1, 0.46] }}
              transition={{ duration: 3.4, delay: bar * 0.14, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
        <div className="iot-logger-protocols">
          <motion.span
            animate={shouldReduceMotion ? undefined : { borderColor: ["rgba(117,210,145,0.2)", "rgba(117,210,145,0.48)", "rgba(117,210,145,0.2)"] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          >
            MQTT telemetry
          </motion.span>
          <motion.span
            animate={shouldReduceMotion ? undefined : { borderColor: ["rgba(83,146,255,0.18)", "rgba(83,146,255,0.48)", "rgba(83,146,255,0.18)"] }}
            transition={{ duration: 3.6, delay: 0.65, repeat: Infinity, ease: "easeInOut" }}
          >
            HTTPS batch
          </motion.span>
        </div>
        <motion.div
          className="iot-logger-retry"
          animate={shouldReduceMotion ? undefined : { opacity: [0.42, 1, 0.5], x: [0, -3, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        >
          retry window -&gt; queue retained
        </motion.div>
      </section>

      <section className="iot-logger-cloud">
        <span className="iot-logger-stage-label">AWS endpoint</span>
        <div className="iot-logger-cloud-head">
          <strong>Cloud Ingestion</strong>
          <motion.span
            animate={shouldReduceMotion ? undefined : { opacity: [0.58, 1, 0.66] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            ack
          </motion.span>
        </div>
        <div className="iot-logger-cloud-rows">
          {cloudRows.map((row, index) => (
            <motion.div
              key={row}
              animate={shouldReduceMotion ? undefined : { backgroundColor: ["rgba(255,255,255,0.035)", "rgba(117,210,145,0.075)", "rgba(255,255,255,0.035)"] }}
              transition={{ duration: 3, delay: index * 0.34, repeat: Infinity, ease: "easeInOut" }}
            >
              <span />
              <small>{row}</small>
            </motion.div>
          ))}
        </div>
        <div className="iot-logger-cloud-detail">iot core / storage / processing</div>
      </section>

      <div className="iot-logger-status-strip">
        <span>offline tolerant</span>
        <strong>buffer -&gt; retry -&gt; deliver</strong>
      </div>
    </div>
  );
}

function IotLoggerProjectHighlight() {
  const shouldReduceMotion = useReducedMotion();
  const childMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <motion.article
      className="carousel-main iot-logger-feature-card"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.58, ease: "easeOut" }}
    >
      <div className="iot-logger-feature-copy">
        <motion.div {...childMotion} transition={{ duration: 0.42 }}>
          <span className="iot-logger-eyebrow">Featured system architecture project</span>
          <h3>IoT Data Logger (BLE + Cellular + AWS)</h3>
          <p className="iot-logger-category">{iotLoggerProject.category}</p>
          <p className="iot-logger-summary">{iotLoggerProject.summary}</p>
        </motion.div>

        <motion.div className="iot-logger-content-grid" {...childMotion} transition={{ duration: 0.42, delay: 0.08 }}>
          <section className="iot-logger-copy-block">
            <h4>Key Contributions</h4>
            <ul className="iot-logger-check-list">
              {iotLoggerProject.contributions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="iot-logger-copy-block iot-logger-impact-block">
            <h4>Impact</h4>
            <ul className="iot-logger-impact-list">
              {iotLoggerProject.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </motion.div>

        <motion.section className="iot-logger-copy-block" {...childMotion} transition={{ duration: 0.42, delay: 0.16 }}>
          <h4>Engineering Focus</h4>
          <div className="iot-logger-focus-grid">
            {iotLoggerProject.focus.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </motion.section>

        <motion.div className="tag-row iot-logger-tech-row" {...childMotion} transition={{ duration: 0.42, delay: 0.24 }}>
          {iotLoggerProject.tech.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="iot-logger-feature-visual"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.58, delay: 0.16, ease: "easeOut" }}
      >
        <IotLoggerVisualization />
      </motion.div>
    </motion.article>
  );
}

function Highlights() {
  const defaultProjectIndex = Math.max(
    0,
    highlights.findIndex((item) => item.featured === "memory-map"),
  );
  const [activeIndex, setActiveIndex] = useState(defaultProjectIndex);
  const [hasManualSelection, setHasManualSelection] = useState(false);

  const selectHighlight = useCallback((index: number) => {
    setHasManualSelection(true);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (hasManualSelection) return;

    const timer = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % highlights.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [hasManualSelection]);

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
          <div className="carousel carousel-full">
            {active.featured === "iot-logger" ? (
              <IotLoggerProjectHighlight />
            ) : active.featured === "memory-map" ? (
              <MemoryMapProjectHighlight />
            ) : active.featured === "ble-scan" ? (
              <BleScanProjectHighlight />
            ) : active.featured === "test-framework" ? (
              <TestFrameworkProjectHighlight />
            ) : active.featured === "dma-uart" ? (
              <DmaProjectHighlight />
            ) : (
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
            )}
            <div className="carousel-thumbs" role="tablist" aria-label="Work highlights">
              {highlights.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  className={`carousel-thumb ${index === activeIndex ? "is-active" : ""}`}
                  aria-selected={index === activeIndex}
                  role="tab"
                  onPointerDown={(event) => {
                    if (event.pointerType === "mouse" && event.button !== 0) return;
                    selectHighlight(index);
                  }}
                  onClick={() => selectHighlight(index)}
                  onDragStart={(event) => event.preventDefault()}
                >
                  <ProjectThumbnailVisual type={item.featured} title={item.title} />
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
