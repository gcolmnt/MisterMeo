import { RigidBody } from '@react-three/rapier'

export default function Floor()
{
    return <>

    {/* Floor */}
    <RigidBody 
        type="fixed"
        restitution={ 0.2 } 
        friction={ 1 }
        position={ [ 0, 0, 0 ] }
        scale={ [ 8, 0.2, 8 ] }
    >
        <mesh 
            castShadow
            receiveShadow
        >
            <boxGeometry />
            <meshStandardMaterial />
        </mesh>
    </RigidBody>
    </>
}