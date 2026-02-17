
export interface MessageSuggestion {
  id: string;
  text: string;
  label: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  READY = 'READY'
}
