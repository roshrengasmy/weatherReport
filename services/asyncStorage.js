import AsyncStorage from '@react-native-async-storage/async-storage';

export const setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log('Error in storing value', error);
  }
};

export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value;
  } catch (error) {
    console.log('Error in getting value', error);
  }
};
