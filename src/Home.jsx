import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { firebase } from "../config";
import { fetchLocation } from "./utils/locations";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { storageLoad, storageSave } from "./utils/asyncStorage";
import moment from "moment";
import Loading from "./Loading";
import CustomError from "./utils/errorHandler";

moment.locale("en");

export default App = () => {
  const deviceRef = firebase.firestore().collection("devices");
  const [deviceName, setDeviceName] = useState("");
  const [myDeviceId, setMyDeviceId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "-",
    longitude: "-",
  });
  const [oldLocation, setOldLocation] = useState({
    latitude: "-",
    longitude: "-",
  });
  const [intervalId, setIntervalId] = useState(null);
  const [timeActive, setTimeActive] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loadDeviceID = async () => {
    setIsLoading(true);
    const myUuid = await storageLoad();
    if (typeof myUuid === "string") {
      setMyDeviceId(myUuid);
    } else {
      const uuid = uuidv4();
      setMyDeviceId(uuid);
      storageSave(uuid);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadDeviceID();
  }, []);

  useEffect(() => {
    if (
      isLoading &&
      currentLocation.latitude !== "-" &&
      currentLocation.longitude !== "-"
    ) {
      setIsLoading(false);
    }
  }, [isLoading, currentLocation.latitude, currentLocation.longitude]);

  const startHandler = async () => {
    try {
      setIsLoading(true);
      if (!deviceName) {
        throw CustomError({
          header: "Device Name is require.",
          body: "Please input Device Name.",
          action: [
            {
              text: "Close",
              onPress: () => console.log("Close Pressed"),
              style: "destructive",
            },
          ],
        });
      }

      const findMyDevice = await deviceRef
        .where("deviceId", "==", myDeviceId)
        .get();

      if (findMyDevice.empty) {
        await addNewLocation();
      } else {
        await updateLocation();
      }

      const interval = setInterval(async () => {
        const { latitude, longitude } = await fetchLocation();
        setCurrentLocation({
          latitude,
          longitude,
        });
      }, Number(process.env.EXPO_PUBLIC_MILLISECONDS));

      setIntervalId(interval);
      setIsActive(!isActive);
      setTimeActive(new Date());
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        error?.header || "Failed.",
        error?.body || "Share Location.",
        [
          {
            text: "Close",
            onPress: () => console.log(error),
            style: "destructive",
          },
        ]
      );
    }
  };

  const pauseHandler = () => {
    updateActive();
    setTimeActive(new Date());
  };

  useEffect(() => {
    if (
      isActive &&
      (currentLocation?.latitude !== oldLocation?.latitude ||
        currentLocation?.longitude !== oldLocation?.longitude)
    ) {
      updateLocation(myDeviceId);
    }
    return () => {
      setOldLocation({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });
    };
  }, [currentLocation.latitude, currentLocation.longitude]);

  const addNewLocation = async () => {
    try {
      const deviceNameAlreadyUsed = await deviceRef
        .where("deviceName", "==", deviceName)
        .get();

      if (!deviceNameAlreadyUsed.empty) {
        throw CustomError({
          header: "Already Used Device Name.",
          body: "Please input New Device Name.",
        });
      }

      const { latitude, longitude } = await fetchLocation();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        deviceId: myDeviceId,
        deviceName: deviceName,
        deviceType: Platform.OS,
        latitude: latitude,
        longitude: longitude,
        isActive: true,
        createAt: timestamp,
        updateAt: timestamp,
      };

      await deviceRef.add(data);
      Alert.alert("Success", "Share Location", [
        {
          text: "Close",
          onPress: () => console.log("Close Pressed"),
          style: "destructive",
        },
      ]);
      Keyboard.dismiss();
    } catch (error) {
      throw error;
    }
  };

  const updateLocation = async () => {
    try {
      const currentDevice = await deviceRef
        .where("deviceId", "==", myDeviceId)
        .get();
      if (!currentDevice.empty) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const deviceNameAlreadyUsed = await deviceRef
          .where("deviceName", "==", deviceName)
          .get();

        if (
          !deviceNameAlreadyUsed.empty &&
          deviceNameAlreadyUsed.docs[0]?.id !== currentDevice.docs[0]?.id
        ) {
          throw CustomError({
            header: "Already Used Device Name.",
            body: "Please input New Device Name.",
          });
        }

        await deviceRef.doc(currentDevice.docs[0].id).update({
          ...currentDevice.docs[0].data(),
          deviceName: deviceName,
          isActive: true,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          updateAt: timestamp,
        });
      }
    } catch (error) {
      throw error;
    }
  };

  const updateActive = async () => {
    try {
      const currentDevice = await deviceRef
        .where("deviceId", "==", myDeviceId)
        .get();
      if (!currentDevice.empty) {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        await deviceRef.doc(currentDevice.docs[0].id).update({
          ...currentDevice.docs[0].data(),
          isActive: false,
          updateAt: timestamp,
        });
      }
      clearInterval(intervalId);
      setIsActive(!isActive);
    } catch (error) {
      throw error;
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-[#D9D9D9]">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {isLoading ? (
          <Loading />
        ) : (
          <View>
            <View className="h-[50%] justify-end items-center">
              <TouchableOpacity
                onPress={isActive ? pauseHandler : startHandler}
                disabled={isLoading}
                className="rounded-[50] w-[70%] bg-white py-5"
              >
                <Text className="text-center font-semibold">
                  {isLoading
                    ? "...Loading Location"
                    : isActive
                    ? "Stop Sharing your location"
                    : "Share your location"}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="h-[35%] justify-center items-center">
              <View className="w-[70%]">
                <Text className="text-center font-semibold text-base mb-2">
                  Usage summary
                </Text>
                <Text className="font-medium text-sm">
                  {isActive ? "Active since" : "Inactive at "}
                </Text>
                <Text className="font-medium text-sm">
                  Date :
                  {timeActive ? moment(timeActive).format("DD MMMM YYYY") : "-"}
                </Text>
                <Text className="font-medium text-sm">
                  Time :{timeActive ? moment(timeActive).format("HH:mm") : "-"}
                </Text>
                {console.log("======+>>>", currentLocation)}
                <Text className="font-medium text-sm">
                  latitude : {currentLocation.latitude}
                </Text>
                <Text className="font-medium text-sm">
                  longitude : {currentLocation.longitude}
                </Text>
              </View>
            </View>
            <View className="h-[15%] px-10 bg-[#3A3A3A] justify-center">
              <Text className="font-bold mb-2">Display Name :</Text>
              {isActive ? (
                <Text className="font-bold mb-2">{deviceName}</Text>
              ) : (
                <TextInput
                  className="border-2 border-[#D9D9D9] py-2 px-2 rounded-md bg-white"
                  placeholder="Display Name"
                  placeholderTextColor="#aaaaaa"
                  onChangeText={(value) => setDeviceName(value)}
                  value={deviceName}
                  underlineColorAndroid="transparent"
                  autoCapitalize="none"
                />
              )}
            </View>
          </View>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
