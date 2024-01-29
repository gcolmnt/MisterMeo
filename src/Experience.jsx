import { Physics } from '@react-three/rapier'
import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { Suspense, useState } from 'react'
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { useControls } from 'leva'
import * as THREE from 'three'
import Lights from './Lights.jsx'
import Room from './Room.jsx'
import Player from './Player.jsx'



export default function Experience() {

  // // Leva
  //   const { shadowColor  } = useControls ('shadowColor ', {
  //     shadowColor :
  //       {
  //           value: '#552635' ,
  //           color: true
  //       },
  //   })

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    { name: 'run', keys: ['Shift'] }
  ]
  
  const joystickMaterial = new THREE.MeshBasicMaterial({ color: "red" })

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return <>
    {isMobile && (
      <EcctrlJoystick 
        joystickBaseProps={{ material: joystickMaterial }}
        joystickStickProps={{ material: new THREE.MeshBasicMaterial({ color: "white" }) }}
        joystickHandleProps={{ material: new THREE.MeshBasicMaterial({ color: "darkred" }) }}
        buttonLargeBaseProps={{ material: new THREE.MeshBasicMaterial({ color: "darkred" }) }}
        buttonTop1Props={{ material: joystickMaterial }}
        buttonNumber={1}
      />
    )}
    <Canvas shadows >
      {/* <Perf position="top-left" /> */}
      <Lights />
      <Suspense fallback={ null }>
          <Physics debug={ false }>
            <KeyboardControls 
            map={ keyboardMap }
            >
              <Player />
              <Room />
              <mesh scale={1000} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.103, 0]} receiveShadow>
                <planeGeometry />
                <shadowMaterial color="#552635" transparent opacity={0.9} />
              </mesh>
            </KeyboardControls>
          </Physics>
        </Suspense>
    </Canvas>
 </>

}
