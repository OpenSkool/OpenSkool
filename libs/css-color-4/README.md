# CSS color level 4

Almost all code lifted from [PostCSS OkLab plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-oklab-function), who in turn lifted their implementation from the [CSS WG](https://github.com/w3c/csswg-drafts/tree/main/css-color-4).

This code is used in our Windi themes to write color ranges in [LCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch) and transform them into RGB hex values.

## Windi support

If [color-string](https://github.com/Qix-/color-string/) implement [CSS level 4 support](https://github.com/Qix-/color-string/issues/27) we can remove all of this again and directly code our colors in LCH.

Windi (who uses color-string) to parse the configured colors will compile and transform them into hex values for us.

## Browser support

Then even later if all ever-green browsers support the LCH color space natively Windi can even choose to not compile them into RGB hex values. That's probably still a good way down the line.
