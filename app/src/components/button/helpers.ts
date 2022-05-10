type ClassArray = ClassValue[];
type ClassDictionary = Record<string, unknown>;
type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;

export interface ButtonStyleOptions {
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'caution'
    | 'danger'
    | 'success';
  disabled?: boolean;
  outline?: boolean;
  size?: 'sm' | 'base';
}

export function createButtonStyles({
  color = 'primary',
  disabled = false,
  outline = false,
  size = 'base',
}: ButtonStyleOptions): string {
  const classes: string[] = [
    'inline-flex items-center gap-1 rounded-md font-semibold select-none',
  ];
  switch (size) {
    case 'sm': {
      classes.push('text-sm px-8 py-1');
      break;
    }
    case 'base': {
      classes.push('text-base px-10 py-2');
      break;
    }
  }
  if (disabled) {
    classes.push(
      'border-2 text-stone-500 cursor-not-allowed',
      outline ? 'border-stone-300' : 'bg-stone-300',
    );
  } else {
    classes.push(
      'cursor-pointer',
      'focus:outline-none focus-visible:(ring-2 ring-offset-2)',
    );
    switch (color) {
      case 'primary': {
        classes.push(
          'border-2 border-primary-300 ring-primary-500',
          outline
            ? 'text-primary-600 active:border-primary-400'
            : 'text-primary-600 bg-primary-300 active:(bg-primary-400 border-primary-400)',
        );
        break;
      }
      case 'secondary': {
        classes.push(
          'border-2 border-secondary-300 ring-secondary-500',
          outline
            ? 'text-secondary-600 active:border-secondary-500'
            : 'text-white bg-secondary-300 active:(bg-secondary-400 border-secondary-400)',
        );
        break;
      }
      case 'tertiary': {
        classes.push(
          'border-2 border-tertiary-300 ring-tertiary-500',
          outline
            ? 'text-tertiary-600 active:border-tertiary-500'
            : 'text-white bg-tertiary-300 active:(bg-tertiary-400 border-tertiary-400)',
        );
        break;
      }
      case 'caution': {
        classes.push(
          'border-2 border-caution-300 ring-caution-500',
          outline
            ? 'text-caution-600 active:border-caution-400'
            : 'text-caution-600 bg-caution-300 active:(bg-caution-400 border-caution-400)',
        );
        break;
      }
      case 'danger': {
        classes.push(
          'border-2 border-danger-300 ring-danger-500',
          outline
            ? 'text-danger-600 active:border-danger-500'
            : 'text-white bg-danger-300 active:(bg-danger-400 border-danger-400)',
        );
        break;
      }
      case 'success': {
        classes.push(
          'border-2 border-success-300 ring-success-500',
          outline
            ? 'text-success-600 active:border-success-500'
            : 'text-success-600 bg-success-300 active:(bg-success-400 border-success-400)',
        );
        break;
      }
    }
  }
  return classes.join(' ');
}
