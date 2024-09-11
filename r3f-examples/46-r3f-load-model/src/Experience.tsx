import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import Fox from './Fox'

export default function Experience() {
    return <>
        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} shadow-normalBias={0.04} />
        <ambientLight intensity={0.5} />

        {/* <mesh castShadow position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh castShadow position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh> */}

        <mesh receiveShadow position-y={0} rotation-x={- Math.PI * 0.5} scale={10}>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" />
        </mesh>

        <Fox scale={0.02} position={[0, 0, 0]} rotation={[0, 0.3, 0]} />
    </>
}