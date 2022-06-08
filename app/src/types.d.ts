import type { DefineComponent } from 'vue';

export type AnyComponent = DefineComponent<
  Record<string, unknown>,
  Record<string, unknown>,
  any // eslint-disable-line @typescript-eslint/no-explicit-any
>;

export type Action = string | (() => void);
export interface ActionItem {
  action: Action;
  icon: string;
  hasPermission: boolean;
  title: string;
}
