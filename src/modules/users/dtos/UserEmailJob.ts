import { ITemplateVariables } from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

export default interface IUserEmailJob {
  to: {
    name: string;
    email: string;
  };
  cc?: {
    name: string;
    email: string;
  };
  bcc?: {
    name: string;
    email: string;
  };
  subject: string;
  templateFile: string;
  mailVariables: ITemplateVariables;
}
