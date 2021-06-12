import { storageFactory } from "storage-factory";
import { stringify } from '@yehonadav/safestringify'

export const getStorageItems = (storage:Storage):Record<string, any> => {
  const result:Record<string, any> = {};

  for (let i = 0, len = storage.length; i < len; ++i ) {
    try {
      const k = storage.key(i);

      if (k === null)
        continue;

      const value = storage.getItem(k);
      result[k] = value ? JSON.parse(value) : value;
    }
    catch (e) {
      console.error({getStorageItemsError: e});
    }
  }

  return result
}

export const setStorageItem = <T=any>(storage:Storage, uuid: string, data: T):void => {storage.setItem(uuid, stringify({data}))};

export const getStorageItem = <T=any>(storage:Storage, uuid: string):T => {
  const value = storage.getItem(uuid);

  if (value === null)
    throw Error(`getStorageItemValueError: storage.getItem('${uuid}') did not return a value`);

  return JSON.parse(value).data
};

export const tryToGetStorageItem = <T=any>(storage:Storage, uuid: string):{value?: T, error?: Error} => {
  try {
    return {value: getStorageItem<T>(storage, uuid)};
  }
  catch (error) {
    return {error}
  }
};

export const delStorageItem = (storage:Storage, uuid: string):void => {
  // eslint-disable-next-line no-empty
  try{storage.removeItem(uuid)}catch(e){}
};

export class StorageHandler {
  storage: Storage;
  clear: () => void;

  constructor(getStorage: () => Storage) {
    this.storage = storageFactory(getStorage);
    this.clear = this.storage.clear;
  }

  getItems <T=Record<string, any>>():T {
    return getStorageItems(this.storage) as T;
  }

  setItem (uuid: string, data: any):void {
    setStorageItem(this.storage, uuid, data);
  }

  getItem <T=any>(uuid: string):T {
    return getStorageItem<T>(this.storage, uuid)
  }

  tryToGetItem <T=any>(uuid: string):{value?: T, error?: Error} {
    return tryToGetStorageItem<T>(this.storage, uuid);
  }

  delItem (uuid: string):void {
    delStorageItem(this.storage, uuid)
  }
}

export const persistLocal = new StorageHandler(() => localStorage);
export const persistSession = new StorageHandler(() => sessionStorage);

export const local = persistLocal.storage;
export const session = persistSession.storage;
