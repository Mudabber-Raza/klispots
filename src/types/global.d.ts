declare global {
  interface Window {
    vercelAnalyticsInitialized?: boolean;
    va?: (action: string, event: string, data?: any) => void;
  }
}

export {};
