import { isFunction } from "lodash-es";
import { ref, watch } from "vue";

const guessSerializerType = (rawInit) => {
  return rawInit == null
    ? "any"
    : rawInit instanceof Set
    ? "set"
    : rawInit instanceof Map
    ? "map"
    : rawInit instanceof Date
    ? "date"
    : typeof rawInit === "boolean"
    ? "boolean"
    : typeof rawInit === "string"
    ? "string"
    : typeof rawInit === "object"
    ? "object"
    : !Number.isNaN(rawInit)
    ? "number"
    : "any";
};

const StorageSerializers = {
  boolean: {
    read: (value) => value === "true",
    write: (value) => String(value),
  },
  object: {
    read: (value) => JSON.parse(value),
    write: (value) => JSON.stringify(value),
  },
  number: {
    read: (value) => Number.parseFloat(value),
    write: (value) => String(value),
  },
  any: {
    read: (value) => value,
    write: (value) => String(value),
  },
  string: {
    read: (value) => value,
    write: (value) => String(value),
  },
  map: {
    read: (value) => new Map(JSON.parse(value)),
    write: (value) => JSON.stringify(Array.from(value.entries())),
  },
  set: {
    read: (value) => new Set(JSON.parse(value)),
    write: (value) => JSON.stringify(Array.from(value)),
  },
  date: {
    read: (value) => new Date(value),
    write: (value) => value.toISOString(),
  },
};

export function useLocalStorage(key, defaultValue, options) {
  const storage = window.localStorage;
  const type = guessSerializerType(defaultValue);
  const serializer = StorageSerializers[type];

  const read = () => {
    const v = storage.getItem(key);
    if (!v) return null;
    if (isFunction(options?.deserializer)) return options.deserializer(v);
    return serializer.read(v);
  };

  const value = ref(read() ?? defaultValue);

  const write = (v) => {
    let _v;
    if (isFunction(options?.serializer)) {
      _v = options.serializer(v);
    } else {
      _v = serializer.write(v);
    }
    storage.setItem(key, _v);
  };

  watch(
    value,
    () => {
      write(value.value);
    },
    { immediate: true, deep: true }
  );

  return value;
}

export default useLocalStorage;
