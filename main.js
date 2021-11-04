import {
    Scene,
    WebGLRenderer,
    OrthographicCamera,
    AmbientLight,
    DirectionalLight,
    Cache,
    Vector3
} from './build/three.module.js'
// import { GUI } from './jsm/libs/dat.gui.module.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OutlineEffect } from './jsm/effects/OutlineEffect.js'
import { MMDLoader } from './jsm/loaders/MMDLoader.js'
// import { MMDAnimationHelper } from './jsm/animation/MMDAnimationHelper.js'

Cache.enabled = true
const scene = new Scene()
const renderer = new WebGLRenderer({ antialias: true })
renderer.autoClear = false

let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT
const frustumSize = 30
const modelList = [
    'models/mmd/kizunaai/kizunaai.pmx',
    // 'models/mmd/るいのれ式物述有栖_配布用フォルダ/物述有栖.pmx',
    'models/mmd/『天宮こころ(Kokoro Amamiya)』/『天宮こころ(Kokoro Amamiya)』.pmx'
]

let modelIndex = 0

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

        this.cameras.forEach(camera => {
            camera.position.z = 30
            scene.add(camera)
        })
        this.control = new OrbitControls(this.cameras[0], renderer.domElement)
        this.control.minDistance = 10
        this.control.maxDistance = 100
        this.control.enableRotate = false

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
        this.cameras.forEach(cam => cam.updateProjectionMatrix())
    }

    onResize() {
        const aspect = window.innerWidth / window.innerHeight
        const cameras = this.cameras
        this.effect.setSize(window.innerWidth, window.innerHeight)

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
    }

    setCameraToTarget(meshes) {
        const first = meshes[0]

        const face = first.skeleton.bones[8]
        console.log(face)
        const faceCenter = new Vector3()
        // face.geometry.computeBoundingBox()
        // face.geometry.boundingBox.getCenter(faceCenter)

        // console.log(faceCenter)
        // const eye = model.skeleton.bones[88]
        // eye.getWorldPosition(this.cameras[0].position)
        // this.cameras[0].position.setZ(1)
        // this.controls[0].minZoom = 15
        // eye.getWorldPosition(this.controls[0].target)
        // this.controls[0].update()
    }

    async setModel(url) {
        const loader = new MMDLoader()
        const onProgress = xhr => {
            if (xhr.lengthComputable) {
                const percentComplete = xhr.loaded / xhr.total * 100
                console.log(`${Math.round(percentComplete, 2)}% downloaded`)
            }
        }

        const loadModel = url => new Promise(resolve => {
            loader.load(url, model => {
                model.position.y = -10
                resolve(model)
            }, onProgress, null)
        })

        const model = await loadModel(url)
        this.meshes = [model.clone(), model.clone(), model.clone(), model.clone()]
        this.meshes.forEach((mesh, index) => {
            mesh.layers.set(index + 1)
            scene.add(mesh)
        })

        this.cameras.forEach((cam, index) => {
            if (index == 0) {
                cam.layers.toggle(1)
                return
            }
            cam.layers.toggle(index)
            cam.updateProjectionMatrix()
        })
        this.setCameraToTarget(this.meshes)
    }

    async cleanMeshes() {
        this.meshes.forEach(mesh => {
            scene.remove(mesh)
            mesh.geometry.dispose()
        })
        delete this.meshes
    }
}

const reviser = new IrisReviser(renderer)

const init = async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const ambient = new AmbientLight(0x666666)
    ambient.layers.enableAll()
    scene.add(ambient)

    const directionalLight = new DirectionalLight(0x887766)
    directionalLight.layers.enableAll()
    directionalLight.position.set(- 1, 1, 1).normalize()
    scene.add(directionalLight)
    container.appendChild(renderer.domElement)

    window._scene = scene
    reviser.setModel(modelList[modelIndex])
}

window.addEventListener('resize', reviser.onResize)

document.addEventListener('keydown', async ({ key }) => {
    if (key == 'a' || key == 'A') {
        if (modelIndex == 0) return
        reviser.cleanMeshes().then(() => {
            modelIndex -= 1
            reviser.setModel(modelList[modelIndex])
        })
    }

    if (key == 'd' || key == 'D') {
        if (modelIndex == modelList.length - 1) return
        reviser.cleanMeshes().then(() => {
            modelIndex += 1
            reviser.setModel(modelList[modelIndex])
        })
    }

}, false)