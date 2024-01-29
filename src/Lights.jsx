import { useRef } from 'react'
import { useControls } from 'leva'
import { useHelper } from '@react-three/drei'
import * as THREE from 'three'

export default function Lights()
{
    
    const dirLight = useRef()
    // useHelper(dirLight, THREE.DirectionalLightHelper, 10, 'red')
    
    // // Leva
    // const { LightPos } = useControls ('LightPosition', {
    //     LightPos:
    //     {
    //         value: { x: 0, y: 2, z: 0} ,
    //         step: 0.25,
    //         min: -10,
    //         max: 10,
    //     },
    // })

    return <>
        <directionalLight
            ref={ dirLight }
            castShadow
            position={ [ 0, 5, 0 ] }
            intensity={ 4.5 }
            shadow-mapSize={ [ 512, 512 ] }
            shadow-camera-near={ 1 }
            shadow-camera-far={ 16 }
            shadow-camera-top={ 10 }
            shadow-camera-right={ 10 }
            shadow-camera-bottom={ - 10 }
            shadow-camera-left={ - 10 }
            shadow-bias={-0.05}
        />
        <ambientLight intensity={ 0.5 } />
    </>
}