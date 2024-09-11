import { useFrame, extend, useThree, Object3DNode } from "@react-three/fiber"
import { Mesh } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { useRef } from "react"
import CustomObject from "./CustomObject"

extend({ OrbitControls })

// declare module '@react-three/fiber' {
//     interface ThreeElements {
//       orbitControls: Object3DNode<OrbitControls, typeof OrbitControls>
//     }
//   }

export default function Experience() {
    const { gl, camera } = useThree()

    const cubeRef = useRef<Mesh>(null)

    useFrame(({camera, clock}, delta) => {
        camera.position.x = Math.sin(clock.elapsedTime) * 8;
        camera.position.z = Math.cos(clock.elapsedTime) * 8;
        camera.lookAt(0, 0, 0);
        cubeRef.current!.rotation.y += delta
    })

    return (
        <>
            {/* <orbitControls args={[ camera, gl.domElement ]} /> */}

            <directionalLight position={[1, 2, 3]} intensity={1.5} />
            <ambientLight intensity={0.5} />

            <group>
                <mesh ref={cubeRef} position-x={2} scale={1.5}>
                    <boxGeometry />
                    <meshStandardMaterial color={"mediumpurple"} />
                </mesh>
                <CustomObject />
                <mesh position-x={-2}>
                    <sphereGeometry />
                    <meshStandardMaterial color={"orange"} />
                </mesh>
            </group>
            <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <meshStandardMaterial color={"greenyellow"} />
            </mesh>
        </>
    )
}

