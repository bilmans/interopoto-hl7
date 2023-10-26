import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import * as HL7 from 'hl7-standard';

const MESSAGES_DIRECTORY_PATH = 'messages/';
const MESSAGE_FILE_PATH = MESSAGES_DIRECTORY_PATH + '1.hl7';

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
  getPatient(): Patient {
    const rawData = readFileSync(MESSAGE_FILE_PATH, 'utf8');
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
