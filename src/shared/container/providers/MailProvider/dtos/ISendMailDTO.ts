import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO';

interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  cc?: IMailContact;
  bcc?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
