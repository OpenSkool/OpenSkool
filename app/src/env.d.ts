/// <reference types="unplugin-icons/types/vue" />
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

interface ImportMetaEnv {
  VITE_API_BASE_URL: string;
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '~icons/*' {
  import type { FunctionalComponent, SVGAttributes } from 'vue';

  const component: FunctionalComponent<SVGAttributes>;
  export default component;
}
