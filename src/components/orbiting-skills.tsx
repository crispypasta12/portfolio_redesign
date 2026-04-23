"use client";
import { useEffect, useState, memo } from "react";

type SkillId = "c" | "cpp" | "python" | "arm" | "freertos" | "aws" | "stm32" | "esp32" | "nrf52";

interface SkillConfig {
  id: SkillId;
  orbitRadius: number;
  size: number;
  speed: number;
  phaseShift: number;
  label: string;
  color: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkle: boolean;
  duration: number;
  delay: number;
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function createParticles(count: number): Particle[] {
  const random = createSeededRandom(0x5a17c3d9);

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Number((4 + random() * 92).toFixed(4)),
    y: Number((4 + random() * 92).toFixed(4)),
    size: Number((0.8 + random() * 1.8).toFixed(4)),
    opacity: Number((0.05 + random() * 0.22).toFixed(6)),
    twinkle: random() > 0.45,
    duration: Number((3 + random() * 5).toFixed(6)),
    delay: Number((random() * 4).toFixed(6)),
  }));
}

const particles = createParticles(24);

const ICONS: Record<SkillId, () => React.JSX.Element> = {
  c: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M19.07 6.93A10 10 0 1 0 21 12a10 10 0 0 0-1.93-5.07zM12 20a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
        fill="#A8B9CC"
      />
      <path
        d="M17.54 10.18A5.93 5.93 0 0 0 12 6.5a5.5 5.5 0 1 0 0 11 5.93 5.93 0 0 0 5.54-3.68h-2.11A3.77 3.77 0 0 1 12 15.5a3.5 3.5 0 1 1 0-7 3.77 3.77 0 0 1 3.43 1.68z"
        fill="#A8B9CC"
      />
    </svg>
  ),
  cpp: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M10.5 15.5a3.5 3.5 0 1 1 0-7 3.77 3.77 0 0 1 3.43 1.68h2.11A5.93 5.93 0 0 0 10.5 6.5a5.5 5.5 0 1 0 0 11 5.93 5.93 0 0 0 5.54-3.68h-2.11A3.77 3.77 0 0 1 10.5 15.5z"
        fill="#00599C"
      />
      <path d="M18 11h-1v-1h-1v1h-1v1h1v1h1v-1h1z" fill="#00599C" />
      <path d="M21 11h-1v-1h-1v1h-1v1h1v1h1v-1h1z" fill="#00599C" />
    </svg>
  ),
  python: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M11.914 2C9.485 2 7.6 3.152 7.6 5.133V6.8h4.571v.571H5.486C3.514 7.371 2 9.371 2 12.114c0 2.743 1.514 4.458 3.486 4.458h1.143V14.8c0-2.171 1.657-3.6 3.829-3.6h5.028c1.829 0 3.086-1.343 3.086-3.2V5.133C18.571 3.152 16.628 2 11.914 2zm-1.6 2.114a.914.914 0 1 1 0 1.829.914.914 0 0 1 0-1.829z"
        fill="#3776AB"
      />
      <path
        d="M12.086 22c2.429 0 4.314-1.152 4.314-3.133V17.2H11.83v-.571h6.685C20.486 16.629 22 14.629 22 11.886c0-2.743-1.514-4.458-3.486-4.458h-1.143v1.772c0 2.171-1.657 3.6-3.829 3.6H8.514c-1.829 0-3.086 1.343-3.086 3.2v3.867C5.428 20.848 7.371 22 12.086 22zm1.6-2.114a.914.914 0 1 1 0-1.829.914.914 0 0 1 0 1.829z"
        fill="#FFD43B"
      />
    </svg>
  ),
  arm: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="2" fill="none" stroke="#0091BD" strokeWidth="1.5" />
      <rect x="7" y="4" width="1.5" height="3" fill="#0091BD" />
      <rect x="10.25" y="4" width="1.5" height="3" fill="#0091BD" />
      <rect x="13.5" y="4" width="1.5" height="3" fill="#0091BD" />
      <rect x="7" y="17" width="1.5" height="3" fill="#0091BD" />
      <rect x="10.25" y="17" width="1.5" height="3" fill="#0091BD" />
      <rect x="13.5" y="17" width="1.5" height="3" fill="#0091BD" />
      <rect x="5" y="9.5" width="14" height="5" rx="1" fill="#0091BD" opacity="0.2" />
      <text x="12" y="13.5" textAnchor="middle" fontSize="4.5" fontWeight="700" fill="#0091BD" fontFamily="sans-serif" letterSpacing="0.5">ARM</text>
    </svg>
  ),
  freertos: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="#D2820A" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="12" y2="6" stroke="#D2820A" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="15.5" y2="14" stroke="#D2820A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.2" fill="#D2820A" />
      <text x="12" y="21.5" textAnchor="middle" fontSize="3" fontWeight="600" fill="#D2820A" fontFamily="monospace">RTOS</text>
    </svg>
  ),
  aws: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path
        d="M6.76 10.49c0-.45.05-.81.14-1.07.1-.27.23-.56.41-.88a.53.53 0 0 0 .08-.27c0-.12-.07-.24-.22-.36l-.72-.47c-.1-.07-.21-.1-.3-.1-.12 0-.24.06-.36.18a3.7 3.7 0 0 0-.44.58 4.05 4.05 0 0 0-.39 1c-.54-.63-1.2-.95-2-.95-.58 0-1.05.16-1.4.49-.35.33-.52.77-.52 1.31 0 .57.2 1.03.6 1.37.4.34.92.51 1.57.51.22 0 .44-.02.66-.06.22-.04.45-.1.7-.19v.56c0 .36-.08.62-.23.78-.15.16-.41.24-.78.24-.17 0-.34-.02-.52-.05a3.5 3.5 0 0 1-.52-.16l-.52-.2a1.26 1.26 0 0 0-.38-.09c-.13 0-.2.1-.2.29v.46c0 .15.02.26.06.33.04.07.12.14.23.2.21.11.46.2.76.27.3.07.62.1.95.1.71 0 1.24-.16 1.58-.49.34-.33.51-.83.51-1.5v-1.99z"
        fill="#FF9900"
      />
      <path
        d="M3.54 11.98c-.17.12-.42.18-.74.18-.34 0-.61-.07-.8-.22-.2-.14-.29-.36-.29-.64 0-.29.1-.51.3-.66.2-.15.48-.22.84-.22.14 0 .28.01.42.04.14.03.28.07.43.12v1.22c-.04.07-.1.13-.16.18z"
        fill="#FF9900"
      />
      <path
        d="M21.5 14.5a.85.85 0 0 1-.6-.25l-1.4-1.4a5.52 5.52 0 0 1-3.5 1.15A5.5 5.5 0 1 1 21.5 8.5v6z"
        fill="none"
        stroke="#FF9900"
        strokeWidth="1.3"
      />
      <path
        d="M8 17.5c1.5 1 3.3 1.5 5 1.5 2 0 4.1-.7 5.7-2"
        fill="none"
        stroke="#FF9900"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path d="M19.5 16l1 1.5-1 .5" fill="none" stroke="#FF9900" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  stm32: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="2" fill="none" stroke="#0099E0" strokeWidth="1.5" />
      <rect x="7" y="4" width="1.5" height="3" fill="#0099E0" />
      <rect x="10.25" y="4" width="1.5" height="3" fill="#0099E0" />
      <rect x="13.5" y="4" width="1.5" height="3" fill="#0099E0" />
      <rect x="7" y="17" width="1.5" height="3" fill="#0099E0" />
      <rect x="10.25" y="17" width="1.5" height="3" fill="#0099E0" />
      <rect x="13.5" y="17" width="1.5" height="3" fill="#0099E0" />
      <rect x="5" y="9.5" width="14" height="5" rx="1" fill="#0099E0" opacity="0.15" />
      <text x="12" y="13.2" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="#0099E0" fontFamily="sans-serif" letterSpacing="0.2">STM32</text>
    </svg>
  ),
  esp32: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <line x1="12" y1="2.5" x2="12" y2="5.5" stroke="#E7332A" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="2" r="1" fill="#E7332A" />
      <rect x="3" y="5.5" width="18" height="10.5" rx="2" fill="none" stroke="#E7332A" strokeWidth="1.5" />
      <rect x="7" y="16" width="1.5" height="3" fill="#E7332A" />
      <rect x="10.25" y="16" width="1.5" height="3" fill="#E7332A" />
      <rect x="13.5" y="16" width="1.5" height="3" fill="#E7332A" />
      <rect x="5" y="8" width="14" height="5" rx="1" fill="#E7332A" opacity="0.15" />
      <text x="12" y="12.3" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="#E7332A" fontFamily="sans-serif" letterSpacing="0.2">ESP32</text>
    </svg>
  ),
  nrf52: () => (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" rx="2" fill="none" stroke="#00A9E0" strokeWidth="1.5" />
      <rect x="7" y="4" width="1.5" height="3" fill="#00A9E0" />
      <rect x="10.25" y="4" width="1.5" height="3" fill="#00A9E0" />
      <rect x="13.5" y="4" width="1.5" height="3" fill="#00A9E0" />
      <rect x="7" y="17" width="1.5" height="3" fill="#00A9E0" />
      <rect x="10.25" y="17" width="1.5" height="3" fill="#00A9E0" />
      <rect x="13.5" y="17" width="1.5" height="3" fill="#00A9E0" />
      <rect x="5" y="9.5" width="14" height="5" rx="1" fill="#00A9E0" opacity="0.15" />
      <text x="12" y="13.2" textAnchor="middle" fontSize="3.8" fontWeight="700" fill="#00A9E0" fontFamily="sans-serif" letterSpacing="0.2">nRF52</text>
    </svg>
  ),
};

const skillsConfig: SkillConfig[] = [
  { id: "c",        orbitRadius: 92,  size: 44, speed:  0.55, phaseShift: 0,                   label: "C",            color: "#A8B9CC" },
  { id: "cpp",      orbitRadius: 92,  size: 44, speed:  0.55, phaseShift: (2 * Math.PI) / 3,   label: "C++",          color: "#00599C" },
  { id: "python",   orbitRadius: 92,  size: 44, speed:  0.55, phaseShift: (4 * Math.PI) / 3,   label: "Python",       color: "#3776AB" },
  { id: "arm",      orbitRadius: 158, size: 48, speed: -0.35, phaseShift: 0,                   label: "ARM Cortex-M", color: "#0091BD" },
  { id: "freertos", orbitRadius: 158, size: 48, speed: -0.35, phaseShift: (2 * Math.PI) / 3,   label: "FreeRTOS",     color: "#D2820A" },
  { id: "aws",      orbitRadius: 158, size: 48, speed: -0.35, phaseShift: (4 * Math.PI) / 3,   label: "AWS IoT",      color: "#FF9900" },
  { id: "stm32",    orbitRadius: 215, size: 44, speed:  0.20, phaseShift: 0,                   label: "STM32",        color: "#0099E0" },
  { id: "esp32",    orbitRadius: 215, size: 44, speed:  0.20, phaseShift: (2 * Math.PI) / 3,   label: "ESP32",        color: "#E7332A" },
  { id: "nrf52",    orbitRadius: 215, size: 44, speed:  0.20, phaseShift: (4 * Math.PI) / 3,   label: "nRF52",        color: "#00A9E0" },
];

const OrbitRing = memo(({ radius, delay = 0 }: { radius: number; delay?: number }) => (
  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: `${radius * 2}px`,
      height: `${radius * 2}px`,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      border: "1px solid rgba(210, 140, 0, 0.22)",
      boxShadow: "0 0 40px rgba(210, 140, 0, 0.06), inset 0 0 40px rgba(210, 140, 0, 0.04)",
      animation: `orbit-pulse 4s ease-in-out ${delay}s infinite`,
      pointerEvents: "none",
    }}
  />
));
OrbitRing.displayName = "OrbitRing";

const SkillNode = memo(({ config, angle }: { config: SkillConfig; angle: number }) => {
  const [hovered, setHovered] = useState(false);
  const x = Number((Math.cos(angle) * config.orbitRadius).toFixed(3));
  const y = Number((Math.sin(angle) * config.orbitRadius).toFixed(3));
  const Icon = ICONS[config.id];

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: `${config.size}px`,
        height: `${config.size}px`,
        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
        zIndex: hovered ? 20 : 10,
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "9px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${hovered ? `${config.color}55` : "rgba(255,255,255,0.09)"}`,
          boxShadow: hovered
            ? `0 0 24px ${config.color}44, 0 0 48px ${config.color}22`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
          transform: hovered ? "scale(1.25)" : "scale(1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Icon />
      </div>
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "-28px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "3px 8px",
            background: "rgba(8,10,16,0.92)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "0.68rem",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            fontFamily: '"JetBrains Mono", monospace',
            backdropFilter: "blur(8px)",
          }}
        >
          {config.label}
        </div>
      )}
    </div>
  );
});
SkillNode.displayName = "SkillNode";

export function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    let id: number;
    let last = performance.now();
    const tick = (now: number) => {
      setTime((t) => t + (now - last) / 1000);
      last = now;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [paused]);

  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div style={{ position: "relative", width: "480px", height: "480px", flexShrink: 0 }}>

        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                animation: p.twinkle
                  ? `orbit-pulse ${p.duration}s ${p.delay}s ease-in-out infinite`
                  : undefined,
              }}
            />
          </div>
        ))}

        <OrbitRing radius={92} delay={0} />
        <OrbitRing radius={158} delay={1.5} />
        <OrbitRing radius={215} delay={3} />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 0 60px rgba(210,140,0,0.18), 0 0 120px rgba(210,140,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="7" width="16" height="10" rx="2" stroke="rgba(210,140,0,0.9)" strokeWidth="1.4" fill="none"/>
            <rect x="2" y="10" width="2" height="4" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="20" y="10" width="2" height="4" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="8" y="4" width="1.2" height="3" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="11.4" y="4" width="1.2" height="3" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="14.8" y="4" width="1.2" height="3" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="8" y="17" width="1.2" height="3" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="11.4" y="17" width="1.2" height="3" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="14.8" y="17" width="1.2" height="3" rx="0.5" fill="rgba(210,140,0,0.9)"/>
            <rect x="7" y="9.5" width="10" height="5" rx="0.8" fill="rgba(210,140,0,0.12)"/>
            <line x1="9" y1="12" x2="15" y2="12" stroke="rgba(210,140,0,0.7)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="12" y1="10" x2="12" y2="14" stroke="rgba(210,140,0,0.7)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>

        {skillsConfig.map((config) => (
          <SkillNode
            key={config.id}
            config={config}
            angle={time * config.speed + config.phaseShift}
          />
        ))}
      </div>
    </div>
  );
}
