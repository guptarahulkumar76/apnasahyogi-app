// types/global.d.ts
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

declare global {
  var confirmationResult: FirebaseAuthTypes.ConfirmationResult | null;
}