import { useState } from 'react';
import Dropdown from '../../../../UI/Dropdown/Dropdown';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CarInfo.css';

function CarInfo({ initial, onVehicleUpdate, setNewVehicle }) {
  const [carData, setCarData] = useState(initial);
  const [active, setActive] = useState(initial.type);

  const handleChange = (event) => {
    setCarData({
      ...carData,
      [event.target.name]: event.target.value,
    });
  };

  const menuItems = ['CAR', 'TRUCK', 'MOTORCYCLE', 'BUS', 'VAN'];

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let response;
      if (carData.id) {
        response = await axios.patch(`${process.env.REACT_APP_API_URL}/users/vehicles/${carData.id}`, {
          ...carData,
          type: active,
        }, { withCredentials: true });
        toast.success('Транспорт оновлено успішно.', { position: 'bottom-right' });
      } else {
        response = await axios.post(`${process.env.REACT_APP_API_URL}/users/vehicles`, {
          ...carData,
          type: active,
        }, { withCredentials: true });
        onVehicleUpdate(response.data);
        setNewVehicle(false);
        toast.success('Транспорт додано успішно.', { position: 'bottom-right' });
      }

      setCarData(response.data);

    } catch (error) {
      const errorMessage = error.response?.data?.message;
      toast.error(errorMessage, { position: 'bottom-right' });
    }
  };

  return (
    <form className='vehicle-info' onSubmit={handleSubmit}>
      <div>
        <i className="bx bx-car"></i>
        <Dropdown
          menuItems={menuItems}
          active={active}
          setActive={setActive}
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
          placeholder="Рік випуску"
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
          maxLength={17}
          required
        />
      </div>
      <button
        type="submit"
        className="red-button save-button"
      >
        Зберегти
      </button>
    </form>
  );
}

export default CarInfo;
