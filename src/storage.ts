import { storageFactory } from "storage-factory";
import { safeStringify } from '@yehonadav/safestringify'

export const local = storageFactory(() => localStorage);
export const session = storageFactory(() => sessionStorage);

export const getStorage = <T=Record<string, any>>(storage:Storage):T => {
  const result:any = {};

  Object.keys(storage).forEach(k => {
    const value = storage.getItem(k);
    result[k] = value ? JSON.parse(value) : value;
  })

  return result
}

export const setStorageItem = <T=any>(storage:Storage, uuid: string, data: T):void => {storage.setItem(uuid, safeStringify({data}))};

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

  constructor(storage:Storage) {
    this.storage = storage;
    this.clear = storage.clear;
  }

  getItems <T=Record<string, any>>():T {
    return getStorage(this.storage);
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

export const persistLocal = new StorageHandler(local);
export const persistSession = new StorageHandler(session);