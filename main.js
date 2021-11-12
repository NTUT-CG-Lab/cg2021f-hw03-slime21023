import {
    Scene,
    WebGLRenderer,
    OrthographicCamera,
    AmbientLight,
    DirectionalLight,
    Vector3,
    Box3,
} from './build/three.module.js'
import { OutlineEffect } from './jsm/effects/OutlineEffect.js'
import { MMDLoader } from './jsm/loaders/MMDLoader.js'

let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT
const frustumSize = 30
const container = document.createElement('div')
document.body.appendChild(container)

const modelList = [
    'models/mmd/kizunaai/kizunaai.pmx',
    'models/mmd/るいのれ式物述有栖_配布用フォルダ/物述有栖.pmx',
    'models/mmd/『天宮こころ(Kokoro Amamiya)』/『天宮こころ(Kokoro Amamiya)』.pmx'
]

const onProgress = xhr => {
    if (xhr.lengthComputable) {
        const percentComplete = xhr.loaded / xhr.total * 100
        console.log(`${Math.round(percentComplete, 2)}% downloaded`)
    }
}

const loadModel = url => new Promise(resolve => {
    const loader = new MMDLoader()
    loader.load(url, model => {
        model.position.y = -10
        resolve(model)
    }, onProgress, null)
})

let reviser
const animate = () => {
    requestAnimationFrame(animate)
    reviser.render()
}

Promise.all(modelList.map(loadModel)).then(models => {
    reviser = new IrisReviser(models)
    Ammo().then(AmmoLib => {
        Ammo = AmmoLib
        animate()
    })
})

const getMeshBox = mesh => {
    const { geometry } = mesh
    geometry.computeBoundingBox()
    const box = new Box3()
    box.copy(geometry.boundingBox)
    return box
}

const getBonePosition = mesh => {
    const names = ["首", "頭", "左目", "右目"]
    const { bones } = mesh.skeleton
    const positions = names.map(n => {
        const target = bones.filter(bone => bone.name == n)[0]
        const position = new Vector3()
        position.setFromMatrixPosition(target.matrixWorld)
        return position
    })

    return {
        neck: positions[0],
        head: positions[1],
        lefteye: positions[2],
        righteye: positions[3],
    }
}

const createResource = () => {
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.autoClear = false
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    const scene = new Scene()
    const ambient = new AmbientLight(0x666666)
    ambient.layers.enableAll()
    scene.add(ambient)

    const directionalLight = new DirectionalLight(0x887766)
    directionalLight.layers.enableAll()
    directionalLight.position.set(- 1, 1, 1).normalize()
    scene.add(directionalLight)

    const effect = new OutlineEffect(renderer)
    const cameras = [
        new OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000),
        new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000),
        new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000),
        new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000),
        new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000)
    ]
    cameras.forEach(cam => {
        cam.position.z = 30
        scene.add(cam)
    })

    return { renderer, scene, effect, cameras }
}

// TODO box max z
const setCameraPosition = (cam, position, box) => {
    const { max } = box
    const tarPos = position.clone()
    tarPos.setZ(max.z)

    const pos = position.clone()
    pos.setZ(pos.z + 30)
    cam.position.copy(pos)
    cam.lookAt(tarPos)
    cam.zoom = 1
    cam.updateProjectionMatrix()
}

class IrisReviser {
    constructor(models) {
        this.models = models
        this.modelIndex = 0
        const resources = models.map(model => {
            const { renderer, scene, effect, cameras } = createResource()
            const meshes = [model.clone(), model.clone(), model.clone(), model.clone()]
            meshes.forEach((mesh, index) => {
                mesh.layers.set(index + 1)
                scene.add(mesh)
            })

            cameras.forEach((cam, index) => {
                if (index == 0) {
                    cam.layers.set(1)
                    return
                }

                cam.layers.set(index)
                cam.updateProjectionMatrix()
            })

            const box = getMeshBox(model)
            const positions = getBonePosition(model)
            cameras.map(cam => setCameraPosition(cam, positions.head, box))

            return { renderer, scene, effect, cameras, meshes, box, positions }
        })
        this.res = resources
        const target = this.res[this.modelIndex]
        container.appendChild(target.renderer.domElement)
        window._scene = target.scene
    }

    render() {
        const target = this.res[this.modelIndex]
        const cameras = target.cameras
        const effect = target.effect
        const scene = target.scene

        effect.clear()
        effect.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT)
        effect.render(scene, cameras[0])
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
        const target = this.res[this.modelIndex]
        const effect = target.effect
        effect.setSize(window.innerWidth, window.innerHeight)
        const cameras = target.cameras
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

    preModel() {
        if (this.modelIndex == 0) return
        this.clearContainer()

        const target = this.res[--this.modelIndex]
        container.appendChild(target.renderer.domElement)
    }

    nextModel() {
        if (this.modelIndex == this.res.length - 1) return
        this.clearContainer()

        const target = this.res[++this.modelIndex]
        container.appendChild(target.renderer.domElement)
    }

    clearContainer() {
        container.innerHTML = ''
    }

}

window.addEventListener('resize', () => { reviser.onResize() })
document.addEventListener('keydown', ({ key }) => {
    if (key == 'a' || key == 'A') {
        reviser.preModel()
    }

    if (key == 'd' || key == 'D') {
        reviser.nextModel()
    }
})