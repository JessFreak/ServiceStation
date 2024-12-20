import { registerDecorator, ValidationOptions } from 'class-validator';
import { DateTime } from 'luxon';

interface IsValidOrderDateOptions {
  timeZone?: string;
  startHour?: number;
  endHour?: number;
  difference: number;
}

export function IsValidOrderDate (options?: IsValidOrderDateOptions, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    const { timeZone = 'Europe/Kiev', startHour = 8, endHour = 20, difference } = options || {};

    registerDecorator({
      name: 'isValidOrderDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate (value: any): boolean {
          const orderDate = DateTime.fromISO(value, { zone: timeZone });

          if (!orderDate.isValid) {
            return false;
          }

          const start = orderDate.set({ hour: startHour, minute: 0, second: 0 });
          const end = orderDate.set({ hour: endHour, minute: 0, second: 0 });
          const inInterval = orderDate >= start && orderDate <= end;

          if (!inInterval) return false;

          const minDate = DateTime.local().plus({ hours: difference });
          return orderDate > minDate;
        },
        defaultMessage (args): string {
          const orderDate = DateTime.fromISO(args.value, { zone: 'Europe/Kiev' });
          const start = orderDate.set({ hour: 8, minute: 0, second: 0 });
          const end = orderDate.set({ hour: 20, minute: 0, second: 0 });
          const minDate = DateTime.local().plus({ hours: difference });

          if (orderDate < start || orderDate > end) {
            return `Дата замовлення має бути в межах робочого часу (${startHour}:00–${endHour}:00, часовий пояс ${timeZone})`;
          }

          if (orderDate <= minDate) {
            return `Замовлення має бути не менше ніж за ${difference} години від поточного часу`;
          }

          return '';
        },
      },
    });
  };
}
