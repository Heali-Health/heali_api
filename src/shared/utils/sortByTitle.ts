export default function sortByTitle(a: any, b: any): number {
  // a should come before b in the sorted title
  if (a.title < b.title) {
    return -1;
    // a should come after b in the sorted title
  }
  if (a.title > b.title) {
    return 1;
    // a and b are the same
  }
  return 0;
}
