import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
  BackHandler,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingItems from '../data/OnboardingItem';
import { getOnboardingData } from '../data/onboardingData';

const { width } = Dimensions.get('window');

const LANGUAGE_KEY = 'language';

const OnboardingScreen = () => {
  const { i18n, t } = useTranslation();
  const [onboardingData, setData] = useState(getOnboardingData());
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // Check if language is selected
  useEffect(() => {
    const checkLanguage = async () => {
      const selectedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      console.log('Selected language:', selectedLang);
      if (!selectedLang) {
        setShowLanguageModal(true);
      }else {
        await i18n.changeLanguage(selectedLang);
        setData(getOnboardingData());
      }
    };
    checkLanguage();
  }, []);

  const selectLanguage = async (langCode: string) => {
    await AsyncStorage.setItem(LANGUAGE_KEY, langCode);
    i18n.changeLanguage(langCode);
    setData(getOnboardingData());
    setShowLanguageModal(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      setData(getOnboardingData());

      const onBackPress = () => {
        if (Platform.OS === 'android') {
          BackHandler.exitApp();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [i18n.language])
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index || 0;
        setCurrentIndex(index);
        setIsManualScroll(true);
      }
    }
  ).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isManualScroll) {
        const nextIndex = (currentIndex + 1) % onboardingData.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, isManualScroll]);

  useEffect(() => {
    if (isManualScroll) {
      const timeout = setTimeout(() => setIsManualScroll(false), 5000);
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
        scrollEnabled
      />

      {renderDots()}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.replace('/auth/login')}
        >
          <Text style={styles.continueText}>{t('common.continue')}</Text>
        </TouchableOpacity>
      </View>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Language</Text>

            {[
              { label: 'English', code: 'en' },
              { label: 'हिन्दी', code: 'hi' },
              { label: 'Hinglish', code: 'hn' },
            ].map((lang) => (
              <Pressable
                key={lang.code}
                style={styles.langBtn}
                onPress={() => selectLanguage(lang.code)}
              >
                <Text style={styles.langText}>{lang.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
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
    marginTop: 10,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  langBtn: {
    backgroundColor: '#f57c00',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  langText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
