import * as React from "react";
import "./TiltedGridHero.css";

/* ── the curved row ──────────────────────────────────────────────
 * One row of images streams from right to left around the inside of a
 * cylinder. The centre faces you flat, the ends bend toward you so each
 * end image curves along its length, and the ends fade into the page.
 *
 * A CSS box can't bend, so every tile is cut into SLICES vertical strips,
 * each a flat facet of the cylinder showing its share of the image. The
 * strips sit still inside their tile, each turned its own few degrees
 * round the cylinder's axis, and the tile (preserve-3d) is what moves: one
 * rotateY about that same axis carries the whole tile along the arc. A
 * tile is one animation, so its strips can never drift apart or show
 * different images. Only a tile's delay differs, and that sets where on
 * the arc it sits. The band is transform-only on the compositor; the fade
 * is a static mask over it.
 *
 * The only JS is a ResizeObserver that sizes the loop, and a handler that
 * hands a tile its next image each time it wraps, out of sight.
 * ─────────────────────────────────────────────────────────────── */

// Strips per tile. Each is a few degrees of arc, too little to read as a
// facet; fewer starts to show corners along the top and bottom edges.
const SLICES = 16;

// Camera distance from the screen, as a multiple of the cylinder's radius.
const CAMERA = 1.6;

// Cylinder radius, as a share of the hero's width, that puts the frame's
// edge `bend` radians round the arc as seen through the camera.
function arc(bend) {
  return (CAMERA - 1 + Math.cos(bend)) / (2 * CAMERA * Math.sin(bend));
}

// A tile is never wider than this share of the hero, so a phone still
// shows its neighbours instead of one tile edge to edge.
const MAX_WIDTH = 55;

// Lays the loop on the cylinder: how many tiles it needs, and the angles
// that place each one along the arc.
function measure(width, height, tile, aspect, gap, bend) {
  const h = Math.min(
    (tile / 100) * height,
    ((MAX_WIDTH / 100) * width) / aspect,
  );
  const radius = width * arc(bend);
  if (!(h > 0) || !(radius > 0))
    return { columns: 2, sweep: 0, unit: 0, limit: 0 };
  const deg = (rad) => (rad * 180) / Math.PI;
  const unit = deg(h / radius);
  const pitch = (aspect + gap / 100) * unit;
  const limit = deg(bend) + (aspect * unit) / 2;
  const columns = Math.min(60, Math.max(2, Math.ceil((2 * limit) / pitch)));
  const round = (n) => +n.toFixed(4);
  const sweep = round((columns * pitch) / 2);
  return {
    columns,
    sweep,
    unit: round(unit),
    limit: round(Math.min(sweep, limit)),
  };
}

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Carrusel curvo de imágenes en forma de cilindro. `images` es el array de
 * portadas a mostrar; el resto de props controla velocidad y curvatura.
 */
export function TiltedGridHero({
  images,
  speed = 4,
  tileHeight = 26,
  aspectRatio = 16 / 9,
  gap = 6,
  axis = 56,
  curve = 80,
  fade = 12,
  children,
  className,
  style,
  ...props
}) {
  const ref = React.useRef(null);
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const orbit = `tgh-o-${id}`;
  const tile = `tgh-t-${id}`;
  const bend = (Math.min(85, Math.max(5, curve)) * Math.PI) / 180;

  // Null hasta que el observer mide el hero: la banda queda oculta hasta
  // entonces, para que no se vea un primer paint con el tamaño equivocado.
  const [layout, setLayout] = React.useState(null);

  // Qué imagen muestra cada tile (posición dentro de la lista `images`).
  // Solo cambia cuando el tile da la vuelta, fuera de vista.
  const [shown, setShown] = React.useState({});

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = measure(width, height, tileHeight, aspectRatio, gap, bend);
      setLayout((prev) =>
        prev?.columns === next.columns &&
        prev.sweep === next.sweep &&
        prev.unit === next.unit
          ? prev
          : next,
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [tileHeight, aspectRatio, gap, bend]);

  // Precarga todas las imágenes; un tile recién recibe la siguiente justo
  // antes de reaparecer, demasiado tarde para empezar a cargarla ahí.
  React.useEffect(() => {
    for (const { src } of images) new Image().src = src;
  }, [images]);

  const { columns, sweep, unit, limit } =
    layout ?? measure(1200, 560, tileHeight, aspectRatio, gap, bend);

  // Cada longitud es un múltiplo de la altura del tile.
  const u = (n) =>
    `calc(${+n.toFixed(4)} * min(${tileHeight}cqh, ${+(
      MAX_WIDTH / aspectRatio
    ).toFixed(4)}cqw))`;

  const r = 100 * arc(bend);
  const radius = `${+r.toFixed(3)}cqw`;
  const turn = (deg) =>
    `translateZ(${radius}) rotateY(${+deg.toFixed(4)}deg) translateZ(-${radius})`;

  // Más allá de `limit` un tile está completamente fuera de vista.
  const hide = +(((sweep - limit) / (2 * sweep || 1)) * 100).toFixed(4);
  const css =
    `@keyframes ${orbit}{` +
    `from{transform:${turn(-sweep)}}to{transform:${turn(sweep)}}` +
    `0%,${hide}%,${100 - hide}%,100%{visibility:hidden}` +
    `${hide + 0.001}%,${100 - hide - 0.001}%{visibility:visible}}` +
    `@media(prefers-reduced-motion:reduce){.${tile}{animation-play-state:paused}}`;

  const share = aspectRatio / SLICES;
  const duration = columns * speed;
  const mask = `linear-gradient(90deg,transparent,#000 ${fade}%,#000 ${
    100 - fade
  }%,transparent)`;

  return (
    <div
      ref={ref}
      className={cx("tilted-grid-hero", className)}
      {...props}
      style={{ containerType: "size", ...style }}
    >
      <style>{css}</style>

      <div
        aria-hidden
        className="tgh-band"
        style={{
          opacity: layout ? 1 : 0,
          perspective: `${+(r * CAMERA).toFixed(3)}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      >
        {Array.from({ length: columns }, (_, t) => {
          const first = columns - 1 - t;
          const img = images[(shown[t] ?? first) % Math.max(images.length, 1)];
          return (
            <div
              key={t}
              className={cx(tile, "tgh-tile")}
              style={{
                left: `calc(50% - ${u(aspectRatio / 2)})`,
                top: `calc(${axis}% - ${u(0.5)})`,
                width: u(aspectRatio),
                height: u(1),
                transformStyle: "preserve-3d",
                animation: `${orbit} ${duration}s linear ${-t * speed}s infinite`,
              }}
              onAnimationIteration={(e) => {
                const lap = Math.round(e.elapsedTime / duration);
                setShown((prev) => {
                  const next = lap * columns + first;
                  return prev[t] === next ? prev : { ...prev, [t]: next };
                });
              }}
            >
              {Array.from({ length: SLICES }, (_, k) => (
                <div
                  key={k}
                  className={cx(
                    "tgh-slice",
                    k === 0 && "tgh-slice--first",
                    k === SLICES - 1 && "tgh-slice--last",
                  )}
                  style={{
                    left: u((aspectRatio - share) / 2),
                    width:
                      k === SLICES - 1 ? u(share) : `calc(${u(share)} + 1px)`,
                    height: u(1),
                    transform: turn(
                      (aspectRatio / 2 - (k + 0.5) * share) * unit,
                    ),
                  }}
                >
                  {img ? (
                    <img
                      src={img.src}
                      alt={k === 0 ? (img.alt ?? "") : ""}
                      draggable={false}
                      className="tgh-img"
                      style={{
                        left: u(-k * share),
                        width: u(aspectRatio),
                        height: u(1),
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {children}
    </div>
  );
}

export default TiltedGridHero;
