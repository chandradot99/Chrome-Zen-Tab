// Chrome Extension API types
declare namespace chrome {
  export namespace runtime {
    export const id: string;
    export function sendMessage(
      message: any,
      callback?: (response: any) => void
    ): void;
    export const onMessage: {
      addListener(
        callback: (
          message: any,
          sender: any,
          sendResponse: (response: any) => void
        ) => void
      ): void;
    };
    export function getURL(path: string): string;
  }

  export namespace tabs {
    export interface Tab {
      id?: number;
      url?: string;
      title?: string;
      active?: boolean;
      windowId?: number;
    }

    export function query(
      queryInfo: any,
      callback: (tabs: Tab[]) => void
    ): void;
    export function create(
      createProperties: any,
      callback?: (tab: Tab) => void
    ): void;
  }

  export namespace storage {
    export namespace sync {
      export function get(
        keys: string | string[] | null,
        callback: (items: any) => void
      ): void;
      export function set(items: any, callback?: () => void): void;
    }
  }

  export namespace action {
    export function setBadgeText(details: {
      text: string;
      tabId?: number;
    }): void;
    export function setBadgeBackgroundColor(details: {
      color: string;
      tabId?: number;
    }): void;
  }

  export namespace notifications {
    export interface NotificationOptions {
      type: string;
      iconUrl: string;
      title: string;
      message: string;
      buttons?: Array<{ title: string }>;
    }

    export function create(
      notificationId: string,
      options: NotificationOptions,
      callback?: (notificationId: string) => void
    ): void;

    export function clear(
      notificationId: string,
      callback?: (wasCleared: boolean) => void
    ): void;

    export const onClicked: {
      addListener(callback: (notificationId: string) => void): void;
    };

    export const onButtonClicked: {
      addListener(
        callback: (notificationId: string, buttonIndex: number) => void
      ): void;
    };
  }
}

// Process environment for webpack DefinePlugin
declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

// Make chrome available globally
declare const chrome: typeof chrome;
