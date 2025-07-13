// data/onboardingData.ts
import { t } from '../../lib/translate';

export interface OnboardingItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

export const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    image: require('../../assets/onboarding/welcome.png'),
    title: t('onboarding.1.title'),
    description: t('onboarding.1.description'),
  },
  {
    id: '2',
    image: require('../../assets/onboarding/service.png'),
    title: t('onboarding.2.title'),
    description: t('onboarding.2.description'),
  },
  {
    id: '3',
    image: require('../../assets/onboarding/payment.png'),
    title: t('onboarding.3.title'),
    description: t('onboarding.3.description'),
  },
  {
    id: '4',
    image: require('../../assets/onboarding/partner.png'),
    title: t('onboarding.4.title'),
    description: t('onboarding.4.description'),
  },
];

export const getOnboardingData = (): OnboardingItem[] => [
  {
    id: '1',
    image: require('../../assets/onboarding/welcome.png'),
    title: t('onboarding.1.title'),
    description: t('onboarding.1.description'),
  },
  {
    id: '2',
    image: require('../../assets/onboarding/service.png'),
    title: t('onboarding.2.title'),
    description: t('onboarding.2.description'),
  },
  {
    id: '3',
    image: require('../../assets/onboarding/payment.png'),
    title: t('onboarding.3.title'),
    description: t('onboarding.3.description'),
  },
  {
    id: '4',
    image: require('../../assets/onboarding/partner.png'),
    title: t('onboarding.4.title'),
    description: t('onboarding.4.description'),
  },
];
