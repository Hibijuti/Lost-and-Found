import { AppTheme } from '@/constants/appTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle?: string;
};

/** Gradient page header used on main tab screens */
export function ScreenHeader({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[...AppTheme.headerGradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.decor} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.sub}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.lg,
    overflow: 'hidden',
  },
  decor: {
    position: 'absolute',
    right: -24,
    top: 8,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    opacity: 0.12,
  },
  title: {
    ...AppTheme.typography.title,
    fontSize: 26,
    color: AppTheme.textOnPrimary,
  },
  sub: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.88)',
    lineHeight: 20,
    maxWidth: '90%',
  },
});
