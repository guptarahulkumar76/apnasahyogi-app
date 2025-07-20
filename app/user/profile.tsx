import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';


type ProfileOption = {
  id: string;
  icon: string;
  label: string;
  iconSet: 'Feather' | 'Ionicons' | 'MaterialIcons' | 'Entypo' | 'none';
};

const rawOptions: ProfileOption[] = [
  { id: '1', icon: 'users', label: 'Your Connections', iconSet: 'Feather' },
  { id: '2', icon: 'bookmark-outline', label: 'Your Bookings', iconSet: 'Ionicons' },
  { id: '3', icon: 'subscriptions', label: 'Subscription', iconSet: 'MaterialIcons' },
  { id: '4', icon: 'language', label: 'Language', iconSet: 'MaterialIcons' },
  { id: '5', icon: 'location-pin', label: 'Location', iconSet: 'Entypo' },
  { id: '6', icon: 'help-circle', label: 'Help', iconSet: 'Feather' },
  { id: '7', icon: 'shield', label: 'Policies', iconSet: 'Feather' },
  { id: '8', icon: 'log-out', label: 'Log Out', iconSet: 'Feather' },
];


const handleLogout = async () => {
  router.replace('/mainscreen/OnboardingScreen'); // 🔁 Replace instead of push
};


// Add divider before the first item + between every 2 items + after Log Out
const profileOptions: ProfileOption[] = [];

profileOptions.push({
  id: 'divider-initial',
  icon: '',
  label: '__divider__',
  iconSet: 'none',
});

rawOptions.forEach((item, index) => {
  profileOptions.push(item);
  const isLast = index === rawOptions.length - 1;
  const isLogOut = item.label === 'Log Out';

  if ((index + 1) % 2 === 0 && !isLogOut) {
    profileOptions.push({
      id: `divider-${index}`,
      icon: '',
      label: '__divider__',
      iconSet: 'none',
    });
  }

  if (isLogOut) {
    profileOptions.push({
      id: `divider-logout`,
      icon: '',
      label: '__divider__',
      iconSet: 'none',
    });
  }
});

const getIcon = (item: ProfileOption) => {
  switch (item.iconSet) {
    case 'Feather':
      return <Feather name={item.icon as any} size={22} color="#ff7900" />;
    case 'Ionicons':
      return <Ionicons name={item.icon as any} size={22} color="#ff7900" />;
    case 'MaterialIcons':
      return <MaterialIcons name={item.icon as any} size={22} color="#ff7900" />;
    case 'Entypo':
      return <Entypo name={item.icon as any} size={22} color="#ff7900" />;
    default:
      return null;
  }
};


const router = useRouter();






const Profile = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleOptionPress = async (item: ProfileOption) => {
  if (isNavigating) return; // prevent multiple taps
  setIsNavigating(true); // lock further taps temporarily

  switch (item.label) {
    case 'Help':
      router.push('/user/components/ui/help');
      break;

    case 'Log Out':
      await AsyncStorage.setItem('isLoggedIn', 'false');
      handleLogout();
      break;

    case 'Language':
      router.push('/user/components/ui/language');
      break;

    default:
      // handle other options if needed
      break;
  }

  // Reset navigation lock after short delay (to avoid spamming)
  setTimeout(() => setIsNavigating(false), 1000);
};

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<ProfileOption>) => {
    if (item.label === '__divider__') {
      return <View key={item.id} style={styles.divider} />;
    }

    return (
      <TouchableOpacity key={item.id} style={styles.optionRow} onPress={() => handleOptionPress(item)}>
        {getIcon(item)}
        <Text style={styles.optionText}>{item.label}</Text>
        <Feather
          name="chevron-right"
          size={20}
          color="#999"
          style={{ marginLeft: 'auto' }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require('../../assets/images/icon.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
            <Feather name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>Vinay Kumar</Text>
          <Text style={styles.email}>+91 7839069978</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingBottom: 10 }}>
  {profileOptions.map((item) => (
    <React.Fragment key={item.id}>
      {renderItem({ item })}
    </React.Fragment>
  ))}
</View>


      <Text style={styles.footer}>App Version 1.0</Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf5',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 1,
  },
  imageWrapper: {
    position: 'relative',
    marginLeft: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffcc99',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ff7900',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 65,
  },
  email: {
    fontSize: 15,
    color: '#666',
    marginVertical: 3,
    marginLeft: 60,
  },
  editButton: {
    backgroundColor: '#ff7900',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: 65,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 15,
    marginLeft: 15,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#fcd9b6',
    marginVertical: 6,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#aaa',
    marginTop: 1,
    marginBottom: 95,
  },
});
