"use client";
import { useState, useEffect, useRef, useSyncExternalStore, type ComponentType } from "react";

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

interface RadialOrbitalTimelineProps {
  timelineData: RadialTimelineItem[];
}

const RING_RADII = [70, 138, 205] as const;
const RING_PHASE = [0, Math.PI / 6, Math.PI / 4] as const;
const RING_SPEEDS = [1, -0.7, 0.55] as const;
const CONTAINER_SIZE = 480;
const emptySubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

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

const getStatusStyle = (status: RadialTimelineItem["status"]) => {
  switch (status) {
    case "completed":
      return { background: "rgba(210, 140, 0, 0.18)", color: "rgba(255, 215, 130, 0.95)", border: "1px solid rgba(210, 140, 0, 0.45)" };
    case "in-progress":
      return { background: "rgba(255, 255, 255, 0.92)", color: "#0a0c10", border: "1px solid rgba(255, 255, 255, 0.6)" };
    case "pending":
      return { background: "rgba(255, 255, 255, 0.06)", color: "rgba(255, 255, 255, 0.7)", border: "1px solid rgba(255, 255, 255, 0.18)" };
  }
};

const statusLabel = (status: RadialTimelineItem["status"]) =>
  status === "completed" ? "PROVEN" : status === "in-progress" ? "ACTIVE" : "EXPLORING";

export default function RadialOrbitalTimeline({ timelineData }: RadialOrbitalTimelineProps) {
  const isMounted = useSyncExternalStore(emptySubscribe, clientSnapshot, serverSnapshot);
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [orbitScale, setOrbitScale] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
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
    }, 50);
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
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

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
      ref={containerRef}
      onClick={handleContainerClick}
      style={{
        position: "relative",
        width: `min(${CONTAINER_SIZE}px, calc(100vw - 64px))`,
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
        {/* Center pulse */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "64px",
            height: "64px",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "linear-gradient(145deg, rgba(210,140,0,0.55), rgba(180,80,0,0.45) 60%, rgba(80,60,180,0.55))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
            boxShadow: "0 0 60px rgba(210,140,0,0.25), 0 0 120px rgba(210,140,0,0.1)",
            animation: "orbit-pulse 2s ease-in-out infinite",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)",
              animation: "orbital-ping 1.6s cubic-bezier(0,0,0.2,1) infinite",
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              animation: "orbital-ping 1.6s cubic-bezier(0,0,0.2,1) 0.5s infinite",
              opacity: 0.5,
            }}
          />
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.85)",
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
              border: `1px solid rgba(210, 140, 0, ${0.22 - i * 0.05})`,
              boxShadow: i === 0 ? "inset 0 0 40px rgba(210, 140, 0, 0.04)" : undefined,
              pointerEvents: "none",
            }}
          />
        ))}

        {timelineData.map((item) => {
          const position = calculateNodePosition(item.id);
          const popoverAbove = position.y < 0;
          const isExpanded = !!expandedItems[item.id];
          const isRelated = isRelatedToActive(item.id);
          const isPulsing = !!pulseEffect[item.id];
          const Icon = item.icon;
          const accent = item.color ?? "rgba(210, 140, 0, 0.9)";

          return (
            <div
              key={item.id}
              ref={(el) => {
                nodeRefs.current[item.id] = el;
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
                zIndex: isExpanded ? 200 : position.zIndex,
                opacity: isExpanded ? 1 : position.opacity,
                cursor: "pointer",
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
                  animation: isPulsing ? "orbit-pulse 1.8s ease-in-out infinite" : undefined,
                  pointerEvents: "none",
                }}
              />

              {/* Node */}
              <div
                style={{
                  width: "44px",
                  height: "44px",
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
                    ? `0 0 24px ${accent}66, 0 0 48px ${accent}33`
                    : "0 4px 20px rgba(0,0,0,0.35)",
                  transition: "transform 300ms ease, background 300ms ease, border-color 300ms ease, box-shadow 300ms ease",
                  transform: isExpanded ? "scale(1.4)" : "scale(1)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Icon size={18} color={isExpanded || isRelated ? "#0a0c10" : "#fff"} />
              </div>

              {/* Label */}
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: "50%",
                  transform: `translateX(-50%) ${isExpanded ? "scale(1.15)" : "scale(1)"}`,
                  whiteSpace: "nowrap",
                  fontSize: "0.68rem",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: isExpanded ? "#fff" : "rgba(255,255,255,0.7)",
                  transition: "color 300ms ease, transform 300ms ease",
                  pointerEvents: "none",
                }}
              >
                {item.title}
              </div>

              {/* Expanded card */}
              {isExpanded && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    ...(popoverAbove
                      ? { bottom: "calc(100% + 36px)" }
                      : { top: "calc(100% + 36px)" }),
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "256px",
                    background: "rgba(8,10,16,0.92)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "12px",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 0 24px rgba(255,255,255,0.06)",
                    padding: "14px 16px",
                    zIndex: 300,
                  }}
                >
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
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        ...getStatusStyle(item.status),
                        padding: "2px 8px",
                        borderRadius: "999px",
                        fontSize: "0.62rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                      }}
                    >
                      {statusLabel(item.status)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.62rem",
                        fontFamily: '"JetBrains Mono", monospace',
                        color: "rgba(255,255,255,0.5)",
                        letterSpacing: "0.06em",
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
                          background: "linear-gradient(90deg, rgba(210,140,0,0.85), rgba(255,180,80,0.95))",
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
                                toggleItem(relatedId);
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                height: "22px",
                                padding: "0 8px",
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
