/// <reference types="nativewind/types" />

// NativeWind type declarations
// This enables className prop on React Native components

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  
  interface TextProps {
    className?: string;
  }
  
  interface TextInputProps {
    className?: string;
  }
  
  interface TouchableOpacityProps {
    className?: string;
  }
  
  interface ScrollViewProps {
    className?: string;
  }
  
  interface ImageProps {
    className?: string;
  }
  
  interface FlatListProps<ItemT> {
    className?: string;
  }
}