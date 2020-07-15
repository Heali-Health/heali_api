export default interface ICdCLabInfoDTO {
  id: number;
  tradingName: string;
  slugName: string;
  address: {
    zipCode: string;
    address: string;
    neighborhood: string;
    addressNumber: string;
    additionalAddress: string;
  };
}
