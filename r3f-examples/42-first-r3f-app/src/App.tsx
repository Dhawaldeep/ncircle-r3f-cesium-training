import './App.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import { ACESFilmicToneMapping } from 'three'

function App() {

  return (
    <Canvas
      // dpr={[1,2]}
      // flat
      gl={{
        alpha: true,
        antialias: true,
        toneMapping: ACESFilmicToneMapping,
        // outputColorSpace: "srgb",
      }}
      // orthographic
      camera={{
        // zoom: 100,
        fov: 45,
        near: 0.1,
        far: 100,
        position: [3, 2, 6]
      }}
    >
      <Experience />
    </Canvas>
  )
}

export default App
