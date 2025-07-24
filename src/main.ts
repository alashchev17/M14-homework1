import './style.css'
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'

class ThreeJSScene {
  private scene: Scene
  private camera: PerspectiveCamera
  private renderer: WebGLRenderer
  private controls!: OrbitControls
  private stats: Stats
  private cube!: Mesh
  private animationFrameId: number = 0

  constructor() {
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new WebGLRenderer({ antialias: true })
    this.stats = new Stats()

    this.init()
    this.createLights()
    this.createGeometry()
    this.setupControls()
    this.setupStats()
    this.setupEventListeners()
    this.animate()
  }

  private init(): void {
    // Setup renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.setClearColor(0x222222, 1)

    // Add renderer to DOM
    const app = document.querySelector<HTMLDivElement>('#app')!
    app.appendChild(this.renderer.domElement)

    // Position camera
    this.camera.position.z = 5
    this.camera.position.y = 2
    this.camera.position.x = 2
  }

  private createLights(): void {
    // Ambient light
    const ambientLight = new AmbientLight(0x404040, 0.6)
    this.scene.add(ambientLight)

    // Directional light
    const directionalLight = new DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)
  }

  private createGeometry(): void {
    // Create a cube
    const geometry = new BoxGeometry(1, 1, 1)
    const material = new MeshLambertMaterial({ color: 0x00ff88 })
    this.cube = new Mesh(geometry, material)
    this.cube.castShadow = true
    this.cube.receiveShadow = true
    this.scene.add(this.cube)

    // Create a plane as ground
    const planeGeometry = new PlaneGeometry(10, 10)
    const planeMaterial = new MeshLambertMaterial({ color: 0x666666 })
    const plane = new Mesh(planeGeometry, planeMaterial)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -1
    plane.receiveShadow = true
    this.scene.add(plane)
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 2
    this.controls.maxDistance = 20
  }

  private setupStats(): void {
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.dom.classList.add('stats')
    document.body.appendChild(this.stats.dom)
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this), false)
  }

  private onWindowResize(): void {
    // Update camera aspect ratio
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this))

    // Update stats
    this.stats.begin()

    // Rotate the cube
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    // Update controls
    this.controls.update()

    // Render the scene
    this.renderer.render(this.scene, this.camera)

    this.stats.end()
  }

  public dispose(): void {
    // Clean up resources
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    this.controls.dispose()
    this.renderer.dispose()

    // Remove stats from DOM
    if (this.stats.dom.parentNode) {
      this.stats.dom.parentNode.removeChild(this.stats.dom)
    }
  }
}

// Initialize the scene
new ThreeJSScene()
