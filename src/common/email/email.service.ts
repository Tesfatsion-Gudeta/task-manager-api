import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendTaskAssignmentEmail(
    to: string,
    taskTitle: string,
    projectName: string,
  ) {
    await this.mailerService.sendMail({
      to,
      subject: `New Task Assigned: ${taskTitle}`,
      text: `You have been assigned a task "${taskTitle}" in project "${projectName}".`,
      html: `<p>You have been assigned a task <strong>${taskTitle}</strong> in project <strong>${projectName}</strong>.</p>`,
    });
  }
}
