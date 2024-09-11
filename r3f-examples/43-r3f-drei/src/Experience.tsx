import { useRef, MutableRefObject } from "react";
import { OrbitControls } from "@react-three/drei";
import { TransformControls } from "@react-three/drei/core";
import { Mesh } from "three";
import { MeshReflectorMaterial, Html, PivotControls, Text, Float } from "@react-three/drei/web";
import { useControls, button } from "leva";
import { MeshStandardMaterial } from "three";
import { Perf } from 'r3f-perf'

export default function Experience() {
    const cubeRef = useRef<Mesh | null>(null);
    const sphereRef = useRef<Mesh | null>(null);

    const { position, color, visible } = useControls("sphere", {
        position: {
            value: { x: -2, y: 0 },
            min: -4,
            max: 4,
            step: 0.01,
            joystick: 'invertY'
        },
        color: 'orange',
        visible: true,
        arbInterval:
        {
            min: 0,
            max: 10,
            value: [4, 5],
        },
        toggleWireframe: button(() => { (sphereRef.current!.material as MeshStandardMaterial).wireframe = !(sphereRef.current!.material as MeshStandardMaterial).wireframe; }),
        choice: {
            options: ['a', 'b', 'c']
        }
    });

    const { scale } = useControls('cube', {
        scale:
        {
            value: 1.5,
            step: 0.01,
            min: 0,
            max: 5
        }
    });

    const { perfVisible } = useControls({
        perfVisible: true
    });

    return (
        <>
            {perfVisible && <Perf position="top-left" />}

            <OrbitControls makeDefault />

            <directionalLight position={[1, 2, 3]} intensity={1.5} />
            <ambientLight intensity={0.5} />

            <PivotControls
                anchor={[0, 0, 0]}
                depthTest={false}
                lineWidth={4}
                axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
                scale={100}
                fixed={true}
            >
                <mesh ref={sphereRef} visible={visible} position={[position.x, position.y, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color={color} />
                    {/* use @react-three/drei@9.40  */}
                    <Html
                        wrapperClass="label"
                        position={[1, 1, 0]}
                        distanceFactor={8}
                        occlude={[sphereRef, cubeRef]}
                        center
                    >
                        A Sphere
                    </Html>
                </mesh>
            </PivotControls>


            <mesh ref={cubeRef} position-x={2} scale={scale}>
                <boxGeometry />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
            <TransformControls object={cubeRef as MutableRefObject<Mesh>} />


            <mesh position-y={- 1} rotation-x={- Math.PI * 0.5} scale={10}>
                <planeGeometry />
                <MeshReflectorMaterial
                    mirror={0.5}
                    resolution={512}
                    blur={[1000, 1000]}
                    mixBlur={1} color="greenyellow"
                />
            </mesh>

            <Float
                speed={5}
                floatIntensity={2}
            >
                <Text
                    font={"./bangers-v20-latin-regular.woff"}
                    fontSize={1}
                    color="#ff9933"
                    position={[0, 1, -1]}
                    maxWidth={2}
                    textAlign="center"
                >I LOVE R3F</Text>
            </Float>
        </>
    )
}

