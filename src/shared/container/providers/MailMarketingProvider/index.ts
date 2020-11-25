import { container } from 'tsyringe';
import MailchimpMailMarketingProvider from './implementations/MailchimpMailMarketingProvider';

const mailchimp = MailchimpMailMarketingProvider;

container.registerSingleton('MailMarketingProvider', mailchimp);
