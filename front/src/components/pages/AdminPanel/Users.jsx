import React, { useEffect, useState } from 'react';
import { axiosInstance, roles } from '@/utils';
import Dropdown from '@UI/Dropdown/Dropdown';
import { toast } from 'react-toastify';
import MyModal from '@UI/MyModal';
import RegisterForm from '@Components/pages/Auth/RegisterForm';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [activeRole, setActiveRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const initData = { name: '', surname: '', email: '', phone: '', password: '', role: null }
  const [formData, setFormData] = useState(initData);

  const fetchUsers = async () => {
    setLoading(true);
    const response = await axiosInstance.get('users', {
      params: { role: roles.getKey(activeRole) },
    });
    if (response.error) return;

    setUsers(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [activeRole]);

  const handleRoleChange = async (userId, newRole) => {
    if (!newRole) return;

    const role = roles.getKey(newRole);
    const response = await axiosInstance.patch(`users/${userId}`, { role });
    if (response.error) return;

    await fetchUsers();
    toast.success('Роль успішно змінена.');
  };

  const handleUserCreate = async (e) => {
    e.preventDefault();

    const response = await axiosInstance.post('users', {
      ...formData,
      role: roles.getKey(formData.role),
    });
    if (response.error) return;

    await fetchUsers();
    setIsModalOpen(false);
    toast.success('Користувача успішно створено.');
  };

  return (
    <div className='vehicles'>
      <div className="vehicles-header">
        <h1 className="profile-title">Користувачі</h1>
        <button className="red-button save-button" onClick={() => setIsModalOpen(true)}>
          Створити користувача
        </button>
      </div>
      <div className="filters">
        <Dropdown
          options={Array.from(roles.values())}
          active={activeRole}
          setActive={setActiveRole}
          placeholder='За ролю'
        />
      </div>
      {loading ? (
        <p>Завантаження...</p>
      ) : (
        <table className='users-table'>
          <thead>
          <tr>
            <th>Id</th>
            <th>Ім'я</th>
            <th>Прізвище</th>
            <th>Email</th>
            <th>Роль</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {<td>{user.id}</td>}
              {<td>{user.name}</td>}
              {<td>{user.surname}</td>}
              {<td>{user.email}</td>}
              {<td>
                <Dropdown
                  options={Array.from(roles.values())}
                  active={roles.get(user.role)}
                  setActive={(newRole) => handleRoleChange(user.id, newRole)}
                />
              </td>
              }
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="8" className="no-data">Користувачів не знайдено.</td>
            </tr>
          )}
          </tbody>
        </table>
      )}
      <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h1>Створення користувача</h1>
        <div className='modal-form'>
          <RegisterForm
            formData={formData}
            setFormData={setFormData}
            onRegister={handleUserCreate}
            byAdmin={true}
          />
        </div>
      </MyModal>
    </div>
  );
};

export default Users;
