import { TVariant } from '../../ui/types';

export type Notification = {
  id: string;
  dateTime: Date;
  title: string;
  message: string;
  variant: TVariant;
};
