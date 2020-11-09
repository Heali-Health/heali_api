import ILabResultsDTO from '@modules/exams/dtos/ILabResultsDTO';

export default function sortByRecommended(
  a: ILabResultsDTO,
  b: ILabResultsDTO,
): number {
  if (a.exams_found === b.exams_found) {
    // Price is only important when cities are the same
    return a.distance > b.distance ? 1 : -1;
  }
  return a.exams_found < b.exams_found ? 1 : -1;
}
