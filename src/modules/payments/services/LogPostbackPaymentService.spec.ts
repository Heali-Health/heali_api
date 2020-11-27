import User from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import { IPagarmeLog } from '../dtos/ICreatePaymentLogDTO';
import ICreatePaymentPostbackDTO from '../dtos/ICreatePaymentPostbackDTO';
import FakePaymentsRepository from '../repositories/fakes/FakePaymentsRepository';
import FakePostbacksPaymentsRepository from '../repositories/fakes/FakePostbacksPaymentsRepository';
import FakeUserCardsRepository from '../repositories/fakes/FakeUserCardsRepository';
import LogPostbackPaymentService from './LogPostbackPaymentService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserCardsRepository: FakeUserCardsRepository;
let fakePostbacksPaymentsRepository: FakePostbacksPaymentsRepository;
let fakePaymentsRepository: FakePaymentsRepository;
let logPostbackPayment: LogPostbackPaymentService;

let user: User;
let payment: IPagarmeLog;
let postbackPayment: ICreatePaymentPostbackDTO;

describe('PostbackPayment', () => {
  beforeEach(async () => {
    fakePaymentsRepository = new FakePaymentsRepository();
    fakePostbacksPaymentsRepository = new FakePostbacksPaymentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserCardsRepository = new FakeUserCardsRepository();
    logPostbackPayment = new LogPostbackPaymentService(
      fakePostbacksPaymentsRepository,
      fakeUsersRepository,
      fakePaymentsRepository,
      fakeUserCardsRepository,
    );

    user = await fakeUsersRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'hard-to-discover-password',
    });

    payment = {
      object: 'transaction',
      status: 'paid',
      status_reason: 'acquirer',
      acquirer_response_code: '0000',
      acquirer_name: 'pagarme',
      acquirer_id: '5969170917bce0470c8bf099',
      authorization_code: '65208',
      tid: 1830855,
      nsu: 1830855,
      date_created: '2017-08-14T20:35:46.046Z',
      date_updated: '2017-08-14T20:35:46.455Z',
      amount: 10000,
      authorized_amount: 10000,
      paid_amount: 10000,
      refunded_amount: 0,
      installments: 1,
      id: 1830855,
      cost: 50,
      card_holder_name: 'Morpheus Fishburne',
      card_last_digits: '1111',
      card_first_digits: '411111',
      card_brand: 'visa',
      payment_method: 'credit_card',
      boleto_barcode: null,
      boleto_expiration_date: null,
      boleto_url: null,
      capture_method: 'ecommerce',
      referer: 'api_key',
      ip: '10.2.11.17',
      customer: {
        object: 'customer',
        id: 233238,
        external_id: '#3311',
        type: 'individual',
        country: 'br',
        document_type: 'cpf',
        name: 'Morpheus Fishburne',
        email: 'mopheus@nabucodonozor.com',
        phone_numbers: ['+5511999998888', '+5511888889999'],
        birthday: '1965-01-01',
        date_created: '2017-08-14T20:35:45.963Z',
        documents: [
          {
            object: 'document',
            id: 'doc_cj6cmcm2l01z5696dyamemdnf',
            type: 'cpf',
            number: '30621143049',
          },
        ],
      },
      billing: {
        address: {
          object: 'address',
          street: 'Rua Matrix',
          street_number: '9999',
          neighborhood: 'Rio Cotia',
          city: 'Cotia',
          state: 'sp',
          zipcode: '06714360',
          country: 'br',
          id: 145818,
        },
        object: 'billing',
        id: 30,
        name: 'Trinity Moss',
      },
      shipping: {
        address: {
          object: 'address',
          street: 'Rua Matrix',
          street_number: '9999',
          neighborhood: 'Rio Cotia',
          city: 'Cotia',
          state: 'sp',
          zipcode: '06714360',
          country: 'br',
          id: 145819,
        },
        object: 'shipping',
        id: 25,
        name: 'Neo Reeves',
        fee: 1000,
        delivery_date: '2000-12-21',
        expedited: true,
      },
      items: [
        {
          object: 'item',
          id: 'r123',
          title: 'Red pill',
          unit_price: 10000,
          quantity: 1,
          tangible: true,
        },
        {
          object: 'item',
          id: 'b123',
          title: 'Blue pill',
          unit_price: 10000,
          quantity: 1,
          tangible: true,
        },
      ],
      card: {
        object: 'card',
        id: 'card_cj6cmcm4301z6696dt3wypskk',
        date_created: new Date(),
        date_updated: new Date(),
        brand: 'visa',
        holder_name: 'Morpheus Fishburne',
        first_digits: '411111',
        last_digits: '1111',
        country: 'UNITED STATES',
        fingerprint: '3ace8040fba3f5c3a0690ea7964ea87d97123437',
        valid: true,
        expiration_date: '0922',
      },
      metadata: {},
      antifraud_metadata: {},
    };

    await fakePaymentsRepository.create(payment, user, '123', '123');

    postbackPayment = {
      id: '1830855',
      fingerprint: 'e5b418bc68bc9169d3270a3a2acb65859ef3711d',
      event: 'transaction_status_changed',
      old_status: 'waiting_payment',
      desired_status: 'paid',
      current_status: 'paid',
      object: 'transaction',
      transaction: payment,
    };
  });

  it('should log an credit card payment response along with its user', async () => {
    const response = await logPostbackPayment.execute({
      postbackPayment,
      userId: user.id,
    });

    expect(response.postbackPaymentLog.id).toEqual(postbackPayment.id);
  });

  it('should log an boleto payment response along with its user', async () => {
    payment.card = null;
    payment.payment_method = 'boleto';
    payment.boleto_barcode = 'code';
    payment.boleto_expiration_date = 'tomorrow-omg';
    payment.boleto_url = 'http://boletoland.help';

    const response = await logPostbackPayment.execute({
      postbackPayment,
      userId: user.id,
    });

    expect(response.postbackPaymentLog.id).toEqual(postbackPayment.id);
  });
});
