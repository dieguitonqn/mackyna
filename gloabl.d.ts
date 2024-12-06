declare global {
    interface Window {
      javascriptCallback?: (token: string) => void;
    }
  }