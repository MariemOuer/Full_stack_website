export function checkIfCurrentUserIsGuest(currentUser) {
  return currentUser?.email?.toLowerCase() === "guest@gmail.com";
}
