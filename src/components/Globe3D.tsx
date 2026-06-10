'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SATELLITES } from '@/data/mock'

/* Texturas reais da Terra (NASA Blue Marble) servidas via CDN */
const TEX_BASE = 'https://unpkg.com/three-globe/example/img/'

export interface OrbitClass {
  id: string
  label: string
  alt: string
  radius: number // em raios terrestres (Terra = 1)
  incl: number   // inclinação orbital em graus
  speed: number  // rad/s (exagerado para visualização)
  color: string
}

export const ORBIT_CLASSES: OrbitClass[] = [
  { id: 'leo', label: 'LEO', alt: '550 km',    radius: 1.45, incl: 53, speed: 0.16,  color: '#00d4ff' },
  { id: 'meo', label: 'MEO', alt: '20.200 km', radius: 1.95, incl: 28, speed: 0.075, color: '#a78bfa' },
  { id: 'geo', label: 'GEO', alt: '35.786 km', radius: 2.5,  incl: 2,  speed: 0.042, color: '#22c55e' },
]

export const SAT_CONFIG = [
  { satIdx: 0, cls: 0, raan: 0,   phase: 0.0 },
  { satIdx: 1, cls: 0, raan: 65,  phase: 2.1 },
  { satIdx: 4, cls: 0, raan: 130, phase: 4.2 },
  { satIdx: 5, cls: 0, raan: 35,  phase: 1.0 },
  { satIdx: 3, cls: 0, raan: 95,  phase: 3.6 },
  { satIdx: 2, cls: 2, raan: 0,   phase: 2.4 },
]

/* Constelação de navegação decorativa na órbita MEO (estilo GPS) */
const MEO_NAV = { count: 3, raan: 40 }

export const SWARM = { radius: 1.28, incl: 86, speed: 0.22, color: '#67e8f9', count: 16 }

export const SAT_VELOCITY: Record<string, string> = { leo: '7,6 km/s', meo: '3,9 km/s', geo: '3,1 km/s' }

const DEG = Math.PI / 180

/* ───────────────────────── Helpers ───────────────────────── */

function makeGlowTexture(rgb: string): THREE.Texture {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, `rgba(${rgb},0.9)`)
  g.addColorStop(0.35, `rgba(${rgb},0.35)`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  return tex
}

function hexToRgbStr(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`
}

/* Satélite estilizado: corpo metálico + painéis solares + antena */
function buildSatMesh(colorHex: string): THREE.Group {
  const color = new THREE.Color(colorHex)
  const g = new THREE.Group()

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.045, 0.045, 0.07),
    new THREE.MeshStandardMaterial({ color: 0xd8e6f5, metalness: 0.7, roughness: 0.3 })
  )
  g.add(body)

  const panelMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.35,
    metalness: 0.4,
    roughness: 0.4,
  })
  const panelGeo = new THREE.BoxGeometry(0.13, 0.005, 0.055)
  const p1 = new THREE.Mesh(panelGeo, panelMat)
  p1.position.x = 0.105
  const p2 = new THREE.Mesh(panelGeo, panelMat)
  p2.position.x = -0.105
  g.add(p1, p2)

  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.022, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.3, roughness: 0.5, side: THREE.DoubleSide })
  )
  dish.position.y = 0.04
  dish.rotation.x = Math.PI
  g.add(dish)

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: makeGlowTexture(hexToRgbStr(colorHex)), transparent: true, depthWrite: false, opacity: 0.85 })
  )
  glow.scale.setScalar(0.3)
  g.add(glow)

  return g
}

interface SatRuntime {
  satIdx: number
  cls: OrbitClass
  phase: number
  plane: THREE.Group
  mesh: THREE.Group
  hit: THREE.Mesh
  trail: THREE.Line
  trailGeo: THREE.BufferGeometry
}

interface Globe3DProps {
  selected: number | null
  onSelect: (idx: number | null) => void
}

/* ───────────────────────── Componente ───────────────────────── */

export default function Globe3D({ selected, onSelect }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  const selectedRef = useRef(selected)
  selectedRef.current = selected
  const hoveredRef = useRef(hovered)
  hoveredRef.current = hovered
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Cena base ── */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.9, 3.4)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.borderRadius = '14px'
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.06
    controls.enablePan = false
    controls.minDistance = 1.7
    controls.maxDistance = 6.5
    controls.autoRotate = !reduced
    controls.autoRotateSpeed = 0.45
    // Pausa a rotação automática enquanto o usuário interage
    let idleTimer: ReturnType<typeof setTimeout> | null = null
    const pauseAutoRotate = () => {
      controls.autoRotate = false
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => { if (!reduced) controls.autoRotate = true }, 4500)
    }
    controls.addEventListener('start', pauseAutoRotate)

    /* ── Luzes (sol + preenchimento) ── */
    const sun = new THREE.DirectionalLight(0xfff4e0, 2.6)
    sun.position.set(6, 2.2, 4)
    scene.add(sun)
    scene.add(new THREE.AmbientLight(0x4a6080, 0.5))

    /* ── Terra fotorrealista ── */
    const texLoader = new THREE.TextureLoader()
    texLoader.setCrossOrigin('anonymous')
    const loadTex = (file: string, onLoad?: (t: THREE.Texture) => void) =>
      texLoader.load(TEX_BASE + file, (t) => {
        t.colorSpace = THREE.SRGBColorSpace
        onLoad?.(t)
      }, undefined, () => { /* offline: mantém material base */ })

    const earthMat = new THREE.MeshPhongMaterial({
      color: 0x1a3a6e, // fallback enquanto a textura carrega
      specular: new THREE.Color(0x223a55),
      shininess: 14,
    })
    loadTex('earth-blue-marble.jpg', (t) => {
      earthMat.map = t
      earthMat.color = new THREE.Color(0xffffff)
      earthMat.needsUpdate = true
    })
    texLoader.load(TEX_BASE + 'earth-topology.png', (t) => {
      earthMat.bumpMap = t
      earthMat.bumpScale = 0.5
      earthMat.needsUpdate = true
    }, undefined, () => {})
    texLoader.load(TEX_BASE + 'earth-water.png', (t) => {
      earthMat.specularMap = t
      earthMat.needsUpdate = true
    }, undefined, () => {})

    const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 80, 80), earthMat)
    scene.add(earth)

    /* ── Camada de nuvens ── */
    const cloudsMat = new THREE.MeshLambertMaterial({ transparent: true, opacity: 0, depthWrite: false })
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.012, 64, 64), cloudsMat)
    scene.add(clouds)
    texLoader.load(TEX_BASE + 'clouds/clouds.png', (t) => {
      cloudsMat.map = t
      cloudsMat.opacity = 0.5
      cloudsMat.needsUpdate = true
    }, undefined, () => {
      // caminho alternativo da textura de nuvens
      texLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/fair_clouds_4k.png', (t) => {
        cloudsMat.map = t
        cloudsMat.opacity = 0.5
        cloudsMat.needsUpdate = true
      }, undefined, () => {})
    })

    /* ── Brilho atmosférico (fresnel) ── */
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(0x0099ff) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }`,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 64), atmoMat)
    scene.add(atmosphere)

    /* ── Órbitas + satélites ── */
    const TRAIL_LEN = 36
    const sats: SatRuntime[] = []
    const hitMeshes: THREE.Mesh[] = []

    for (const cfg of SAT_CONFIG) {
      const cls = ORBIT_CLASSES[cfg.cls]
      const plane = new THREE.Group()
      plane.rotation.order = 'YXZ'
      plane.rotation.y = cfg.raan * DEG
      plane.rotation.x = cls.incl * DEG
      scene.add(plane)

      // Anel orbital
      const ringPts: THREE.Vector3[] = []
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2
        ringPts.push(new THREE.Vector3(Math.cos(a) * cls.radius, 0, Math.sin(a) * cls.radius))
      }
      const ring = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(ringPts),
        new THREE.LineBasicMaterial({ color: new THREE.Color(cls.color), transparent: true, opacity: 0.22 })
      )
      plane.add(ring)

      // Satélite
      const mesh = buildSatMesh(cls.color)
      plane.add(mesh)

      // Esfera de hit invisível (área de toque generosa)
      const hit = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      )
      hit.userData.satIdx = cfg.satIdx
      mesh.add(hit)
      hitMeshes.push(hit)

      // Trilha com fade (cores por vértice → preto, blending aditivo)
      const trailGeo = new THREE.BufferGeometry()
      trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_LEN * 3), 3))
      const trailColors = new Float32Array(TRAIL_LEN * 3)
      const c = new THREE.Color(cls.color)
      for (let i = 0; i < TRAIL_LEN; i++) {
        const k = 1 - i / TRAIL_LEN
        trailColors[i * 3] = c.r * k
        trailColors[i * 3 + 1] = c.g * k
        trailColors[i * 3 + 2] = c.b * k
      }
      trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3))
      const trail = new THREE.Line(
        trailGeo,
        new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })
      )
      plane.add(trail)

      sats.push({ satIdx: cfg.satIdx, cls, phase: cfg.phase, plane, mesh, hit, trail, trailGeo })
    }

    /* ── Enxame de constelação (órbita polar) ── */
    const swarmPlane = new THREE.Group()
    swarmPlane.rotation.x = SWARM.incl * DEG
    scene.add(swarmPlane)
    const swarmRingPts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      swarmRingPts.push(new THREE.Vector3(Math.cos(a) * SWARM.radius, 0, Math.sin(a) * SWARM.radius))
    }
    swarmPlane.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(swarmRingPts),
      new THREE.LineBasicMaterial({ color: new THREE.Color(SWARM.color), transparent: true, opacity: 0.13 })
    ))
    const swarmGlow = makeGlowTexture(hexToRgbStr(SWARM.color))
    const swarmDots: THREE.Sprite[] = []
    for (let i = 0; i < SWARM.count; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: swarmGlow, transparent: true, depthWrite: false, opacity: 0.9 }))
      s.scale.setScalar(0.09)
      swarmPlane.add(s)
      swarmDots.push(s)
    }

    /* ── Constelação de navegação MEO ── */
    const meoCls = ORBIT_CLASSES[1]
    const meoPlane = new THREE.Group()
    meoPlane.rotation.order = 'YXZ'
    meoPlane.rotation.y = MEO_NAV.raan * DEG
    meoPlane.rotation.x = meoCls.incl * DEG
    scene.add(meoPlane)
    const meoRingPts: THREE.Vector3[] = []
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2
      meoRingPts.push(new THREE.Vector3(Math.cos(a) * meoCls.radius, 0, Math.sin(a) * meoCls.radius))
    }
    meoPlane.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(meoRingPts),
      new THREE.LineBasicMaterial({ color: new THREE.Color(meoCls.color), transparent: true, opacity: 0.2 })
    ))
    const meoGlow = makeGlowTexture(hexToRgbStr(meoCls.color))
    const meoDots: THREE.Sprite[] = []
    for (let i = 0; i < MEO_NAV.count; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: meoGlow, transparent: true, depthWrite: false, opacity: 0.95 }))
      s.scale.setScalar(0.13)
      meoPlane.add(s)
      meoDots.push(s)
    }

    /* ── Retícula de seleção ── */
    const reticle = new THREE.Group()
    const retRing = new THREE.Mesh(
      new THREE.RingGeometry(0.13, 0.142, 48),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
    )
    const retRing2 = new THREE.Mesh(
      new THREE.RingGeometry(0.165, 0.171, 48, 1, 0, Math.PI * 0.6),
      new THREE.MeshBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })
    )
    reticle.add(retRing, retRing2)
    reticle.visible = false
    scene.add(reticle)

    /* ── Interação (raycast) ── */
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let downX = 0
    let downY = 0

    const setPointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }
    const pick = (): number | null => {
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(hitMeshes, false)
      return hits.length > 0 ? (hits[0].object.userData.satIdx as number) : null
    }
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      setPointer(e)
      const idx = pick()
      renderer.domElement.style.cursor = idx !== null ? 'pointer' : 'grab'
      if (idx !== hoveredRef.current) setHovered(idx)
    }
    const onPointerDown = (e: PointerEvent) => {
      downX = e.clientX
      downY = e.clientY
    }
    const onPointerUp = (e: PointerEvent) => {
      // Só conta como clique se não foi arrasto
      if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return
      setPointer(e)
      const idx = pick()
      if (idx !== null) {
        onSelectRef.current(selectedRef.current === idx ? null : idx)
      } else {
        onSelectRef.current(null)
      }
    }
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)

    /* ── Resize responsivo ── */
    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    /* ── Loop de animação ── */
    const clock = new THREE.Clock()
    let elapsed = 0
    let raf = 0
    const tmpV = new THREE.Vector3()

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(0.05, clock.getDelta())
      if (!reduced) elapsed += dt

      // Rotação da Terra e deriva das nuvens
      earth.rotation.y += dt * 0.02
      clouds.rotation.y += dt * 0.028

      // Satélites nomeados
      for (const s of sats) {
        const theta = s.phase + elapsed * s.cls.speed
        s.mesh.position.set(Math.cos(theta) * s.cls.radius, 0, Math.sin(theta) * s.cls.radius)
        s.mesh.rotation.y = -theta
        // Trilha
        const pos = s.trailGeo.getAttribute('position') as THREE.BufferAttribute
        for (let i = 0; i < TRAIL_LEN; i++) {
          const a = theta - i * 0.035
          pos.setXYZ(i, Math.cos(a) * s.cls.radius, 0, Math.sin(a) * s.cls.radius)
        }
        pos.needsUpdate = true
      }

      // Enxame
      for (let i = 0; i < swarmDots.length; i++) {
        const a = (i / SWARM.count) * Math.PI * 2 + elapsed * SWARM.speed
        swarmDots[i].position.set(Math.cos(a) * SWARM.radius, 0, Math.sin(a) * SWARM.radius)
      }

      // Constelação MEO
      for (let i = 0; i < meoDots.length; i++) {
        const a = (i / MEO_NAV.count) * Math.PI * 2 + elapsed * meoCls.speed
        meoDots[i].position.set(Math.cos(a) * meoCls.radius, 0, Math.sin(a) * meoCls.radius)
      }

      // Retícula segue o satélite focado
      const focusIdx = hoveredRef.current ?? selectedRef.current
      const focusSat = focusIdx !== null ? sats.find((s) => s.satIdx === focusIdx) : undefined
      if (focusSat) {
        focusSat.mesh.getWorldPosition(tmpV)
        reticle.position.copy(tmpV)
        reticle.lookAt(camera.position)
        reticle.rotation.z = elapsed * 1.2
        reticle.visible = true

        // Tooltip projetado para coordenadas de tela
        const tip = tooltipRef.current
        if (tip) {
          const v = tmpV.clone().project(camera)
          const w = container.clientWidth
          const h = container.clientHeight
          const x = (v.x * 0.5 + 0.5) * w
          const y = (-v.y * 0.5 + 0.5) * h
          tip.style.display = v.z < 1 ? 'block' : 'none'
          tip.style.left = `${x}px`
          tip.style.top = `${y}px`
          tip.style.transform = x > w * 0.55
            ? 'translate(calc(-100% - 18px), -50%)'
            : 'translate(18px, -50%)'
        }
      } else {
        reticle.visible = false
        if (tooltipRef.current) tooltipRef.current.style.display = 'none'
      }

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(raf)
      if (idleTimer) clearTimeout(idleTimer)
      ro.disconnect()
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      controls.dispose()
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Sprite) {
          obj.geometry?.dispose()
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => m?.dispose())
        }
      })
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  const focusIdx = hovered ?? selected
  const focusSat = focusIdx !== null ? SATELLITES[focusIdx] : null
  const focusCfg = focusIdx !== null ? SAT_CONFIG.find((c) => c.satIdx === focusIdx) : undefined
  const focusCls = focusCfg ? ORBIT_CLASSES[focusCfg.cls] : null

  return (
    <div ref={containerRef} className="globe-canvas-wrap">
      {focusSat && focusCls && (
        <div
          ref={tooltipRef}
          className="sat-tooltip glass-card"
          style={{ position: 'absolute', display: 'none', pointerEvents: 'none', zIndex: 10, borderColor: `${focusCls.color}66` }}
        >
          <div className="sat-tooltip-name" style={{ color: focusCls.color }}>{focusSat.name}</div>
          <div className="sat-tooltip-row"><span>Órbita</span><span>{focusSat.orbit} · {focusCls.alt}</span></div>
          <div className="sat-tooltip-row"><span>Velocidade</span><span>{SAT_VELOCITY[focusCls.id]}</span></div>
          <div className="sat-tooltip-row"><span>Parceiro</span><span>{focusSat.partner}</span></div>
          <div className="sat-tooltip-row"><span>Cobertura</span><span>{focusSat.coverage}</span></div>
          <div className="sat-tooltip-data">{focusSat.currentData}</div>
        </div>
      )}
    </div>
  )
}
