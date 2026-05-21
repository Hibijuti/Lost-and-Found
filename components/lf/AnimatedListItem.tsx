import type { ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

type Props = {
  index: number;
  children: ReactNode;
};

/** Staggered fade-in for list rows */
export function AnimatedListItem({ index, children }: Props) {
  return (
    <Animated.View entering={FadeInDown.delay(Math.min(index * 55, 400)).springify().damping(18)}>
      {children}
    </Animated.View>
  );
}
