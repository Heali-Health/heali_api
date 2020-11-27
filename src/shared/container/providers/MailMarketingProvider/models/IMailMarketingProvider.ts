import IAddCartToProvider from '../dtos/IAddCartToProvider';
import IAddCustomerToProvider from '../dtos/IAddCustomerToProvider';
import IAddOrderTOProvider from '../dtos/IAddOrderToProvider';
import IAddProductToProvider from '../dtos/IAddProductToProvider';
import IMailMarketingCart from '../dtos/IMailMarketingCart';
import IMailMarketingCustomer from '../dtos/IMailMarketingCustomer';
import IMailMarketingOrder from '../dtos/IMailMarketingOrder';
import IMailMarketingProduct from '../dtos/IMailMarketingProduct';

export default interface IMailMarketingProvider {
  listCarts(): Promise<IMailMarketingCart[]>;
  addCart(data: IAddCartToProvider): Promise<IMailMarketingCart>;
  deleteCart(cartId: string): Promise<void>;
  listProducts(): Promise<IMailMarketingProduct[]>;
  addProduct(data: IAddProductToProvider): Promise<IMailMarketingProduct>;
  getProductInfo(productId: string): Promise<IMailMarketingProduct | undefined>;
  listCustomers(): Promise<IMailMarketingCustomer[]>;
  addCustomer(data: IAddCustomerToProvider): Promise<IMailMarketingCustomer>;
  listOrders(): Promise<IMailMarketingOrder[]>;
  addOrder(data: IAddOrderTOProvider): Promise<IMailMarketingOrder>;
}
