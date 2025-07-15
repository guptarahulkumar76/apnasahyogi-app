import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
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

const OnboardingScreen = () => {
  const { i18n, t } = useTranslation();
  const [onboardingData, setData] = useState(getOnboardingData());
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isManualScroll, setIsManualScroll] = useState(false);

  useEffect(() => {
    setData(getOnboardingData());
  }, [i18n.language]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index || 0;
        setCurrentIndex(index);
        setIsManualScroll(true); // user did manual scroll
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isManualScroll) {
        const nextIndex = (currentIndex + 1) % onboardingData.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isManualScroll]);

  // Reset manual scroll flag after delay
  useEffect(() => {
    if (isManualScroll) {
      const timeout = setTimeout(() => setIsManualScroll(false), 5000); // pause 5s
      return () => clearTimeout(timeout);
    }
  }, [isManualScroll]);

  const renderDots = () => (
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
        scrollEnabled={true} // enable manual swipe
      />

      {renderDots()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.replace('/auth/login')}
        >
          <Text style={styles.continueText}>
            {t('common.continue')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dotActive: {
    backgroundColor: '#f57c00',
    width: 10,
    height: 10,
  },
  dotInactive: {
    backgroundColor: '#ccc',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  continueBtn: {
    backgroundColor: '#f57c00',
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 30,
    elevation: 3,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
