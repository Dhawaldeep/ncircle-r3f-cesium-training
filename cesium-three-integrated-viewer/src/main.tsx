import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Camera, Ion, Rectangle } from 'cesium';

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNjY2MjFkZC01ZmFmLTQyNTMtYmVmOS01YTY0NzhlNWFmMGEiLCJpZCI6MTY3NjcsImlhdCI6MTY5NjExMjM0Nn0.GAle6n-oi-eKMlebXLC0SquIMICLsMubzkxXqEmlcEI';

const extent = Rectangle.fromDegrees(68.11666667, 8.06666667, 97.41666667, 36.11666667);

Camera.DEFAULT_VIEW_RECTANGLE = extent;
Camera.DEFAULT_VIEW_FACTOR = 1;

createRoot(document.getElementById('root')!).render(
  <App />
)
