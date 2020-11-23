export default interface IAddProductToProvider {
  id: string;
  title: string;
  variants: {
    id: string;
    title: string;
    url?: string;
    price?: number;
  }[];
  url?: string;
  description?: string;
}
