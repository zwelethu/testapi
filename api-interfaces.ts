export interface TResponse {
  error?: string;
  status: number;
  data: TData;
  success: true;
}

export interface TResponseError {
  status: number;
  error: string | null;
  success: false;
}

export interface TData {
  zar: number | null;
  usd: number | null;
}
