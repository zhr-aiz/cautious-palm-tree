/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_SERVICE_MODE: 'mock' | 'real';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
