import { AppTheme } from '@/constants/appTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle: string;
};

export function AuthHero({ title, subtitle }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={[...AppTheme.headerGradientAuth]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.wrap, { paddingTop: insets.top + 20 }]}>
      <View style={styles.iconCircle}>
        <Ionicons name="search" size={32} color={AppTheme.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{subtitle}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.xl,
    borderBottomLeftRadius: AppTheme.radius.xl,
    borderBottomRightRadius: AppTheme.radius.xl,
    marginBottom: AppTheme.spacing.lg,
    ...AppTheme.softShadow,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppTheme.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  title: {
    ...AppTheme.typography.hero,
    fontSize: 28,
    color: AppTheme.textOnPrimary,
  },
  sub: {
    marginTop: 8,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
});
