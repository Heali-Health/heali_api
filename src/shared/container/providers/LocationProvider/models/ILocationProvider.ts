export default interface ILocationProvider {
  getLocationDetails(input: string): Promise<void>;
}
