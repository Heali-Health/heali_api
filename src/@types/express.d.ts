/**
 * Quando o express não está preparado para
 * aceitar os tipos que devem ser utilizados
 * na aplicação é possível SOBREESCREVER a
 * tipagem padrão, aqui no caso do Express
 */

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}
