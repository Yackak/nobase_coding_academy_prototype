import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/mobile.css';
import './styles/desktop.css';
import './styles/motion.css';
import './styles/hero-scene.css';
import './styles/learning-scenes.css';
import './styles/editorial-images.css';
import './styles/brand-layout.css';

const root = document.getElementById('root')!;
const app = <StrictMode><App /></StrictMode>;
if (root.children.length) hydrateRoot(root, app);
else createRoot(root).render(app);
