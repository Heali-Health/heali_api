export default function sortByDistance(a, b): number {
  // a should come before b in the sorted order
  if (a.distance < b.distance) {
    return -1;
    // a should come after b in the sorted distance
  }
  if (a.distance > b.distance) {
    return 1;
    // a and b are the same
  }
  return 0;
}
