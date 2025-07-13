import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import OnboardingItems from '../data/OnboardingItem';
import { getOnboardingData } from '../data/onboardingData';


const { width } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
  onLogin: () => void;
  onSignup: () => void;
}

const OnboardingScreen: React.FC<Props> = ({ onFinish, onLogin, onSignup }) => {
  const { i18n, t } = useTranslation(); // to detect language change
  const [onboardingData, setData] = useState(getOnboardingData());
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    setData(getOnboardingData()); // update onboarding data when language changes
  }, [i18n.language]);

  // Auto-scroll every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % onboardingData.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // Handle scroll update manually (if you enable scrollEnabled: true)
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <OnboardingItems item={item} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEnabled={false} // set to true if you want manual swipe also
      />

      {renderDots()}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.buttonText}>{t('auth.login')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => router.push('/auth/register')}
        >
          <Text style={styles.buttonText}>{t('auth.signup')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#007bff',
    width: 14,
    height: 14,
  },
  dotInactive: {
    backgroundColor: '#ccc',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flex: 0.45,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#007bff',
  },
  signupButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
