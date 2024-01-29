import Model from './Model.jsx'
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl"
import { Suspense, useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { useJoystickControls  } from "ecctrl";

export default function Player()

{
    const characterURL = './Cat.glb';
    
    const animationSet = {
      idle: "Idle",
      walk: "Walk",
      run: "Run",
      jump: "Jump",
      jumpIdle: "Jump_Idle",
    };

    const playerRef = useRef()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const getJoystickValues = useJoystickControls(state => state.getJoystickValues)

    const [ jumpSound ] = useState(() => new Audio('./jump_02.wav'))
    const [soundPlayed, setSoundPlayed] = useState(false);

    useFrame((state, delta) =>
    {
        const { jump } = getKeys();
        if (jump || getJoystickValues().button1Pressed === true) {
            if (!soundPlayed) {
                setSoundPlayed(true); 
                jumpSound.currentTime = 0
                jumpSound.volume = 0.5
                jumpSound.play()
                setTimeout(() => {
                    setSoundPlayed(false);
                }, 900);
            }
        }

        const characterPosition = playerRef.current.translation();
        console.log(characterPosition)
    })


return<>
    <Suspense fallback={ null }>
        <Ecctrl
            ref={playerRef}
            floatingDis={0.33}
            camInitDis= {-4}
            capsuleHalfHeight= {0.35}
            capsuleRadius= {0.3}
            position={[ -2, 1.5, 2 ]}
            camCollision= {false}
            camInitDir = {{ x: - Math.PI / 9, y: - Math.PI, z: 0 }}
            animated={ true }
        >
            <EcctrlAnimation
            characterURL={characterURL} // Must have property
            animationSet={animationSet} // Must have property
            >
                <Model />
            </EcctrlAnimation>
        </Ecctrl>
    </Suspense>
</>
}