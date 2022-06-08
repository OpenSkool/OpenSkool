import { SetupContext, h, toRef, defineComponent, PropType, VNode } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: [String, Number] as PropType<string | number | undefined>,
      default: undefined,
    },
  },
  setup(props, context: SetupContext) {
    const switchValue = toRef(props, 'value');

    const slotFunction =
      switchValue.value != null && switchValue.value in context.slots
        ? context.slots[switchValue.value]
        : context.slots.default;

    return slotFunction
      ? (): VNode[] => slotFunction(context.attrs)
      : (): VNode => h('div', {}, ['']);
  },
});
