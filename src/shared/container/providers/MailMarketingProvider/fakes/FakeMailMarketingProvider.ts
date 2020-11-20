import IAddCartToProvider from '../dtos/IAddCartToProvider';
import IAddCustomerToProvider from '../dtos/IAddCustomerToProvider';
import IAddProductToProvider from '../dtos/IAddProductToProvider';
import IMailMarketingCart from '../dtos/IMailMarketingCart';
import IMailMarketingCustomer from '../dtos/IMailMarketingCustomer';
import IMailMarketingProduct from '../dtos/IMailMarketingProduct';
import IMailMarketingProvider from '../models/IMailMarketingProvider';

export default class FakeMailMarketingProvider
  implements IMailMarketingProvider {
  private carts: IMailMarketingCart[] = [];

  private customers: IMailMarketingCustomer[] = [];

  private products: IMailMarketingProduct[] = [];

  public async listCarts(): Promise<IMailMarketingCart[]> {
    return this.carts;
  }

  public async listCustomers(): Promise<IMailMarketingCustomer[]> {
    return this.customers;
  }

  public async listProducts(): Promise<IMailMarketingProduct[]> {
    return this.products;
  }

  public async addCart(data: IAddCartToProvider): Promise<IMailMarketingCart> {
    const cart = {
      id: data.id,
      campaign_id: data.campaign_id || '',
      customer: {
        id: data.customer.id,
        email_address: 'customer@example.com',
        first_name: 'John',
        last_name: 'Doe',
        opt_in_status: true,
      },
      checkout_url: data.checkout_url,
      lines: data.lines.map(line => ({
        id: line.id,
        product_id: line.product_id,
        product_title: 'product_title',
        product_variant_title: 'product_variant_title',
        product_variant_id: line.product_variant_id,
        quantity: line.quantity,
        price: line.price,
      })),
      currency_code: data.currency_code,
      order_total: data.order_total,
      tax_total: data.tax_total || 0,
      created_at: 'now',
      updated_at: 'now',
    };

    this.carts.push(cart);

    return cart;
  }

  public async addCustomer(
    data: IAddCustomerToProvider,
  ): Promise<IMailMarketingCustomer> {
    const customer: IAddCustomerToProvider = {
      id: data.id,
      first_name: data.first_name || 'John',
      last_name: data.last_name || 'Doe',
      email_address: data.email_address,
      opt_in_status: data.opt_in_status,
    };

    this.customers.push(customer);

    return customer;
  }

  public async addProduct(
    data: IAddProductToProvider,
  ): Promise<IMailMarketingProduct> {
    const product: IAddProductToProvider = {
      id: data.id,
      title: data.title,
      variants: [
        {
          id: data.id,
          title: data.title,
        },
      ],
    };

    this.products.push(product);

    return product;
  }
}
