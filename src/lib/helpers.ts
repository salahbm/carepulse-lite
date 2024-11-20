import { usePathname } from 'next/navigation';

export const appointmentType = (type: string) => {
  let status;
  switch (type) {
    case 'schedule':
      status = 'scheduled';
      break;
    case 'cancel':
      status = 'cancelled';
      break;
    default:
      status = 'pending';
  }
  return status;
};

export const appointmentButtonLabel = (type: string) => {
  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;
    case 'create':
      buttonLabel = 'Request Appointment';
      break;
    default:
      buttonLabel = 'Button is not found';
  }
  return buttonLabel;
};

export const companyName = (path: string) => {
  const company = path.split('/').slice(1, 2).join('/');
  return company;
};
