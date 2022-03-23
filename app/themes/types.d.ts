type Color = string | Record<string | number, string>;

export interface ExtendedColors {
  primary1: Color;
  primary2: Color;
  secondary: Color;

  // dark: Color;
  // light: Color;

  // info: Color;
  error: Color;
  warning: Color;
}
