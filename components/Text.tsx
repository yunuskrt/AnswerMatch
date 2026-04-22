import { Caveat_400Regular, Caveat_700Bold, useFonts } from '@expo-google-fonts/caveat';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, Text as RNText, TextProps, TextStyle } from 'react-native';

SplashScreen.preventAutoHideAsync();

const Text = React.forwardRef<RNText, TextProps>(({ style, ...props }, ref) => {
  const [loaded, error] = useFonts({ Caveat_400Regular, Caveat_700Bold });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = flat?.fontWeight;
  const fontFamily =
    weight === 'bold' || weight === '700' || weight === '800' || weight === '900'
      ? 'Caveat_700Bold'
      : 'Caveat_400Regular';

  return (
    <RNText
      ref={ref}
      style={[{ fontFamily }, style, { fontWeight: undefined }]}
      {...props}
    />
  );
})

Text.displayName = 'Text'

export default Text
