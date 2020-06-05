export default interface ISlugTransformationProvider {
  transform(input: string): Promise<string>;
}
