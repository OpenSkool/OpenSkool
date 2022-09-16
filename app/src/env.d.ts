/// <reference types="unplugin-icons/types/vue" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
}

declare module '~icons/*' {
  import type { FunctionalComponent, SVGAttributes } from 'vue';

  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}
