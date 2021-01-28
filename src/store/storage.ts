import AsyncStorage from '@react-native-community/async-storage';

const storage = {
  async getItem(key: string) {
    const res = await AsyncStorage.getItem(key);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return res ? JSON.parse(res) : res;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async setItem(key: string, data: any) {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  },
  async removeItem(key: string) {
    await AsyncStorage.removeItem(key);
  },
};

export default storage;
