import { inject, injectable } from 'tsyringe';

import mailConfig from '@config/mail';
import IQueueProvider from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import ISendScheduleRequestEmailDTO from '../dtos/ISendScheduleRequestEmailDTO';

@injectable()
export default class SendScheduleRequestEmailService {
  constructor(
    @inject('QueueProvider')
    private queueProvider: IQueueProvider,
  ) {}

  public async execute({
    user,
    patient,
    prices,
    dates,
    hours,
  }: ISendScheduleRequestEmailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    const checkDatesEquality = dates.from === dates.to;

    const datesString = checkDatesEquality
      ? dates.from
      : `de ${dates.from} a ${dates.to}`;

    const hoursString = hours.join(', ');

    try {
      const userEmailQueueJob = {
        to: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
        },
        bcc: {
          name,
          email,
        },
        subject: `Heali :: Recebemos a solicitação de exame para ${patient.first_name}`,
        mailVariables: {
          username: user.first_name,
          patientname: patient.first_name,
          prices,
          dates: datesString,
          hours: hoursString,
        },
        templateFile: 'schedule_request_user_version.hbs',
      };

      await this.queueProvider.add(userEmailQueueJob);
    } catch (err) {
      console.log(err);
    }
  }
}
