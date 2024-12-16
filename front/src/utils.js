import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
  withCredentials: true,
});

export const roleTranslations = {
  ADMIN: 'Адміністратор',
  USER: 'Користувач',
  WORKER: 'Працівник',
};

export const getTodayString = () => new Date().toISOString().split('T')[0];

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
