"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScroll } from "motion/react";

/**
 * A slowly turning sphere of gold nodes and connection lines: the studio's
 * "connected systems" idea in real 3D. Pointer-driven tilt, scroll-driven
 * rotation, paused off-screen, fully disposed on unmount.
 *
 * Only mounted on wide screens with a fine pointer and motion allowed;
 * everywhere else the 2D constellation field stands in.
 */
export function Hero3D({ target }: { target: React.RefObject<HTMLElement | null> }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: target as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // no WebGL: the 2D field behind remains the fallback
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      50,
    );
    camera.position.z = 4.4;

    const group = new THREE.Group();
    scene.add(group);

    // Fibonacci-distributed nodes on a sphere.
    const COUNT = 220;
    const R = 1.7;
    const positions = new Float32Array(COUNT * 3);
    const points: THREE.Vector3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const v = new THREE.Vector3(Math.cos(theta) * rad * R, y * R, Math.sin(theta) * rad * R);
      points.push(v);
      positions.set([v.x, v.y, v.z], i * 3);
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0xf0c987,
      size: 0.028,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    group.add(new THREE.Points(nodeGeo, nodeMat));

    // Connect each node to its two nearest neighbours.
    const linePos: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      const dists = points
        .map((p, j) => ({ j, d: p.distanceTo(points[i]) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of dists) {
        linePos.push(points[i].x, points[i].y, points[i].z, points[j].x, points[j].y, points[j].z);
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePos), 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf0c987,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Interaction state, read in rAF only (no React renders per frame).
    let scroll = 0;
    const stopScroll = scrollYProgress.on("change", (v) => {
      scroll = v;
    });

    const pointer = { x: 0, y: 0 };
    function onPointer(e: PointerEvent) {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onPointer, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(mount);

    function onResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", onResize);

    let raf = 0;
    let running = true;
    function tick() {
      if (!running) return;
      if (visible) {
        group.rotation.y += 0.0009;
        group.rotation.x += (pointer.y * 0.22 - group.rotation.x) * 0.04;
        const targetZ = pointer.x * 0.28 + scroll * Math.PI * 0.9;
        group.rotation.z += (targetZ * 0.15 - group.rotation.z) * 0.05;
        group.position.y = -scroll * 0.6;
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      stopScroll();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      io.disconnect();
      nodeGeo.dispose();
      lineGeo.dispose();
      nodeMat.dispose();
      lineMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [scrollYProgress]);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-70"
    />
  );
}
