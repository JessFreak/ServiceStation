import axios from 'axios';
import { toast } from 'react-toastify';

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = getErrorMessage(error);
    toast.error(errorMessage);
    return { error: true };
  }
);

export const getErrorMessage = (error) => {
  const message = error.response?.data?.message;

  if (typeof message === 'string') {
    return `${message}.`;
  }

  return message.join(', ') + '.';
};

export const hasError = (response) => 'error' in response;

export const hasAccessToken = () => document.cookie.includes('access_token');

// eslint-disable-next-line no-extend-native
Map.prototype.getKey = function(value) {
  for (const [key, val] of this) {
    if (val === value) {
      return key;
    }
  }
  return null;
};

export const roles = new Map([
  ['ADMIN', 'Адміністратор'],
  ['USER', 'Користувач'],
  ['WORKER', 'Працівник'],
]);

export const vehicleTypes = new Map([
  ['CAR', 'Легковий автомобіль'],
  ['TRUCK', 'Вантажівка'],
  ['MOTORCYCLE', 'Мотоцикл'],
  ['BUS', 'Автобус'],
  ['VAN', 'Фургон'],
]);

export const statuses = new Map([
  ['WAITING', 'Очікування'],
  ['PROCESSING', 'В обробці'],
  ['DONE', 'Завершено'],
  ['CANCELED', 'Скасовано'],
]);

export const getDateString = (date) =>
  new Date(date).toLocaleDateString('uk', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});

export const getTomorrowString = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0];
}

export const deserializeOrderDate = (formData) => new Date(`${formData.date} ${formData.time}`);

export const serializeVehicle = (vehicle) =>`${vehicle.model} - ${vehicle.vin}`;

export const deserializeVehicle = (vehicle) => {
  const vehicleSplit = vehicle.split(' - ');
  return {
    model: vehicleSplit[0],
    vin: vehicleSplit[1],
  }
};

export const serializeUser = (user) => {
  if (!user) return '-';
  return `${user.name} ${user.surname} - ${user.email}`
};

export const deserializeUser = (user) => {
  const userSplit = user.split(' - ');
  return {
    email: userSplit[1].trim(),
  }
};

export const getUserId = (userName, users) => {
  const { email } = deserializeUser(userName);
  const worker = users.find((user) => user.email === email);
  return worker.id;
}
