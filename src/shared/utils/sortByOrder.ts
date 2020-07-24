export default function sortByOrder(a, b): number {
  // a should come before b in the sorted order
  if (a.order < b.order) {
    return -1;
    // a should come after b in the sorted order
  }
  if (a.order > b.order) {
    return 1;
    // a and b are the same
  }
  return 0;
}
