import './Settings.css';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance } from '@/utils';
import MyModal from '@UI/MyModal';

const Settings = () => {
  const [formData, setFormData] = useState({ password: '', newPassword: '', newPasswordRepeat: '' });
  const [hasPassword, setHasPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchHasPassword = async () => {
    const response = await axiosInstance.get('auth/hasPassword');
    setHasPassword(response.data);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value.trim() });
  };

  useEffect(() => {
    fetchHasPassword();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.newPassword !== formData.newPasswordRepeat) {
      toast.error('Нові паролі не співпадають.');
      return;
    }

    const response = await axiosInstance.patch('auth/password', {
      oldPassword: hasPassword ? formData.password : '',
      newPassword: formData.newPassword,
    });
    if (response.error) return;

    toast.success('Пароль успішно змінено.');
    await fetchHasPassword();
  };

  const handleLogout = async () => {
    await axiosInstance.post('auth/logout');
    window.location.href = '/';
  };

  const handleDelete = async () => {
    await axiosInstance.delete('auth/me');
    window.location.href = '/';
  };

  return (
    <>
      <h1>Налаштування</h1>
      <div className='profile-card'>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="password">Поточний пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Введіть поточний пароль"
              onChange={handleInputChange}
              required={hasPassword}
              disabled={!hasPassword}
            />
          </div>
          <div className="input-container">
            <label htmlFor="newPassword">Новий пароль</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Введіть новий пароль"
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="newPasswordRepeat">Підтвердіть новий пароль</label>
            <input
              type="password"
              id="newPasswordRepeat"
              name="newPasswordRepeat"
              placeholder="Введіть новий пароль ще раз"
              onChange={handleInputChange}
              required
            />
          </div>
          <button className='red-button' type='submit'>
            Змінити пароль
          </button>
        </form>
        <div className='settings-buttons'>
          <button className='red-button' onClick={handleLogout}>
            Вийти з акаунту
          </button>
          <button className='red-button' onClick={() => setIsModalOpen(true)}>
            Видалити аккаунт
          </button>
        </div>

        {isModalOpen && <MyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2>Видалити аккаунт?</h2>
          <p>Ви впевнені, що хочете видалити свій аккаунт?</p>
          <button className='red-button' onClick={handleDelete}>
            Так, впевнений. Видалити
          </button>
        </MyModal>
        }
      </div>
    </>
  )
};

export default Settings;