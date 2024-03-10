import * as Location from "expo-location";

const fetchLocation = async () => {
  await Location.requestForegroundPermissionsAsync();

  const {
    coords: { latitude, longitude },
  } = await Location.getCurrentPositionAsync();
  return { latitude, longitude };
};

export { fetchLocation };
