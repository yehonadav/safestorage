# safestorage

Safe implementation for localStorage and sessionStorage.  
Fallback to in-memory implementation if default browser implementations aren't available. 


## install

```
npm i @yehonadav/safestorage
```

## usage

```typescript
import {persistLocal} from "safesstorage"

// set items
persistLocal.setItem('book', {name:"Book", author:"John Blue"});

// get items
const book = persistLocal.getItem<string>('name');
console.log(book);

// delete items
persistLocal.delItem('name');

// safely get items
const {value, error} = persistLocal.tryToGetItem<string>('name');
console.log({value, error});
```

enjoy =)  
