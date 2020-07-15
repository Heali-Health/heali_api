export default interface ICdCLabInfoDetailDTO {
  id: number;
  tradingName: string;
  slugName: string;
  howToGet: string;
  openingHours: string;
  collectionHours: string;
  contactDescription: string;
  latitude: number;
  longitude: number;
  googleMapsLink: string;
  address: {
    zipCode: string;
    address: string;
    neighborhood: string;
    addressNumber: string;
    additionalAddress: string;
  };
}
