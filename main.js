import {
    Scene,
    WebGLRenderer,
    OrthographicCamera,
    AmbientLight,
    DirectionalLight,
    Vector3
} from './build/three.module.js'
// import { GUI } from './jsm/libs/dat.gui.module.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OutlineEffect } from './jsm/effects/OutlineEffect.js'
import { MMDLoader } from './jsm/loaders/MMDLoader.js'
// import { MMDAnimationHelper } from './jsm/animation/MMDAnimationHelper.js'

const scene = new Scene()
const renderer = new WebGLRenderer({ antialias: true })
renderer.autoClear = false

let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT
const frustumSize = 30

Ammo().then(AmmoLib => {
    Ammo = AmmoLib
    init()
    animate()
})

const animate = () => {
    requestAnimationFrame(animate)
    reviser.render()
}

class IrisReviser {
    constructor(renderer) {
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(window.innerWidth, window.innerHeight)
        this.cameras = [
            new OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000),
            new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000),
            new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000),
            new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000),
            new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000)
        ]

        this.cameras.forEach(camera => { camera.position.z = 30 })
        this.controls = this.cameras.map(item => {
            const control = new OrbitControls(item, renderer.domElement)
            control.minDistance = 10
            control.maxDistance = 100
            control.enableRotate = false
            return control
        })

        this.effect = new OutlineEffect(renderer)
    }

    render() {
        const effect = this.effect
        const cameras = this.cameras
        effect.clear()
        effect.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT)
        effect.render(scene, this.cameras[0])

        effect.setViewport(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
        effect.render(scene, cameras[1])

        effect.setViewport(SCREEN_WIDTH / 2 + SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
        effect.render(scene, cameras[2])

        effect.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
        effect.render(scene, cameras[3])

        effect.setViewport(SCREEN_WIDTH / 2 + SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
        effect.render(scene, cameras[4])

    }

    onResize() {
        const aspect = window.innerWidth / window.innerHeight
        const cameras = this.cameras
        this.effect(window.innerWidth, window.innerHeight)

        cameras[0].left = 0.5 * frustumSize * aspect / -2
        cameras[0].right = 0.5 * frustumSize * aspect / 2
        cameras[0].top = frustumSize / 2
        cameras[0].bottom = - frustumSize / 2
        cameras[0].updateProjectionMatrix()

        cameras[1].left = 0.25 * frustumSize * aspect / - 2
        cameras[1].right = 0.25 * frustumSize * aspect / 2
        cameras[1].top = 0.5 * frustumSize / 2
        cameras[1].bottom = - 0.5 * frustumSize / 2
        cameras[1].updateProjectionMatrix()

        cameras[2].left = 0.25 * frustumSize * aspect / - 2
        cameras[2].right = 0.25 * frustumSize * aspect / 2
        cameras[2].top = 0.5 * frustumSize / 2
        cameras[2].bottom = - 0.5 * frustumSize / 2
        cameras[2].updateProjectionMatrix()

        cameras[3].left = 0.25 * frustumSize * aspect / - 2
        cameras[3].right = 0.25 * frustumSize * aspect / 2
        cameras[3].top = 0.5 * frustumSize / 2
        cameras[3].bottom = - 0.5 * frustumSize / 2
        cameras[3].updateProjectionMatrix()

        cameras[4].left = 0.25 * frustumSize * aspect / - 2
        cameras[4].right = 0.25 * frustumSize * aspect / 2
        cameras[4].top = 0.5 * frustumSize / 2
        cameras[4].bottom = - 0.5 * frustumSize / 2
        cameras[4].updateProjectionMatrix()

        this.controls.forEach(item => item.update())
    }

    setModel(model) {
        this.meshes = [
            model.clone(),
            model.clone(),
            model.clone(),
            model.clone(),
            model.clone()
        ]

        const eye = model.skeleton.bones[88]
        eye.getWorldPosition(this.cameras[0].position)
        this.cameras[0].position.setZ(1)
        this.controls[0].minZoom = 15
        eye.getWorldPosition(this.controls[0].target)
        this.controls[0].update()
    }
}

const reviser = new IrisReviser(renderer)

const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const ambient = new AmbientLight(0x666666)
    scene.add(ambient)

    const directionalLight = new DirectionalLight(0x887766)
    directionalLight.position.set(- 1, 1, 1).normalize()
    scene.add(directionalLight)
    container.appendChild(renderer.domElement)

    // model
    const onProgress = xhr => {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100
            console.log(`${Math.round(percentComplete, 2)}% downloaded`)
        }
    }

    const modelFile = 'models/mmd/kizunaai/kizunaai.pmx'
    const loader = new MMDLoader()

    loader.load(modelFile, object => {
        object.position.y = -10
        scene.add(object)
        window.mesh = object

        reviser.setModel(object)
    }, onProgress, null)
}

window.addEventListener('resize', reviser.onResize)