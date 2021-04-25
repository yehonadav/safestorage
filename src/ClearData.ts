import {local, session, getStorage} from './storage';

export type ExcludedItemsType = {[x:string]:any};

export const excludedLocalStorageItemKeys:string[] = [];

export const excludeLocalStorageItem = (key:string):void => {
  excludedLocalStorageItemKeys.push(key);
};

export const getExcludedLocalStorageItems = ():ExcludedItemsType => {
  const items:ExcludedItemsType = {};
  excludedLocalStorageItemKeys.forEach(key => {
    try {
      const item = local.getItem(key);
      if (typeof item === "string")
        items[key] = item;
    }
    catch (e) {
      console.error(`getExcludeLocalStorageItems failed to get ${key}`, e)
    }
  });
  return items;
};

export const setExcludedLocalStorageItemsAfterClear = (items:ExcludedItemsType):void => {
  Object.keys(items).forEach(key => {
    local.setItem(key, items[key]);
  });
};

export const clearCachedData = async ():Promise<void> => {
  const excludedLocalStorageItems = getExcludedLocalStorageItems();

  console.log({
    clearCachedData: {
      getExcludedLocalStorageItems: {
        type: 'info',
        message: "get excluded items before clearing data",
        data: excludedLocalStorageItems,
      }
    }
  });

  session.clear();

  local.clear();

  console.log({
    clearCachedData: {
      type: 'info',
      message: "cleared session & local storage",
      data: {
        session: getStorage(session),
        local: getStorage(local),
      },
    }
  });

  // early re-set excluded items before clearing data finish, to handle sudden abruption
  setExcludedLocalStorageItemsAfterClear(excludedLocalStorageItems);

  // https://github.com/shadowwalker/next-pwa/issues/50
  // logout from PWA - not sure this is needed if revoke works
  if ('serviceWorker' in navigator) {
    try {
      const cacheNames = await caches.keys();
      cacheNames.forEach(function(cacheName) {
        caches.delete(cacheName);
      });

      console.log({
        clearCachedData: {
          type: 'info',
          message: "cleared caches",
        }
      });
    }
    catch (e) {
      console.error({
        clearCachedData: {
          type: 'info',
          message: `clearCachedData failed to delete cacheNames: ${e}`,
        }
      });
    }
  }

  console.log({
    clearCachedData: {
      type: 'info',
      message: "all cached data has been removed",
    }
  });

  // re-set excluded items after clearing data
  setExcludedLocalStorageItemsAfterClear(excludedLocalStorageItems);

  console.log({
    clearCachedData: {
      setExcludedLocalStorageItemsAfterClear: {
        type: 'info',
        message: "re-set excluded items after clearing data success",
        data: excludedLocalStorageItems,
      }
    }
  });
};

export const clearDataService = {
  excludeLocalStorageItem,
  clearCachedData,
};