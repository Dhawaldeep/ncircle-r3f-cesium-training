import { useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, DoubleSide } from "three";

export default function CustomObject() {
    const bufferGeom = useRef<BufferGeometry>(null);
    const [verticesCount] = useState(3 * 10);

    const positions = useMemo(() => {
        const positions = new Float32Array(verticesCount * 3);

        for (let i = 0; i < verticesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 3;       
        }

        return positions;
    }, []);

    useEffect(() => {
        bufferGeom.current!.computeVertexNormals();
    }, []);

    return <mesh>
        <bufferGeometry ref={bufferGeom}>
            <bufferAttribute 
                attach="attributes-position"
                count={verticesCount}
                itemSize={3}
                array={positions}
            />
        </bufferGeometry>
        <meshStandardMaterial color={'red'} side={DoubleSide} />
    </mesh>
}