"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Bodies, Body, Engine, Render, Runner, World } from "matter-js";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function PotholeMiniGame() {
  const [balance, setBalance] = useState(0);
  const [stable, setStable] = useState(true);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<Engine | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const engine = Engine.create();
    engineRef.current = engine;

    const ground = Bodies.rectangle(220, 260, 420, 18, { isStatic: true });
    const rickshawPlatform = Bodies.rectangle(200, 170, 150, 18, {
      density: 0.004,
      restitution: 0.1,
    });
    const frontWheel = Bodies.circle(150, 222, 22, {
      density: 0.003,
      friction: 0.8,
    });
    const rearWheel = Bodies.circle(250, 222, 22, {
      density: 0.003,
      friction: 0.8,
    });

    const potholes = [
      Bodies.rectangle(120, 250, 50, 24, { isStatic: true }),
      Bodies.rectangle(260, 250, 55, 18, { isStatic: true }),
      Bodies.rectangle(330, 250, 48, 22, { isStatic: true }),
    ];

    World.add(engine.world, [
      ground,
      rickshawPlatform,
      frontWheel,
      rearWheel,
      ...potholes,
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);

    const tick = () => {
      if (!engineRef.current) {
        return;
      }

      const angle = rickshawPlatform.angle;
      const worldBalance = clamp(angle * 80, -100, 100);
      setBalance(worldBalance);
      setStable(Math.abs(angle) < 0.35);
      requestAnimationFrame(tick);
    };

    const frame = requestAnimationFrame(tick);

    const root = canvasRef.current;
    const render = Render.create({
      element: root,
      engine,
      options: {
        width: 420,
        height: 260,
        wireframes: false,
        background: "transparent",
        pixelRatio: 1,
      },
    });

    Render.run(render);

    return () => {
      cancelAnimationFrame(frame);
      World.clear(engine.world, false);
      Engine.clear(engine);
      Render.stop(render);
      if (root) {
        root.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!engineRef.current) {
      return;
    }

    const { world } = engineRef.current;
    const platform = world.bodies.find(
      (body) => body.label === "Rectangle Body" && body.position.y < 210,
    );
    if (!platform) {
      return;
    }

    Body.setAngularVelocity(platform, balance / 900);
    Body.setAngularVelocity(world.bodies[2], balance / 1600);
    Body.setAngularVelocity(world.bodies[3], -balance / 1600);
  }, [balance]);

  return (
    <div className="rounded-[28px] border border-amber-400/30 bg-slate-900 p-5 text-white shadow-panel">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Pothole balance
          </p>
          <h3 className="mt-1 text-xl font-bold">Dhaka road challenge</h3>
        </div>
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
          {stable ? "Stable" : "Wobbling"}
        </span>
      </div>

      <div
        ref={canvasRef}
        className="h-[260px] overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50"
      />

      <div className="mt-4 space-y-3">
        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500"
            animate={{ width: `${Math.min(Math.abs(balance) + 25, 100)}%` }}
            transition={{ duration: 0.2 }}
            style={{ marginLeft: balance < 0 ? "auto" : "0%" }}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setBalance((value) => clamp(value - 18, -100, 100))}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Lean left
          </button>
          <button
            type="button"
            onClick={() => setBalance((value) => clamp(value + 18, -100, 100))}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Lean right
          </button>
        </div>
      </div>
    </div>
  );
}
