import { useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useControls } from "leva"

export default function Fox(props: { scale: number; rotation: [x: number, y: number, z: number]; position: [x: number, y: number, z: number] }) {
    const model = useGLTF("/Fox/glTF/Fox.gltf");
    const animations = useAnimations(model.animations, model.scene);

    const { animate } = useControls("Fox", {
        animate: {
            options: animations.names
        }
    });
    useEffect(() => {
        const action = animations.actions[animate];
        action?.reset().fadeIn(0.5).play();
        return () => {
            action?.fadeOut(0.5);
        }
    }, [animate])

    return <primitive {...props} object={model.scene} />
}