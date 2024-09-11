import './App.css'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience'
import { Leva } from 'leva'

function App() {

  return (
    <>
      <Leva  collapsed/>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [- 4, 3, 6]
        }}
      >
        <Experience />
      </Canvas>
    </>
  )
}

export default App
