declare module '*.png' {
  export default '' as string;
}

declare module '*.mp3' {
  export default '' as string;
}

interface FormDataValue {
  uri: string;
  name: string;
  type: string;
}

interface FormData {
  append(name: string, value: string | FormDataValue, fileName?: string): void;
  set(name: string, value: string | FormDataValue, fileName?: string): void;
}
