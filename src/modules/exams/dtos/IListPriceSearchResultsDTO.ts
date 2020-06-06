export default interface IListPriceSearchResultsDTO {
  exams_ids: string[];
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}
