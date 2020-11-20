import IAddCartToProvider from '../dtos/IAddCartToProvider';
import IAddCustomerToProvider from '../dtos/IAddCustomerToProvider';
import IAddProductToProvider from '../dtos/IAddProductToProvider';
import IMailMarketingCart from '../dtos/IMailMarketingCart';
import IMailMarketingCustomer from '../dtos/IMailMarketingCustomer';
import IMailMarketingProduct from '../dtos/IMailMarketingProduct';

export default interface IMailMarketingProvider {
  listCarts(): Promise<IMailMarketingCart[]>;
  addCart(data: IAddCartToProvider): Promise<IMailMarketingCart>;
  listProducts(): Promise<IMailMarketingProduct[]>;
  addProduct(data: IAddProductToProvider): Promise<IMailMarketingProduct>;
  listCustomers(): Promise<IMailMarketingCustomer[]>;
  addCustomer(data: IAddCustomerToProvider): Promise<IMailMarketingCustomer>;
}
