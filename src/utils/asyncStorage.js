import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

const storageSave = (data) => {
  storage.save({
    key: "uuid", // Note: Do not use underscore("_") in key!
    data,
    expires: null,
  });
};

const storageLoad = async () => {
  try {
    const uuidStorage = await storage.load({
      key: "uuid",
      autoSync: true,
      syncInBackground: true,
      syncParams: {
        someFlag: true,
      },
    });
    return uuidStorage;
  } catch {
    (err) => {
      // any exception including data not found
      // goes to catch()
      console.warn(err.message);
      switch (err.name) {
        case "NotFoundError":
          // TODO;
          break;
        case "ExpiredError":
          // TODO
          break;
      }
    };
  }
};

const storageRemove = () => {
  storage.remove({ key: "uuid" });
};

export { storageSave, storageLoad, storageRemove };
