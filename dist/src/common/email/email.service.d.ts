import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailService {
    private mailerService;
    constructor(mailerService: MailerService);
    sendTaskAssignmentEmail(to: string, taskTitle: string, projectName: string): Promise<void>;
}
