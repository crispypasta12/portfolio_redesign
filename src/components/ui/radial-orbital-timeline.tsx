"use client";
import { useState, useEffect, useRef, useSyncExternalStore, type ComponentType, type CSSProperties } from "react";

interface IconProps {
  size?: number;
  color?: string;
}

export interface RadialTimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: ComponentType<IconProps>;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  color?: string;
  ring?: 0 | 1 | 2;
}

export interface RadialTimelineRingMeta {
  label: string;
  caption: string;
  color: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: RadialTimelineItem[];
  ringMeta?: readonly RadialTimelineRingMeta[];
}

const DEFAULT_RING_META = [
  { label: "Languages", caption: "Core code", color: "rgba(168, 185, 204, 0.9)" },
  { label: "Firmware", caption: "Architecture + buses", color: "rgba(0, 145, 189, 0.9)" },
  { label: "Platforms", caption: "MCUs + cloud", color: "rgba(255, 153, 0, 0.9)" },
] as const;
const RING_RADII = [70, 138, 205] as const;
const RING_PHASE = [0, Math.PI / 6, Math.PI / 4] as const;
const RING_SPEEDS = [0.96, -0.68, 0.52] as const;
const CONTAINER_SIZE = 480;
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

const withAlpha = (rgba: string, alpha: number) => rgba.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);

const ArrowRightIcon = ({ size = 8 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const LinkIcon = ({ size = 10 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ZapIcon = ({ size = 10 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

interface SkillDetailCardProps {
  item: RadialTimelineItem;
  timelineData: RadialTimelineItem[];
  onSelectRelated: (id: number) => void;
  popoverAbove?: boolean;
  compact?: boolean;
}

function SkillDetailCard({ item, timelineData, onSelectRelated, popoverAbove = false, compact = false }: SkillDetailCardProps) {
  const cardStyle: CSSProperties = compact
    ? {
        width: "100%",
        background: "rgba(8,10,16,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.16)",
        borderRadius: "10px",
        boxShadow: "0 18px 42px rgba(0,0,0,0.38)",
        padding: "14px 16px",
      }
    : {
        position: "absolute",
        ...(popoverAbove ? { bottom: "calc(100% + 36px)" } : { top: "calc(100% + 36px)" }),
        left: "50%",
        transform: "translateX(-50%)",
        width: "256px",
        background: "rgba(8,10,16,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: "10px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 24px rgba(255,255,255,0.06)",
        padding: "14px 16px",
        zIndex: 300,
      };

  return (
    <div
      className={compact ? "skill-detail-dock-card" : "skill-detail-popover"}
      onClick={(e) => e.stopPropagation()}
      style={cardStyle}
    >
      {!compact && (
        <div
          style={{
            position: "absolute",
            ...(popoverAbove ? { bottom: "-12px" } : { top: "-12px" }),
            left: "50%",
            transform: "translateX(-50%)",
            width: "1px",
            height: "12px",
            background: "rgba(255,255,255,0.45)",
          }}
        />
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <span
          style={{
            fontSize: "0.62rem",
            fontFamily: '"JetBrains Mono", monospace',
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          {item.date}
        </span>
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "0.92rem",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        {item.title}
      </div>

      <p
        style={{
          marginTop: "6px",
          fontSize: "0.74rem",
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.55,
        }}
      >
        {item.content}
      </p>

      <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.66rem",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "6px",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <ZapIcon size={10} />
            Proficiency
          </span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', color: "rgba(255,215,130,0.95)" }}>
            {item.energy}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${item.energy}%`,
              background: `linear-gradient(90deg, ${item.color ?? "rgba(210,140,0,0.85)"}, rgba(255,180,80,0.95))`,
              borderRadius: "2px",
            }}
          />
        </div>
      </div>

      {item.relatedIds.length > 0 && (
        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "6px", gap: "5px" }}>
            <LinkIcon size={10} />
            <span
              style={{
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.6)",
                fontWeight: 600,
              }}
            >
              Connected Skills
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {item.relatedIds.map((relatedId) => {
              const relatedItem = timelineData.find((i) => i.id === relatedId);
              if (!relatedItem) return null;
              return (
                <button
                  key={relatedId}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRelated(relatedId);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    minHeight: "22px",
                    padding: "2px 8px",
                    fontSize: "0.62rem",
                    fontFamily: '"JetBrains Mono", monospace',
                    color: "rgba(255,255,255,0.85)",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "background 200ms ease, color 200ms ease, border-color 200ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "rgba(210,140,0,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
                  }}
                >
                  {relatedItem.title}
                  <ArrowRightIcon size={8} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RadialOrbitalTimeline({ timelineData, ringMeta = DEFAULT_RING_META }: RadialOrbitalTimelineProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
  const [orbitScale, setOrbitScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setHoveredNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((key) => {
        const k = parseInt(key);
        if (k !== id) newState[k] = false;
      });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const related = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        related.forEach((rId) => {
          newPulse[rId] = true;
        });
        setPulseEffect(newPulse);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  // Group items by ring so each item knows its index within its own ring
  const ringIndexById: Record<number, { ring: 0 | 1 | 2; indexInRing: number; ringTotal: number }> = {};
  ([0, 1, 2] as const).forEach((r) => {
    const ringItems = timelineData.filter((item) => (item.ring ?? 0) === r);
    ringItems.forEach((item, i) => {
      ringIndexById[item.id] = { ring: r, indexInRing: i, ringTotal: ringItems.length };
    });
  });

  useEffect(() => {
    if (!autoRotate) return;
    const timer = setInterval(() => {
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 60);
    return () => clearInterval(timer);
  }, [autoRotate]);

  useEffect(() => {
    const updateOrbitScale = () => {
      const availableWidth = Math.max(0, window.innerWidth - 64);
      setOrbitScale(Math.min(CONTAINER_SIZE, availableWidth) / CONTAINER_SIZE);
    };
    updateOrbitScale();
    window.addEventListener("resize", updateOrbitScale);
    return () => window.removeEventListener("resize", updateOrbitScale);
  }, []);

  const calculateNodePosition = (itemId: number) => {
    const meta = ringIndexById[itemId];
    if (!meta) return { x: 0, y: 0, zIndex: 100, opacity: 1 };
    const { ring, indexInRing, ringTotal } = meta;
    const radius = RING_RADII[ring];
    const phase = RING_PHASE[ring];
    const speed = RING_SPEEDS[ring];
    const baseAngle = (indexInRing / Math.max(1, ringTotal)) * 360;
    const angle = (baseAngle + rotationAngle * speed + (phase * 180) / Math.PI) % 360;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    const zIndex = Math.round(100 + 50 * Math.cos(radian)) + ring * 5;
    const opacity = Math.max(0.72, Math.min(1, 0.72 + 0.28 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const activeItem = activeNodeId ? timelineData.find((item) => item.id === activeNodeId) ?? null : null;
  const activePosition = activeItem ? calculateNodePosition(activeItem.id) : null;

  if (!isMounted) {
    return (
      <div
        style={{
          position: "relative",
          width: `min(${CONTAINER_SIZE}px, calc(100vw - 64px))`,
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="skill-orbit-shell"
      style={{
        width: `min(${CONTAINER_SIZE}px, calc(100vw - 64px))`,
        display: "grid",
        justifyItems: "center",
        gap: "14px",
      }}
    >
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
      <div
        ref={orbitRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${CONTAINER_SIZE}px`,
          height: `${CONTAINER_SIZE}px`,
          transform: `translate(-50%, -50%) scale(${orbitScale})`,
          transformOrigin: "center",
        }}
      >
        {/* Center hub */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "54px",
            height: "54px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(210,140,0,0.36), rgba(18,22,32,0.9) 62%, rgba(80,60,180,0.32))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 0 36px rgba(210,140,0,0.16)",
          }}
        >
          <div
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(4px)",
            }}
          />
        </div>

        {/* Concentric orbit rings */}
        {RING_RADII.map((r, i) => (
          <div
            key={`ring-${i}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${r * 2}px`,
              height: `${r * 2}px`,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              border: `1px solid ${withAlpha(ringMeta[i].color, 0.32 - i * 0.035)}`,
              boxShadow: [
                `0 0 ${26 + i * 6}px ${withAlpha(ringMeta[i].color, 0.22 - i * 0.03)}`,
                `0 0 ${52 + i * 8}px ${withAlpha(ringMeta[i].color, 0.12 - i * 0.018)}`,
                `inset 0 0 ${30 + i * 6}px ${withAlpha(ringMeta[i].color, 0.085)}`,
              ].join(", "),
              pointerEvents: "none",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            left: "22px",
            bottom: "22px",
            display: "grid",
            gap: "7px",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {ringMeta.map((ring) => (
            <div key={ring.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: ring.color,
                  boxShadow: `0 0 14px ${ring.color}`,
                }}
              />
              <span
                style={{
                  fontSize: "0.58rem",
                  lineHeight: 1,
                  color: "rgba(255,255,255,0.62)",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {ring.label}
              </span>
            </div>
          ))}
        </div>

        {activeItem && activePosition && activeItem.relatedIds.length > 0 && (
          <svg
            width={CONTAINER_SIZE}
            height={CONTAINER_SIZE}
            viewBox={`0 0 ${CONTAINER_SIZE} ${CONTAINER_SIZE}`}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 12,
              pointerEvents: "none",
              overflow: "visible",
            }}
          >
            {activeItem.relatedIds.map((relatedId) => {
              const relatedPosition = calculateNodePosition(relatedId);
              const startX = CONTAINER_SIZE / 2 + activePosition.x;
              const startY = CONTAINER_SIZE / 2 + activePosition.y;
              const endX = CONTAINER_SIZE / 2 + relatedPosition.x;
              const endY = CONTAINER_SIZE / 2 + relatedPosition.y;
              const controlX = CONTAINER_SIZE / 2 + (activePosition.x + relatedPosition.x) * 0.35;
              const controlY = CONTAINER_SIZE / 2 + (activePosition.y + relatedPosition.y) * 0.35;

              return (
                <path
                  key={`connection-${activeItem.id}-${relatedId}`}
                  d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                  fill="none"
                  stroke={activeItem.color ?? "rgba(210,140,0,0.85)"}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeDasharray="4 7"
                  opacity="0.55"
                />
              );
            })}
          </svg>
        )}

        {timelineData.map((item) => {
          const position = calculateNodePosition(item.id);
          const popoverAbove = position.y > 0;
          const isExpanded = !!expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isHovered = hoveredNodeId === item.id;
          const showLabel = isExpanded || isRelated || isHovered;
          const isPulsing = !!pulseEffect[item.id];
          const Icon = item.icon;
          const accent = item.color ?? "rgba(210, 140, 0, 0.9)";

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[item.id] = el;
              }}
              onMouseEnter={() => setHoveredNodeId(item.id)}
              onMouseLeave={() => setHoveredNodeId((current) => (current === item.id ? null : current))}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
                cursor: "pointer",
                outline: "none",
                transition: "opacity 700ms cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {/* Glow halo */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${item.energy * 0.5 + 40}px`,
                  height: `${item.energy * 0.5 + 40}px`,
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${accent}33 0%, ${accent}00 70%)`,
                  opacity: isExpanded ? 0.75 : isRelated || isHovered ? 0.42 : 0,
                  animation: isPulsing ? "orbit-pulse 1.8s ease-in-out infinite" : undefined,
                  transition: "opacity 260ms ease",
                  pointerEvents: "none",
                }}
              />

              {/* Node */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
                onFocus={() => setHoveredNodeId(item.id)}
                onBlur={() => setHoveredNodeId((current) => (current === item.id ? null : current))}
                aria-expanded={isExpanded}
                aria-label={`${item.title} skill details`}
                style={{
                  width: "44px",
                  height: "44px",
                  padding: 0,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isExpanded
                    ? "rgba(255,255,255,0.96)"
                    : isRelated
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(8,10,16,0.85)",
                  color: isExpanded || isRelated ? "#0a0c10" : "#fff",
                  border: `2px solid ${isExpanded ? accent : isRelated ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)"}`,
                  boxShadow: isExpanded
                    ? `0 0 20px ${accent}58, 0 0 38px ${accent}26`
                    : isHovered
                      ? `0 8px 28px rgba(0,0,0,0.42), 0 0 18px ${accent}36`
                      : "0 4px 18px rgba(0,0,0,0.32)",
                  transition: "transform 300ms ease, background 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
                  transform: isExpanded ? "scale(1.28)" : isHovered ? "scale(1.08)" : "scale(1)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                  appearance: "none",
                }}
              >
                <Icon size={18} color={isExpanded || isRelated ? "#0a0c10" : "#fff"} />
              </button>

              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: "50%",
                  transform: `translateX(-50%) translateY(${showLabel ? "0" : "4px"}) ${isExpanded ? "scale(1.08)" : "scale(1)"}`,
                  whiteSpace: "nowrap",
                  fontSize: "0.68rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: isExpanded ? "#fff" : "rgba(255,255,255,0.74)",
                  opacity: showLabel ? 1 : 0,
                  transition: "color 300ms ease, transform 300ms ease, opacity 220ms ease",
                  pointerEvents: "none",
                }}
              >
                {item.title}
              </div>

              {/* Expanded card */}
              {isExpanded && (
                <SkillDetailCard
                  item={item}
                  timelineData={timelineData}
                  onSelectRelated={toggleItem}
                  popoverAbove={popoverAbove}
                />
              )}
            </div>
          );
        })}
      </div>
      </div>
      {activeItem && (
        <div className="skill-detail-dock" style={{ width: "min(100%, 360px)", position: "relative", zIndex: 4 }}>
          <SkillDetailCard item={activeItem} timelineData={timelineData} onSelectRelated={toggleItem} compact />
        </div>
      )}
    </div>
  );
}
