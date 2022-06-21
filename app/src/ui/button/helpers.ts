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
  color?: 'primary' | 'danger';
  disabled?: boolean;
  outline?: boolean;
  size?: 'sm' | 'base';
}

export function createButtonStyles({
  color = 'primary',
  disabled = false,
  outline = false,
  size = 'base',
}: ButtonStyleOptions = {}): string {
  const classes: string[] = [
    'inline-flex items-center rounded-md font-semibold select-none',
  ];
  switch (size) {
    case 'sm': {
      classes.push('gap-3 text-sm px-8 py-1');
      break;
    }
    case 'base': {
      classes.push('gap-5 px-10 py-2');
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
          'border-2 ring-primary-700',
          outline
            ? 'text-primary-700 border-primary-400 active:border-primary-600'
            : 'text-white bg-primary-500 border-primary-500 active:(bg-primary-600 border-primary-600)',
        );
        break;
      }
      case 'danger': {
        classes.push(
          'border-2 ring-danger-700',
          outline
            ? 'text-danger-700 border-danger-400 active:border-danger-600'
            : 'text-white bg-danger-500 border-danger-500 active:(bg-danger-600 border-danger-600)',
        );
        break;
      }
    }
  }
  return classes.join(' ');
}
