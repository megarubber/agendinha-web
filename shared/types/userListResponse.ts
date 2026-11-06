export default interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}