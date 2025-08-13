import { type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { BaseView } from './base/BaseView'; // Import BaseView

export type StyledViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function StyledView({ style, lightColor, darkColor, ...otherProps }: StyledViewProps) { // Renamed function
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <BaseView style={[{ backgroundColor }, style]} {...otherProps} />; // Use BaseView here
}
