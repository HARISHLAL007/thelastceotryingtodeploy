import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { OrbitControls, Text } from '@react-three/drei';
import { getAudioCtx } from '@/lib/audio';

type CEOModelProps = {
  archetype?: string;
  mood?: 'default' | 'victory' | 'bankruptcy' | 'singularity';
  playable?: boolean;
  onStationChange?: (station: string) => void;
};

// Footstep trail tuning
const FOOT_COUNT = 24;      // pooled footprint meshes
const STEP_INTERVAL = 0.8;  // world units between strides
const FOOT_LIFE = 1.7;      // seconds before a print fully fades

// --- Footstep audio (synthesized via Web Audio, no asset files) ---
const playFootstep = (side: number) => {
  const ctx = getAudioCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime;

  // Master bus for the step
  const out = ctx.createGain();
  out.gain.value = 0.9;
  out.connect(ctx.destination);

  // Mid-range "body" click — pitched so it carries on laptop speakers,
  // alternating per foot for a natural gait
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  const base = side > 0 ? 240 : 200;
  osc.frequency.setValueAtTime(base + Math.random() * 20, t);
  osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.5, t + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + 0.13);

  // Bandpassed noise burst for the "scuff" texture
  const dur = 0.06;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const nGain = ctx.createGain();
  nGain.gain.setValueAtTime(0.28, t);
  nGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2600;
  bp.Q.value = 0.8;
  noise.connect(bp).connect(nGain).connect(out);
  noise.start(t);
  noise.stop(t + dur);
};

// 3D Isometric Camera Controller
const CameraController = ({ playable }: { playable: boolean }) => {
  const { camera } = useThree();
  useEffect(() => {
    if (playable) {
      // Pulled back and tilted down for an isometric view of the room
      camera.position.set(0, 5.2, 5.8);
      camera.lookAt(0, -0.6, -1.8);
    } else {
      // Standard view of the CEO model — pulled back and centered so the full figure fits the frame
      camera.position.set(0, 1.3, 4.6);
      camera.lookAt(0, 0.75, 0);
    }
    camera.updateProjectionMatrix();
  }, [playable, camera]);
  return null;
};

// 3D Office Environment Stations
const OfficeRoom = () => {
  return (
    <group>
      {/* Cyberpunk Neon Floor Grid */}
      <gridHelper args={[14, 14, '#06b6d4', '#1e293b']} position={[0, -0.4, -1.5]} />

      {/* Office Back Wall */}
      <mesh position={[0, 1.5, -5.2]}>
        <planeGeometry args={[14, 4]} />
        <meshStandardMaterial color="#020617" roughness={0.9} />
      </mesh>
      
      {/* Neon Back Wall Glowing Trim */}
      <mesh position={[0, 1.2, -5.15]}>
        <boxGeometry args={[14, 0.04, 0.04]} />
        <meshBasicMaterial color="#06b6d4" />
      </mesh>
      <mesh position={[0, 0.1, -5.15]}>
        <boxGeometry args={[14, 0.04, 0.04]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {/* 1. HR Operations Desk (Left Zone) */}
      <group position={[-2.8, -0.4, -0.6]}>
        {/* Floor Indicator Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial color="#10b981" side={2} transparent opacity={0.7} />
        </mesh>
        
        {/* Spot/Point Light */}
        <pointLight position={[0, 1, 0]} color="#10b981" intensity={2} distance={3.5} />

        {/* Desk Mesh */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.8]} />
          <meshStandardMaterial color="#064e3b" roughness={0.4} />
        </mesh>
        
        {/* Hologram Terminal Monitor */}
        <mesh position={[0, 0.9, 0.1]}>
          <boxGeometry args={[0.6, 0.35, 0.05]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
        <mesh position={[0, 0.82, 0.1]}>
          <boxGeometry args={[0.15, 0.1, 0.1]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        
        {/* Floating Sector Label Sign */}
        <group position={[0, 1.4, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.25, 0.1]} />
            <meshStandardMaterial color="#064e3b" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.8, 0.16, 0.01]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </group>
      </group>

      {/* 2. ML Server Cluster (Right Zone) */}
      <group position={[2.8, -0.4, -0.6]}>
        {/* Floor Indicator Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[0.9, 1.0, 32]} />
          <meshBasicMaterial color="#06b6d4" side={2} transparent opacity={0.7} />
        </mesh>

        {/* Spot/Point Light */}
        <pointLight position={[0, 1.2, 0]} color="#06b6d4" intensity={2} distance={3.5} />

        {/* Main Server Tower Mesh */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.8, 1.6, 0.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.15} metalness={0.8} />
        </mesh>

        {/* Glowing Server Status Indicator Bulbs */}
        <mesh position={[0, 1.3, 0.41]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0, 1.1, 0.41]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0, 0.9, 0.41]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, 0.7, 0.41]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0, 0.5, 0.41]}>
          <boxGeometry args={[0.5, 0.05, 0.02]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Floating Sector Label Sign */}
        <group position={[0, 1.8, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.25, 0.1]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.8, 0.16, 0.01]} />
            <meshBasicMaterial color="#06b6d4" />
          </mesh>
        </group>
      </group>

      {/* 3. Executive Boardroom Table (Center Forward Zone) */}
      <group position={[0, -0.4, -3.2]}>
        {/* Floor Indicator Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[1.2, 1.3, 32]} />
          <meshBasicMaterial color="#fbbf24" side={2} transparent opacity={0.7} />
        </mesh>

        {/* Spot/Point Light */}
        <pointLight position={[0, 1.2, 0]} color="#fbbf24" intensity={2.5} distance={4} />

        {/* Large Table Mesh */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2.2, 0.6, 1.0]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.4} metalness={0.1} />
        </mesh>
        
        {/* Hologram Board Projector Screen Glow */}
        <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.4, 0.7]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.25} />
        </mesh>
        
        {/* Office Chairs */}
        <mesh position={[-1.3, 0.3, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.3]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
        <mesh position={[1.3, 0.3, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.3]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Floating Sector Label Sign */}
        <group position={[0, 1.2, 0]}>
          <mesh>
            <boxGeometry args={[1.0, 0.25, 0.1]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.9, 0.16, 0.01]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Internal Character Component inside the Canvas
const CEOCharacter = ({ 
  archetype = 'researcher', 
  mood = 'default',
  playable = false,
  onStationChange
}: CEOModelProps) => {
  const groupRef = useRef<any>();
  const bodyGroupRef = useRef<any>();
  const leftLegRef = useRef<any>();
  const rightLegRef = useRef<any>();
  const leftArmRef = useRef<any>();
  const rightArmRef = useRef<any>();

  // Player position states (cached in refs for 60fps performance inside useFrame)
  const playerPos = useRef({ x: 0, z: 0 });
  const playerRot = useRef(0);
  const lastStation = useRef('none');
  const keysPressed = useRef<Set<string>>(new Set());

  // Footstep trail (refs to avoid re-renders inside the 60fps loop)
  const footRefs = useRef<any[]>([]);
  const footMeta = useRef(Array.from({ length: FOOT_COUNT }, () => ({ born: -1e9, x: 0, z: 0, rot: 0 })));
  const footCursor = useRef(0);
  const distTravelled = useRef(0);
  const lastStepDist = useRef(0);
  const stepSide = useRef(1);

  useEffect(() => {
    if (!playable) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable movement inputs if user is currently typing in an input element
      const el = document.activeElement;
      const isInputActive = el && (
        el.tagName === 'INPUT' || 
        el.tagName === 'TEXTAREA' || 
        el.hasAttribute('contenteditable')
      );
      if (isInputActive) return;

      const key = e.key.toLowerCase();
      const code = e.code ? e.code.toLowerCase() : '';
      
      // Prevent default scrolling or browser actions for movement keys
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
        e.preventDefault();
      }

      keysPressed.current.add(key);
      if (code) {
        keysPressed.current.add(code);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code ? e.code.toLowerCase() : '';
      
      if (['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(key)) {
        e.preventDefault();
      }

      keysPressed.current.delete(key);
      if (code) {
        keysPressed.current.delete(code);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playable]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (playable) {
        // 1. Keyboard direction polling
        let dx = 0;
        let dz = 0;

        const isPressed = (k1: string, k2: string, k3: string) => 
          keysPressed.current.has(k1) || keysPressed.current.has(k2) || keysPressed.current.has(k3);

        if (isPressed('w', 'arrowup', 'keyw')) dz -= 1;
        if (isPressed('s', 'arrowdown', 'keys')) dz += 1;
        if (isPressed('a', 'arrowleft', 'keya')) dx -= 1;
        if (isPressed('d', 'arrowright', 'keyd')) dx += 1;

        // Diagonal normalization
        if (dx !== 0 && dz !== 0) {
          const len = Math.sqrt(dx * dx + dz * dz);
          dx /= len;
          dz /= len;
        }

        const isMoving = dx !== 0 || dz !== 0;
        const speed = 3.0; // Units per second

        if (isMoving) {
          playerPos.current.x += dx * speed * delta;
          playerPos.current.z += dz * speed * delta;

          // Limit boundaries within the office grid room bounds
          playerPos.current.x = Math.max(-4.5, Math.min(4.5, playerPos.current.x));
          playerPos.current.z = Math.max(-4.6, Math.min(1.2, playerPos.current.z));

          // Set rotation target direction angle
          playerRot.current = Math.atan2(dx, dz);

          // Drop a glowing footprint every stride, alternating left/right foot
          distTravelled.current += speed * delta;
          if (distTravelled.current - lastStepDist.current >= STEP_INTERVAL) {
            lastStepDist.current = distTravelled.current;
            const rot = playerRot.current;
            const fx = Math.sin(rot), fz = Math.cos(rot);  // forward vector
            const px = Math.cos(rot), pz = -Math.sin(rot); // lateral vector
            const m = footMeta.current[footCursor.current];
            m.born = state.clock.getElapsedTime();
            m.x = playerPos.current.x + px * 0.13 * stepSide.current - fx * 0.05;
            m.z = playerPos.current.z + pz * 0.13 * stepSide.current - fz * 0.05;
            m.rot = rot;
            footCursor.current = (footCursor.current + 1) % FOOT_COUNT;
            playFootstep(stepSide.current);
            stepSide.current *= -1;
          }
        }

        // Apply updated absolute coordinates
        groupRef.current.position.set(playerPos.current.x, -0.4, playerPos.current.z);

        // Smooth rotation interpolation (prevent snapping)
        const diff = playerRot.current - groupRef.current.rotation.y;
        const normalizedDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        groupRef.current.rotation.y += normalizedDiff * 0.18;

        // Walking / Bobbing skeletal animation logic
        if (isMoving) {
          const walkTime = state.clock.getElapsedTime() * 12;
          if (leftLegRef.current) leftLegRef.current.rotation.x = Math.sin(walkTime) * 0.6;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.sin(walkTime) * 0.6;
          if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.sin(walkTime) * 0.6;
          if (rightArmRef.current) rightArmRef.current.rotation.x = Math.sin(walkTime) * 0.6;
          if (bodyGroupRef.current) bodyGroupRef.current.position.y = Math.abs(Math.sin(walkTime)) * 0.08;
        } else {
          // Idle breathing subtle animation
          const idleTime = state.clock.getElapsedTime() * 2;
          if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
          if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
          if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
          if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
          if (bodyGroupRef.current) bodyGroupRef.current.position.y = Math.sin(idleTime) * 0.02;
        }

        // Fade & place the footprint trail
        const nowT = state.clock.getElapsedTime();
        for (let i = 0; i < FOOT_COUNT; i++) {
          const fm = footRefs.current[i];
          if (!fm) continue;
          const meta = footMeta.current[i];
          const age = nowT - meta.born;
          if (age >= 0 && age < FOOT_LIFE) {
            const t = 1 - age / FOOT_LIFE;
            fm.visible = true;
            fm.position.set(meta.x, -0.39, meta.z);
            fm.rotation.set(-Math.PI / 2, 0, meta.rot);
            fm.material.opacity = t * 0.5;
            const sc = 1.1 - t * 0.2;
            fm.scale.set(sc, sc, sc);
          } else if (fm.visible) {
            fm.visible = false;
          }
        }

        // 2. Station distance logic checks
        const dHR = Math.sqrt(Math.pow(playerPos.current.x - (-2.8), 2) + Math.pow(playerPos.current.z - (-0.6), 2));
        const dML = Math.sqrt(Math.pow(playerPos.current.x - 2.8, 2) + Math.pow(playerPos.current.z - (-0.6), 2));
        const dBoard = Math.sqrt(Math.pow(playerPos.current.x - 0, 2) + Math.pow(playerPos.current.z - (-3.2), 2));

        let currentStation = 'none';
        if (dHR < 1.6) {
          currentStation = 'hr';
        } else if (dML < 1.6) {
          currentStation = 'ml';
        } else if (dBoard < 1.8) {
          currentStation = 'boardroom';
        }

        if (currentStation !== lastStation.current) {
          lastStation.current = currentStation;
          if (onStationChange) {
            onStationChange(currentStation);
          }
        }
      } else {
        // Continuous rotation for static viewports
        groupRef.current.rotation.y += 0.006;
        
        // Gentle floating animation (bobbing up and down)
        if (mood === 'singularity') {
          groupRef.current.position.y = -0.4 + Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
        } else {
          groupRef.current.position.y = -0.4 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
        }
      }
    }
  });

  // Cosmetic skin definitions (appearance only — no gameplay effect)
  let suitColor = '#1e293b'; // Slate 800
  let tieColor = '#f43f5e';  // Rose 500
  let skinColor = '#fed7aa'; // Peach skin
  let eyeColor = '#06b6d4';  // Cyan visor
  let hairColor = '#1e293b'; // Hair / helmet block
  let accessoryColor = '';
  let handTattoo = '';

  switch (archetype) {
    case 'cyberpunk': // Cyberpunk Executive — magenta neon
      suitColor = '#241531';
      tieColor = '#ec4899';
      eyeColor = '#f0abfc';
      hairColor = '#0f0a18';
      accessoryColor = '#ec4899';
      handTattoo = 'H';
      break;
    case 'researcher': // AI Researcher — lab white + cyan glasses
      suitColor = '#e2e8f0';
      tieColor = '#0891b2';
      eyeColor = '#22d3ee';
      hairColor = '#1e293b';
      handTattoo = 'K';
      break;
    case 'quant': // Quant Trader — dark suit, ticker green
      suitColor = '#0f172a';
      tieColor = '#22c55e';
      eyeColor = '#4ade80';
      hairColor = '#0b1220';
      handTattoo = 'SA';
      break;
    case 'stealth': // Stealth Agent — all black + hat
      suitColor = '#0a0a0a';
      tieColor = '#334155';
      eyeColor = '#e2e8f0';
      hairColor = '#000000';
      handTattoo = 'A';
      break;
    case 'space': // Space Entrepreneur — white suit, violet helmet
      suitColor = '#e2e8f0';
      tieColor = '#a855f7';
      eyeColor = '#7c3aed';
      hairColor = '#cbd5e1';
      accessoryColor = '#a855f7';
      handTattoo = 'SH';
      break;
    case 'hacker': // Hacker — dark hoodie, matrix green
      suitColor = '#0a0f0a';
      tieColor = '#16a34a';
      eyeColor = '#4ade80';
      hairColor = '#020617';
      accessoryColor = '#16a34a';
      handTattoo = 'X';
      break;
  }

  // Adjustments based on mood
  let headRotationX = 0;
  let headPositionY = 1.7;
  let leftArmRotationZ = 0;
  let rightArmRotationZ = 0;
  let spineRotationX = 0;

  if (mood === 'bankruptcy') {
    suitColor = '#0f172a'; // Faded out
    tieColor = '#475569';
    eyeColor = '#dc2626';  // Error red deactivated eyes
    headRotationX = 0.5;   // Slouched head
    headPositionY = 1.5;
    leftArmRotationZ = 0.2;  // Limp arms
    rightArmRotationZ = -0.2;
    spineRotationX = 0.15;
  } else if (mood === 'victory') {
    accessoryColor = '#fbbf24'; // Golden halo/crown
  } else if (mood === 'singularity') {
    suitColor = '#0284c7';  // Fully digitized sky-blue
    tieColor = '#06b6d4';
    eyeColor = '#22c55e';   // Glowing matrix green
    skinColor = '#0c4a6e';  // Transparent digital blue
  }

  return (
    <>
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Halo for Victory or Singularity */}
      {(mood === 'victory' || mood === 'singularity') && (
        <mesh position={[0, 2.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshBasicMaterial color={mood === 'victory' ? '#eab308' : '#22c55e'} side={2} />
        </mesh>
      )}

      {/* Main Spine / Body rotation group */}
      <group ref={bodyGroupRef} rotation={[spineRotationX, 0, 0]}>
        {/* Head */}
        <group position={[0, headPositionY, 0]} rotation={[headRotationX, 0, 0]}>
          {/* Hair/Helmet block */}
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.52, 0.1, 0.52]} />
            <meshStandardMaterial color={mood === 'bankruptcy' ? '#334155' : hairColor} roughness={0.7} />
          </mesh>

          {/* Main Head Block */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.5, 0.45, 0.5]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>

          {/* Visor / Eyes / Glasses */}
          <mesh position={[0, 0.08, 0.26]}>
            <boxGeometry args={[0.42, 0.12, 0.05]} />
            <meshBasicMaterial color={eyeColor} />
          </mesh>

          {/* Stealth Agent — low-brim hat */}
          {archetype === 'stealth' && mood !== 'bankruptcy' && (
            <group position={[0, 0.36, 0]}>
              <mesh>
                <cylinderGeometry args={[0.52, 0.52, 0.04, 24]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.13, 0]}>
                <cylinderGeometry args={[0.3, 0.33, 0.26, 24]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.03, 0]}>
                <cylinderGeometry args={[0.34, 0.34, 0.06, 24]} />
                <meshBasicMaterial color={eyeColor} />
              </mesh>
            </group>
          )}

          {/* Space Entrepreneur — sealed helmet dome */}
          {archetype === 'space' && mood !== 'bankruptcy' && (
            <group position={[0, 0.05, 0]}>
              <mesh>
                <sphereGeometry args={[0.42, 24, 24]} />
                <meshStandardMaterial color="#cbd5e1" transparent opacity={0.28} roughness={0.1} metalness={0.7} />
              </mesh>
              <mesh position={[0, -0.05, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.12, 0.03, 12, 24]} />
                <meshBasicMaterial color={accessoryColor} />
              </mesh>
            </group>
          )}

          {/* Hacker — dark hood framing the face */}
          {archetype === 'hacker' && mood !== 'bankruptcy' && (
            <group>
              <mesh position={[0, 0.08, -0.2]}>
                <boxGeometry args={[0.62, 0.7, 0.18]} />
                <meshStandardMaterial color="#030712" roughness={0.95} />
              </mesh>
              <mesh position={[0, 0.36, -0.02]}>
                <boxGeometry args={[0.62, 0.16, 0.5]} />
                <meshStandardMaterial color="#030712" roughness={0.95} />
              </mesh>
              <mesh position={[-0.31, 0.08, -0.02]}>
                <boxGeometry args={[0.08, 0.56, 0.5]} />
                <meshStandardMaterial color="#030712" roughness={0.95} />
              </mesh>
              <mesh position={[0.31, 0.08, -0.02]}>
                <boxGeometry args={[0.08, 0.56, 0.5]} />
                <meshStandardMaterial color="#030712" roughness={0.95} />
              </mesh>
            </group>
          )}

          {/* Cyberpunk Executive — neon cheek strips */}
          {archetype === 'cyberpunk' && mood !== 'bankruptcy' && (
            <group>
              <mesh position={[-0.2, -0.08, 0.26]}>
                <boxGeometry args={[0.04, 0.18, 0.02]} />
                <meshBasicMaterial color={accessoryColor} />
              </mesh>
              <mesh position={[0.2, -0.08, 0.26]}>
                <boxGeometry args={[0.04, 0.18, 0.02]} />
                <meshBasicMaterial color={accessoryColor} />
              </mesh>
            </group>
          )}
        </group>

        {/* Torso (Suit Jacket) */}
        <mesh position={[0, 1.05, 0]}>
          <boxGeometry args={[0.8, 0.9, 0.45]} />
          <meshStandardMaterial color={suitColor} roughness={0.5} />
        </mesh>

        {/* Shirt Collar (White V-shape) */}
        <mesh position={[0, 1.4, 0.23]}>
          <boxGeometry args={[0.18, 0.12, 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} />
        </mesh>

        {/* Tie */}
        <mesh position={[0, 1.15, 0.24]}>
          <boxGeometry args={[0.08, 0.4, 0.02]} />
          <meshStandardMaterial color={tieColor} roughness={0.8} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.55, 1.35, 0]} rotation={[0, 0, leftArmRotationZ]}>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[0.22, 0.7, 0.22]} />
            <meshStandardMaterial color={suitColor} roughness={0.5} />
          </mesh>
          {/* Hand with Encryption Tattoo */}
          <group position={[0, -0.75, 0]}>
            <mesh>
              <boxGeometry args={[0.18, 0.12, 0.18]} />
              <meshStandardMaterial color={skinColor} roughness={0.6} />
            </mesh>
            <Text
              position={[0, 0, -0.095]}
              rotation={[0, Math.PI, 0]}
              fontSize={0.06}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {handTattoo}
            </Text>
          </group>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.55, 1.35, 0]} rotation={[0, 0, rightArmRotationZ]}>
          <mesh position={[0, -0.35, 0]}>
            <boxGeometry args={[0.22, 0.7, 0.22]} />
            <meshStandardMaterial color={suitColor} roughness={0.5} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.75, 0]}>
            <boxGeometry args={[0.18, 0.12, 0.18]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Quant Trader — handheld market slate */}
          {archetype === 'quant' && mood !== 'bankruptcy' && (
            <mesh position={[0.15, -0.8, 0.18]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.22, 0.3, 0.03]} />
              <meshBasicMaterial color="#22c55e" />
            </mesh>
          )}
        </group>

        {/* Cyberpunk Executive — neon back emitters */}
        {archetype === 'cyberpunk' && accessoryColor && mood !== 'bankruptcy' && (
          <group position={[0, 1.1, -0.3]}>
            <mesh position={[-0.4, 0.1, 0]} rotation={[0, 0, -0.3]}>
              <boxGeometry args={[0.15, 0.6, 0.08]} />
              <meshBasicMaterial color={accessoryColor} />
            </mesh>
            <mesh position={[0.4, 0.1, 0]} rotation={[0, 0, 0.3]}>
              <boxGeometry args={[0.15, 0.6, 0.08]} />
              <meshBasicMaterial color={accessoryColor} />
            </mesh>
          </group>
        )}
      </group>

      {/* Legs (Pants) */}
      <group position={[0, 0, 0]}>
        {/* Left Leg */}
        <group ref={leftLegRef} position={[-0.2, 0.6, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.28, 0.6, 0.3]} />
            <meshStandardMaterial color={suitColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.65, 0.05]}>
            <boxGeometry args={[0.28, 0.1, 0.4]} />
            <meshStandardMaterial color={mood === 'bankruptcy' ? '#1e293b' : '#0f172a'} roughness={0.2} />
          </mesh>
        </group>

        {/* Right Leg */}
        <group ref={rightLegRef} position={[0.2, 0.6, 0]}>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.28, 0.6, 0.3]} />
            <meshStandardMaterial color={suitColor} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.65, 0.05]}>
            <boxGeometry args={[0.28, 0.1, 0.4]} />
            <meshStandardMaterial color={mood === 'bankruptcy' ? '#1e293b' : '#0f172a'} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>

    {/* Footstep trail — pooled glowing prints left on the floor as the CEO walks */}
    {playable && Array.from({ length: FOOT_COUNT }).map((_, i) => (
      <mesh
        key={i}
        ref={(el) => { footRefs.current[i] = el; }}
        position={[0, -0.39, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[0.12, 0.2]} />
        <meshBasicMaterial color={eyeColor} transparent opacity={0} depthWrite={false} />
      </mesh>
    ))}
    </>
  );
};

export const CEOModel = ({
  archetype = 'researcher',
  mood = 'default',
  playable = false,
  onStationChange
}: CEOModelProps) => {
  return (
    <div className={`h-full w-full select-none ${playable ? 'pointer-events-none' : ''}`}>
      <Canvas
        camera={{ position: [0, 1.4, 3.2], fov: 42 }}
        className={`h-full w-full ${playable ? 'pointer-events-none' : ''}`}
        style={{ background: 'transparent', pointerEvents: playable ? 'none' : 'auto' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-5, 5, 5]} intensity={1.2} />
        <spotLight position={[0, 6, 0]} intensity={1.0} />
        
        <CameraController playable={playable} />
        
        {!playable && <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={6} target={[0, 0.6, 0]} />}
        
        {playable && <OfficeRoom />}
        
        <CEOCharacter 
          archetype={archetype} 
          mood={mood} 
          playable={playable}
          onStationChange={onStationChange}
        />
      </Canvas>
    </div>
  );
};

export default CEOModel;
