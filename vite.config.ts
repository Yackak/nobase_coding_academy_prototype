import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()], base: '/nobase_coding_academy_prototype/', build: { target: 'es2022' } });
