"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bodies,
  Body,
  Constraint,
  Engine,
  Render,
  Runner,
  World,
  type Body as MatterBody,
} from "matter-js";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

type PotholeMiniGameProps = {
  onChallengeClear?: () => void;
};

export function PotholeMiniGame({ onChallengeClear }: PotholeMiniGameProps) {
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState<"safe" | "wobbling" | "crashed">(
    "safe",
  );
  const [challengeCleared, setChallengeCleared] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const bodyRefs = useRef<{ platform?: MatterBody; frontWheel?: MatterBody; rearWheel?: MatterBody }>({});

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const engine = Engine.create();
    engineRef.current = engine;

    const ground = Bodies.rectangle(220, 260, 430, 18, { isStatic: true });
    const platform = Bodies.rectangle(210, 170, 170, 18, {
      density: 0.004,
      friction: 0.75,
      restitution: 0.12,
    });
    const frontWheel = Bodies.circle(150, 220, 24, {
      density: 0.004,
      friction: 0.9,
      restitution: 0.08,
    });
    const rearWheel = Bodies.circle(280, 220, 24, {
      density: 0.004,
      friction: 0.9,
      restitution: 0.08,
    });

    const leftConstraint = Constraint.create({
      bodyA: platform,
      pointA: { x: -60, y: 6 },
      bodyB: frontWheel,
      pointB: { x: 0, y: 0 },
      stiffness: 0.8,
      damping: 0.2,
    });

    const rightConstraint = Constraint.create({
      bodyA: platform,
      pointA: { x: 60, y: 6 },
      bodyB: rearWheel,
      pointB: { x: 0, y: 0 },
      stiffness: 0.8,
      damping: 0.2,
    });

    const potholes = [
      Bodies.rectangle(120, 250, 60, 24, { isStatic: true }),
      Bodies.rectangle(220, 250, 76, 18, { isStatic: true }),
      Bodies.rectangle(330, 250, 54, 22, { isStatic: true }),
    ];

    bodyRefs.current = {
      platform,
      frontWheel,
      rearWheel,
    };

    World.add(engine.world, [
      ground,
      platform,
      frontWheel,
      rearWheel,
      leftConstraint,
      rightConstraint,
      ...potholes,
    ]);

    const root = canvasRef.current;
    const render = Render.create({
      element: root,
      engine,
      options: {
        width: 420,
        height: 280,
        wireframes: false,
        background: "transparent",
        pixelRatio: 1,
      },
    });

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const tick = () => {
      if (!engineRef.current) return;

      const platformBody = bodyRefs.current.platform;
      if (!platformBody) return;

      const angle = platformBody.angle;
      const nextBalance = clamp(angle * 85, -100, 100);
      setBalance(nextBalance);

      if (Math.abs(angle) > 0.82) {
        setStatus("crashed");
      } else if (Math.abs(angle) > 0.32) {
        setStatus("wobbling");
      } else {
        setStatus("safe");
      }

      requestAnimationFrame(tick);
    };

    const animationFrame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrame);
      World.clear(engine.world, false);
      Engine.clear(engine);
      Render.stop(render);
      Runner.stop(runner);
      if (root) {
        root.innerHTML = "";
      }
    };
  }, []);

  const nudgeBalance = (direction: "left" | "right") => {
    const platform = bodyRefs.current.platform;
    if (!platform) return;

    const torque = direction === "left" ? -0.12 : 0.12;
    Body.setAngularVelocity(platform, platform.angularVelocity + torque);
    Body.setAngularVelocity(bodyRefs.current.frontWheel ?? platform, 0.05 * (direction === "left" ? -1 : 1));
    Body.setAngularVelocity(bodyRefs.current.rearWheel ?? platform, -0.05 * (direction === "left" ? -1 : 1));
  };

  useEffect(() => {
    if (challengeCleared || status === 'crashed') {
      return;
    }

    if (status === 'safe' && Math.abs(balance) < 18) {
      const timeout = window.setTimeout(() => {
        setChallengeCleared(true);
        onChallengeClear?.();
      }, 600);

      return () => window.clearTimeout(timeout);
    }
  }, [balance, challengeCleared, onChallengeClear, status]);

  const statusClasses = {
    safe: "border-emerald-400/40 bg-emerald-500/10 text-emerald-300",
    wobbling: "border-amber-400/40 bg-amber-500/10 text-amber-300",
    crashed: "border-rose-400/40 bg-rose-500/10 text-rose-300",
  } satisfies Record<"safe" | "wobbling" | "crashed", string>;

  return (
    <div className="rounded-[28px] border border-amber-400/30 bg-slate-900 p-5 text-white shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Pothole balance
          </p>
          <h3 className="mt-1 text-xl font-bold">Dhaka road challenge</h3>
        </div>
        <span
          className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-wide ${statusClasses[status]}`}
        >
          {status}
        </span>
      </div>

      <div
        ref={canvasRef}
        className="h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50"
      />

      {challengeCleared && (
        <div className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-300">
          Road boss cleared — badge unlocked.
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
            animate={{ width: `${clamp(Math.abs(balance) + 18, 15, 100)}%` }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: balance < 0 ? "auto" : "0%" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => nudgeBalance("left")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Lean left
          </button>
          <button
            type="button"
            onClick={() => nudgeBalance("right")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Lean right
          </button>
        </div>
      </div>
    </div>
  );
}
