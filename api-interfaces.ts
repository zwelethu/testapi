export interface EndpointState {
  url: string | null;
  num_tries: number;
  num_calls: number;
}

export interface AppCache {
  postId: number | null | undefined;
  id: number | null | undefined;
  name: string | null | undefined;
  email: string | null | undefined;
  body: string | null | undefined;
}
