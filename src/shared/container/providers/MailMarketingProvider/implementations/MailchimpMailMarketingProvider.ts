import axios from 'axios';
import IAddCartToProvider from '../dtos/IAddCartToProvider';
import IAddCustomerToProvider from '../dtos/IAddCustomerToProvider';
import IAddOrderTOProvider from '../dtos/IAddOrderToProvider';
import IAddProductToProvider from '../dtos/IAddProductToProvider';
import IMailMarketingCart from '../dtos/IMailMarketingCart';
import IMailMarketingCustomer from '../dtos/IMailMarketingCustomer';
import IMailMarketingOrder from '../dtos/IMailMarketingOrder';
import IMailMarketingProduct from '../dtos/IMailMarketingProduct';
import IMailMarketingProvider from '../models/IMailMarketingProvider';

export default class MailchimpMailMarketingProvider
  implements IMailMarketingProvider {
  private store_id = process.env.MAILCHIMP_STORE || 'heali';

  private apiKey = process.env.MAILCHIMP_APIKEY || 'api-key';

  private server = process.env.MAILCHIMP_SERVER || 'us2';

  private mailchimp = axios.create({
    baseURL: ` https://${this.server}.api.mailchimp.com/3.0`,
    auth: {
      username: 'any',
      password: this.apiKey,
    },
  });

  private mailchimpEcommerceClient = axios.create({
    baseURL: ` https://${this.server}.api.mailchimp.com/3.0/ecommerce/stores/${this.store_id}`,
    auth: {
      username: 'any',
      password: this.apiKey,
    },
  });

  public async addCustomer(
    data: IAddCustomerToProvider,
  ): Promise<IMailMarketingCustomer> {
    const { data: customer } = await this.mailchimpEcommerceClient.post<
      IMailMarketingCustomer
    >('/customers', data);

    return customer;
  }

  public async listCustomers(): Promise<IMailMarketingCustomer[]> {
    const { data: customers } = await this.mailchimpEcommerceClient.get<
      IMailMarketingCustomer[]
    >('/customers');

    return customers;
  }

  public async addProduct(
    data: IAddProductToProvider,
  ): Promise<IMailMarketingProduct> {
    const { data: product } = await this.mailchimpEcommerceClient.post<
      IMailMarketingProduct
    >('/products', data);

    return product;
  }

  public async listProducts(): Promise<IMailMarketingProduct[]> {
    const { data: products } = await this.mailchimpEcommerceClient.get<
      IMailMarketingProduct[]
    >('/products');

    return products;
  }

  public async getProductInfo(
    productId: string,
  ): Promise<IMailMarketingProduct | undefined> {
    const { data: product } = await this.mailchimpEcommerceClient.get<
      IMailMarketingProduct
    >(`/products/${productId}`);

    if (!product.id) {
      return undefined;
    }

    return product;
  }

  public async addCart(data: IAddCartToProvider): Promise<IMailMarketingCart> {
    const { data: cart } = await this.mailchimpEcommerceClient.post<
      IMailMarketingCart
    >('/carts', data);

    return cart;
  }

  public async listCarts(): Promise<IMailMarketingCart[]> {
    const { data: carts } = await this.mailchimpEcommerceClient.get<
      IMailMarketingCart[]
    >('/carts');

    return carts;
  }

  public async addOrder(
    data: IAddOrderTOProvider,
  ): Promise<IMailMarketingOrder> {
    const { data: order } = await this.mailchimpEcommerceClient.post<
      IMailMarketingOrder
    >('/orders', data);

    return order;
  }

  public async listOrders(): Promise<IMailMarketingOrder[]> {
    const { data: orders } = await this.mailchimpEcommerceClient.get<
      IMailMarketingOrder[]
    >('/orders');

    return orders;
  }
}
