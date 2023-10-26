import { Injectable } from '@nestjs/common';
import { readFileSync, readdirSync } from 'fs';
import * as HL7 from 'hl7-standard';

const MESSAGES_DIRECTORY_PATH = 'messages/';

type Patient = {
  insNumber: string;
  oidNumber: string;
  lastName: string;
  firstGivenName: string;
  givenName: string;
  dateOfBirth: string;
  sex: string;
  placeOfBirthCode: string;
  isValidated: boolean;
};

@Injectable()
export class AppService {
  getPatients(): Patient[] {
    const fileArray = readdirSync(MESSAGES_DIRECTORY_PATH);
    return fileArray.map((fileName) => {
      return this.getPatientFromMessage(MESSAGES_DIRECTORY_PATH + fileName);
    });
  }

  getPatientFromMessage(messagePath: string): Patient {
    const rawData = readFileSync(messagePath, 'utf8');
    const message = new HL7(rawData);
    message.transform();
    return {
      insNumber: message.get('PID.3.1'),
      oidNumber: message.get('PID.3')['PID.3.4'][1],
      lastName: message.get('PID.5.1'),
      firstGivenName: message.get('PID.5.2'),
      givenName: message.get('PID.5.3'),
      dateOfBirth: message.get('PID.7'),
      sex: message.get('PID.8'),
      placeOfBirthCode: message.get('PID.11.14'),
      isValidated: message.get('PID.32') === 'VALI',
    };
  }
}
