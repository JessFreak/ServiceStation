import { useState } from 'react';
import Dropdown from '@UI/Dropdown/Dropdown';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VehicleInfo.css';
import { axiosInstance, hasError, vehicleTypes } from '@/utils';

function VehicleInfo({ initial, onVehicleUpdate, setNewVehicle }) {
  const [carData, setCarData] = useState(initial);
  const [active, setActive] = useState(initial.type);

  const handleChange = (event) => {
    setCarData({
      ...carData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!active) {
      toast.error('Виберіть тип транспорту.');
      return;
    }

    let response;
    if (carData.id) {
      response = await axiosInstance.patch(`users/vehicles/${carData.id}`, {
        ...carData,
        type: active,
      });
      if (hasError(response)) return;

      toast.success('Транспорт оновлено успішно.');
    } else {
      response = await axiosInstance.post('users/vehicles', {
        ...carData,
        type: active,
      });
      if (hasError(response)) return;

      onVehicleUpdate();
      setNewVehicle(null);
      toast.success('Транспорт додано успішно.');
    }
    setCarData(response.data);
    onVehicleUpdate(response.data);
  };

  const handleDelete = async () => {
    if (!initial.id) return;

    const response = await axiosInstance.delete(`users/vehicles/${carData.id}`);
    if (hasError(response)) return;

    toast.success('Транспорт видалено успішно.');
    onVehicleUpdate(null);

    if (setNewVehicle) {
      setNewVehicle(null);
    }
  };

  return (
    <form className='vehicle-info' onSubmit={handleSubmit}>
      <div>
        <i className="bx bx-car"></i>
        <Dropdown
          options={Array.from(vehicleTypes.values())}
          active={vehicleTypes.get(active)}
          setActive={(type) => setActive(vehicleTypes.getKey(type))}
          placeholder='Тип транспорту'
        />
      </div>
      <div>
        <i className="bx bx-calendar"></i>
        <input
          type="number"
          name="year"
          id="year"
          min={1885}
          max={2024}
          placeholder="Рік"
          value={carData.year}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <i className="bx bx-rename"></i>
        <input
          type="text"
          name="model"
          id="model"
          placeholder="Модель"
          value={carData.model}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <i className="bx bx-barcode"></i>
        <input
          type="text"
          name="vin"
          id="vin"
          placeholder="VIN"
          value={carData.vin}
          onChange={handleChange}
          pattern="^[A-HJ-NPR-Z0-9]{17}$"
          required
        />
      </div>
      <div className="button-group">
        <button
          type="submit"
          className="red-button save-button"
        >
          Зберегти
        </button>
        {carData.id && (
          <button
            type="button"
            className="service-button save-button"
            onClick={handleDelete}
          >
            <i className="bx bx-trash"></i>
          </button>
        )}
      </div>
    </form>
  );
}

export default VehicleInfo;
