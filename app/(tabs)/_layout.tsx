import { ScreenHeader } from '@/components/lf/ScreenHeader';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppTheme } from '@/constants/appTheme';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

const TAB_HEADERS: Record<string, { title: string; subtitle: string }> = {
  index: { title: 'Home', subtitle: 'Latest approved campus listings' },
  items: { title: 'Items', subtitle: 'Search and filter lost & found' },
  post: { title: 'Post', subtitle: 'Report something you lost or found' },
  profile: { title: 'Profile', subtitle: 'Your account and settings' },
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppTheme.primary,
        tabBarInactiveTintColor: AppTheme.textMuted,
        tabBarStyle: {
          backgroundColor: AppTheme.surfaceCard,
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          ...AppTheme.cardShadow,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarButton: HapticTab,
        // Avoid fade animation — it caused Post tab content to not render from Home/Items
        sceneStyle: { backgroundColor: AppTheme.surface, flex: 1 },
        freezeOnBlur: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          header: () => <ScreenHeader {...TAB_HEADERS.index} />,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
          header: () => <ScreenHeader {...TAB_HEADERS.items} />,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="list.bullet" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'Post',
          header: () => <ScreenHeader {...TAB_HEADERS.post} />,
          lazy: false,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="plus.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          header: () => <ScreenHeader {...TAB_HEADERS.profile} />,
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
