import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Html, useGLTF, useTexture, useKeyboardControls, Plane } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { useJoystickControls  } from "ecctrl";
import { useControls } from 'leva'
import { TextureLoader } from 'three';
import Floor from './Floor.jsx';


export default function Room()

{
    // // Leva
    // const { ColPos, ColSize } = useControls ('ColliderPos', {
    //     ColPos:
    //     {
    //         value: { x: 0, y: 2, z: 0} ,
    //         step: 0.05,
    //         min: -10,
    //         max: 10,
    //     },
    //     ColSize:
    //     {
    //         value: { x: 0.5, y: 0.5, z: 0.5} ,
    //         step: 0.05,
    //         min: -10,
    //         max: 10,
    //     },
    // })
  
    const { nodes } = useGLTF('./Room.glb')
    const bakedTexture = useTexture('./bakeddef.jpg')
    bakedTexture.flipY = false
    const [ hitBoxSound ] = useState(() => new Audio('./1.wav')) 
    const [ hitSoundCouch ] = useState(() => new Audio('./rebound.mp3'))
    const [ JukeboxMusic ] = useState(() => new Audio('./384-Steppin-Up.mp3')) 
    const alphaMap = useLoader(TextureLoader, './moveset.jpg');

    const [subscribeKeys, getKeys] = useKeyboardControls()
    const getJoystickValues = useJoystickControls(state => state.getJoystickValues)

    const HitboxArcade = useRef()
    const hitBoxArcade = useGLTF('./HitBoxArcade.glb')

    hitBoxArcade.scene.children.forEach((mesh) => 
    {
        mesh.castShadow = true
    })

    const HitboxJukebox = useRef()
    const hitboxJukebox = useGLTF('./HitBoxJukebox.glb')
    hitboxJukebox.scene.children.forEach((mesh) => 
    {
        mesh.castShadow = true
    })

    const HitboxContact = useRef()
    const hitboxContact = useGLTF('./HitBoxContact.glb')
    hitboxContact.scene.children.forEach((mesh) => 
    {
        mesh.castShadow = true
    })

    /**
     * Collision Event
     */

    

    // Arcade Collision
    const [linkCanBeOpened, setlinkCanBeOpened] = useState(false)
    const [linkOpened, setLinkOpened] = useState(false)
    const [arcadeOn, setArcadeOn] = useState(false);

    const collisionArcadeEnter = () =>
    {
        setlinkCanBeOpened(true)
        setArcadeOn((prevValue) => !prevValue)
        hitBoxSound.currentTime = 0
        hitBoxSound.volume = 1
        hitBoxSound.play()
    }

    const collisionArcadeExit = () =>
    {
        setlinkCanBeOpened(false)
    }

    // Jukebox Collision
    const [jukeboxOn, setJukeboxOn] = useState(false); 

    const collisionJukeboxEnter = () =>
    {
        setJukeboxOn((prevValue) => !prevValue)
        hitBoxSound.currentTime = 0
        hitBoxSound.volume = 1
        hitBoxSound.play()
    }

    if (jukeboxOn) {    
        setTimeout(() => {
            JukeboxMusic.currentTime = 0
            JukeboxMusic.volume = 0.3
            JukeboxMusic.play()
        }, 750)
    } 
    
    else {
         if (!jukeboxOn) {
            JukeboxMusic.pause()
        }
    }

    // Contact Collision
    const [contactOn, setContactOn] = useState(false);
    const [showContactDiv, setShowContactDiv] = useState(false);

    const collisionContactEnter = () =>
    {
        setContactOn((prevValue) => !prevValue)
        setShowContactDiv((prevValue) => !prevValue)
        hitBoxSound.currentTime = 0
        hitBoxSound.volume = 1
        hitBoxSound.play()
    }

    // Couch Collision
    

    const couchRebound = () =>
    {
        hitSoundCouch.currentTime = 0
        hitSoundCouch.volume = Math.random()
        hitSoundCouch.play()
    }

    /**
     * Use Effect
     */



    /**
     * Use Frame
     */
    useFrame(({ clock }) => {

        // Arcade Condition
        if (linkCanBeOpened === true) {
        
            if (!linkOpened) {
            setLinkOpened(true);
            setTimeout(() => {
                window.location.href ='./game.html';
            }, 750);
            }
        } else {
            setLinkOpened(false);
        }

        if (arcadeOn ){
            HitboxArcade.current.rotation.y += 0.025
            HitboxArcade.current.position.y = Math.cos(clock.elapsedTime * 2) * 0.05
        }

        if (jukeboxOn) {    
            HitboxJukebox.current.rotation.y += 0.025
            HitboxJukebox.current.position.y = Math.cos(clock.elapsedTime* 2) * 0.05
        }

        if (contactOn) {    
            HitboxContact.current.rotation.y += 0.025
            HitboxContact.current.position.y = Math.cos(clock.elapsedTime* 2) * 0.05
        }

    });

    return <>

        <mesh geometry={ nodes.baked.geometry } position={[0, 0.083, 0]} scale={1.3}>
            <meshBasicMaterial map={ bakedTexture } />
        </mesh>
        
        {/* Walls */}
        {/* Droite */}
        <CuboidCollider position={[ 3.95, 3, 0 ]} args={[0.1, 3, 4]}>
            <mesh position={[ 0, -0.95, 0 ]}>
                <boxGeometry args={ [ 0.1, 3.9, 7.8 ] }/>
                <meshStandardMaterial color= "#936BE8" />
            </mesh>
        </CuboidCollider>
        {/* Gauche */}
        <CuboidCollider position={[-3.95, 3, 0]} args={[0.1, 3, 4]}>
        <mesh position={[ 0, -0.95, 0 ]}>
                <boxGeometry args={ [ 0.1, -3.9, -7.8 ] }/>
                <meshStandardMaterial color= "#936BE8" />
            </mesh>
        </CuboidCollider>
        {/* Avant */}
        <CuboidCollider position={[0, 3, 3.95]} args={[4, 3, 0.1]} />
        {/* Arriere */}
        <CuboidCollider position={[0, 3, -4.2]} args={[4, 3, 0.1]}>
        <mesh position={[ 0, -0.95, 0.25 ]}>
                <boxGeometry args={ [ 8, 3.9, 0.1 ] }/>
                <meshStandardMaterial color= "#936BE8" />
            </mesh>
        </CuboidCollider>


        {/* Objects */}
        {/* Couch */}
        <CuboidCollider 
            restitution={ 1 }
            position={[1.25, 0.75, 0.4]}
            args={[0.5, 0.01, 1.3]}
            onCollisionEnter= { couchRebound }
        />
        <CuboidCollider position={[1.3, 0.4, 0.4]} args={[0.5, 0.3, 1.3]} />
        <CuboidCollider position={[0.2, 0.5, 0.4]} args={[0.2, 0.55, 1.62]} />
        <CuboidCollider position={[1.1, 0.5, 1.8]} args={[0.6, 0.55, 0.2]} />
        <CuboidCollider position={[1.1, 0.5, -1.1]} args={[0.6, 0.55, 0.2]} />
        <CuboidCollider rotation={[ 0, 0, 0.2 ]} position={[0.65, 1.05, -0.3]} args={[0.01, 0.25, 0.55]} />
        <CuboidCollider rotation={[ 0, 0, 0.2 ]} position={[0.65, 1.05, 1]} args={[0.01, 0.25, 0.55]} />

        {/* Desk */}
        <CuboidCollider position={[0.92, 0.6, -3.4]} args={[1.35, 0.55, 0.4]} />
        <CuboidCollider position={[0.92, 1.55, -3.7]} args={[0.55, 0.45, 0.2]} />
        <CuboidCollider position={[2.3, 0.45, -3.4]} args={[0.15, 0.35, 0.4]} />

        {/* Arcade */}
        <CuboidCollider position={[-1.2, 1.15, -3.25]} args={[0.55, 1.2, 0.65]} />

        {/* JukeBox */}
        <CuboidCollider rotation={[ 0, -2.42, 0 ]} position={[-3.2, 1.05, -3.2]} args={[0.5, 0.95, 0.55]} />

        {/* Shelf */}
        <CuboidCollider position={[-3.65, 2.1, 1.15]} args={[0.25, 0.05, 1.7]} />
        <CuboidCollider position={[-3.6, 3.1, 1.05]} args={[0.3, 0.25, 1.15]} />
        <CuboidCollider position={[-3.6, 2.45, 1.1]} args={[0.3, 0.25, 1.5 ]} />

        {/* Phone */}
        <CuboidCollider position={[3.7, 0.6, 2.4]} args={[0.15, 0.5, 0.2]} />
        
        {/* TV */}
        <CuboidCollider position={[3.4, 0.5, 0.1]} args={[0.5, 0.35, 1.9]} />
        <CuboidCollider position={[3.3, 1.25, -1.45]} args={[0.3, 0.4, 0.1]} />
        <CuboidCollider position={[3.55, 1.7, 0.3]} args={[0.05, 0.8, 1.45]} />
        {/* Flower */}
        <CuboidCollider position={[3.35, 0.35, -3.35]} args={[0.3, 0.25, 0.25]} />

        {/* Trigger */}

        {/* HitBox Arcade */}
        <group>
            <RigidBody 
                type="fixed" 
                position={ [-1.18, 2.2, -2.3] }
                restitution={ 0.2 }
                friction={ 0 }
            >
                <primitive ref={HitboxArcade} object={hitBoxArcade.scene} scale={ 0.3 }/>
            </RigidBody>
            <CuboidCollider 
                onCollisionEnter={ collisionArcadeEnter } 
                onCollisionExit={ collisionArcadeExit }
                position={ [-1.18, 2.25, -2.3] }
                args={[ 0.25, 0.01, 0.25]}
            />
        </group>


        {/* HitBox Jukebox */}
        <group>
            <RigidBody 
                type="fixed" 
                position={ [-2.5, 2.1, -2.3] }
                rotation={ [0, Math.PI * 0.225, 0] }
                restitution={ 0.2 }
                friction={ 0 }
            >
                <primitive ref={HitboxJukebox} object={hitboxJukebox.scene} scale={ 0.3 }/>
            </RigidBody>
            <CuboidCollider 
                onCollisionEnter={ collisionJukeboxEnter } 
                position={ [-2.5, 2.15, -2.3] }
                rotation={ [0, Math.PI * 0.225, 0] }
                args={[ 0.25, 0.01, 0.25]}
            />
        </group>

        {/* HitBox Contact */}
        <group>
            <RigidBody 
                type="fixed" 
                position={ [3.5, 2.4, 3.2] }
                rotation={ [0, Math.PI * 0.225, 0] }
                restitution={ 0.2 }
                friction={ 0 }
            >
                <primitive ref={HitboxContact} object={hitboxContact.scene} scale={ 0.3 }/>
            </RigidBody>
            <CuboidCollider 
                onCollisionEnter={ collisionContactEnter } 
                position={ [3.5, 2.45, 3.2] }
                rotation={ [0, Math.PI * 0.225, 0] }
                args={[ 0.25, 0.01, 0.25]}
            />
        </group>

        {showContactDiv && (
            <Html position={[3.5, 2.15, 3.2]}>
                <div className="contactbox">
                    <p className="contact">Contact</p>
                    <div className="link">
                        <a href="mailto:gregory.colmont@gmail.com"><img src="./iconMail.png" alt="Mail Icon" width={50} height={50} /><span>Mail</span></a>
                        <a href="https://github.com/gcolmnt" target="_blank"><img src="./iconGit.png" alt="Github Icon" width={50} height={50} /><span>Github</span></a>
                        <a href="https://www.linkedin.com/in/greg-colmont-35274a9b/" target="_blank"><img src="./iconLinkedIn.png" alt="LinkedIn Icon" width={50} height={50} /><span>LinkedIn</span></a>
                    </div>
                </div>
            </Html>
        )}

        {/* Floor */}
        <Plane args={[8, 6]} rotation={[0, Math.PI/2, 0]} position={[-3.89, 1, 1.4]} scale={ 0.4 }>
            <meshBasicMaterial attach="material" color="FloralWhite" alphaMap={alphaMap} transparent opacity={ 0.8} />
        </Plane>

        <Floor />
    </>
}