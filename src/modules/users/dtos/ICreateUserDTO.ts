export default interface ICreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_whatsapp?: string;
  avatar?: string;
}
