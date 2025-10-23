export default function useAuth(token) {
  if (token !== null) {
    return true;
  }
  return false;
}
