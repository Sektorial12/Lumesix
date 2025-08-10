/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors // Directly key into the top-level Colors object
) {
  // Since we've removed dark mode, we can simplify this logic.
  // We'll prioritize colors passed via props, otherwise use the global Colors.
  const colorFromProps = props.light; // Only consider the 'light' prop if provided

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Directly access the color from the top-level Colors object
    return Colors[colorName];
  }
}