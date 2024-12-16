import { useEffect, useState } from 'react';
import axios from 'axios';
import CarInfo from './CarInfo';
import './Vehicles.css';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVehicle, setNewVehicle] = useState(null);

  const getVehicles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/vehicles`, {
        withCredentials: true,
      });
      setVehicles(response.data);
    } catch (error) {
      console.error('Помилка при отриманні транспортних засобів:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehicles();
  }, []);

  const handleUpdateVehicles = () => {
    getVehicles();
  };

  const handleAddVehicle = () => {
    setNewVehicle({
      type: 'CAR',
      year: '',
      model: '',
      vin: '',
    });
  };

  if (loading) {
    return <h1>Завантаження...</h1>;
  }

  return (
    <div className="vehicles">
      <div className="vehicles-header">
        <h1>Транспортні засоби</h1>
        <button className="red-button save-button" onClick={handleAddVehicle}>
          Додати транспортний засіб
        </button>
      </div>
      <div className="vehicles-list">
        {vehicles.length === 0 && !newVehicle && (
          <h1>У вас ще немає транспортних засобів.</h1>
        )}
        {vehicles.map((vehicle) => (
          <CarInfo
            key={vehicle.id}
            initial={vehicle}
            onVehicleUpdate={handleUpdateVehicles}
          />
        ))}
        {newVehicle && (
          <CarInfo initial={newVehicle} onVehicleUpdate={handleUpdateVehicles} setNewVehicle={setNewVehicle} />
        )}
      </div>
    </div>
  );
};

export default Vehicles;
