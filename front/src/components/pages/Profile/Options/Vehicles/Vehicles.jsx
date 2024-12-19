import React, { useEffect, useState } from 'react';
import VehicleInfo from './VehicleInfo/VehicleInfo';
import './Vehicles.css';
import { axiosInstance } from '@/utils';
import { Loading } from '@UI/Loading';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newVehicle, setNewVehicle] = useState(null);

  const fetchVehicles = async () => {
    try {
      const response = await axiosInstance.get('users/vehicles');
      setVehicles(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles().then();
  }, []);

  const handleUpdateVehicles = (updatedVehicle = null) => {
    if (updatedVehicle === null && newVehicle) {
      setNewVehicle(null);
      return;
    }
    fetchVehicles().then();
  };

  const handleAddVehicle = () => {
    setNewVehicle({
      type: 'CAR',
      year: '',
      model: '',
      vin: '',
    });
  };

  if (loading) return <Loading />;

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
          <VehicleInfo
            key={vehicle.id}
            initial={vehicle}
            onVehicleUpdate={handleUpdateVehicles}
          />
        ))}
        {newVehicle && (
          <VehicleInfo
            initial={newVehicle}
            onVehicleUpdate={handleUpdateVehicles}
            setNewVehicle={setNewVehicle}
          />
        )}
      </div>
    </div>
  );
};

export default Vehicles;
