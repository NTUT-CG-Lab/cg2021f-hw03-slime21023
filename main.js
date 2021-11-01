import {
    Scene,
    WebGLRenderer,
    OrthographicCamera,
    AmbientLight,
    DirectionalLight
} from './build/three.module.js'
import { GUI } from './jsm/libs/dat.gui.module.js'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OutlineEffect } from './jsm/effects/OutlineEffect.js'
import { MMDLoader } from './jsm/loaders/MMDLoader.js'
import { MMDAnimationHelper } from './jsm/animation/MMDAnimationHelper.js'

const scene = new Scene()
const renderer = new WebGLRenderer({ antialias: true })
renderer.autoClear = false
const effect = new OutlineEffect(renderer)

let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight
let aspect = SCREEN_WIDTH / SCREEN_HEIGHT
const frustumSize = 30
const camera = new OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000)
const camera2 = new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000)
const camera3 = new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000)
const camera4 = new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000)
const camera5 = new OrthographicCamera(0.25 * frustumSize * aspect / - 2, 0.25 * frustumSize * aspect / 2, 0.5 * frustumSize / 2, 0.5 * frustumSize / - 2, 0.1, 1000)

const helper = new MMDAnimationHelper()

Ammo().then(AmmoLib => {
    Ammo = AmmoLib
    init()
    animate()
})

const animate = () => {
    requestAnimationFrame(animate)
    render()
}

const render = () => {
    effect.clear()

    effect.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT)
    effect.render(scene, camera)

    effect.setViewport(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
    effect.render(scene, camera2)

    effect.setViewport(SCREEN_WIDTH / 2 + SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
    effect.render(scene, camera3)

    effect.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
    effect.render(scene, camera4)

    effect.setViewport(SCREEN_WIDTH / 2 + SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4, SCREEN_HEIGHT / 2)
    effect.render(scene, camera5)
}


const init = () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    camera.position.z = 30
    camera2.position.z = 30
    camera3.position.z = 30
    camera4.position.z = 30
    camera5.position.z = 30

    const ambient = new AmbientLight(0x666666)
    scene.add(ambient)

    const directionalLight = new DirectionalLight(0x887766)
    directionalLight.position.set(- 1, 1, 1).normalize()
    scene.add(directionalLight)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
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
    }, onProgress, null)
}

window.addEventListener('resize', () => {
    SCREEN_WIDTH = window.innerWidth
    SCREEN_HEIGHT = window.innerHeight
    aspect = SCREEN_WIDTH / SCREEN_HEIGHT

    effect.setSize(SCREEN_WIDTH, SCREEN_HEIGHT)

    camera.left = 0.5 * frustumSize * aspect / -2
    camera.right = 0.5 * frustumSize * aspect / 2
    camera.top = frustumSize / 2
    camera.bottom = - frustumSize / 2
    camera.updateProjectionMatrix()

    camera2.left = 0.25 * frustumSize * aspect / - 2
    camera2.right = 0.25 * frustumSize * aspect / 2
    camera2.top = 0.5 * frustumSize / 2
    camera2.bottom = - 0.5 * frustumSize / 2
    camera2.updateProjectionMatrix()

    camera3.left = 0.25 * frustumSize * aspect / - 2
    camera3.right = 0.25 * frustumSize * aspect / 2
    camera3.top = 0.5 * frustumSize / 2
    camera3.bottom = - 0.5 * frustumSize / 2
    camera3.updateProjectionMatrix()

    camera4.left = 0.25 * frustumSize * aspect / - 2
    camera4.right = 0.25 * frustumSize * aspect / 2
    camera4.top = 0.5 * frustumSize / 2
    camera4.bottom = - 0.5 * frustumSize / 2
    camera4.updateProjectionMatrix()

    camera5.left = 0.25 * frustumSize * aspect / - 2
    camera5.right = 0.25 * frustumSize * aspect / 2
    camera5.top = 0.5 * frustumSize / 2
    camera5.bottom = - 0.5 * frustumSize / 2
    camera5.updateProjectionMatrix()
})