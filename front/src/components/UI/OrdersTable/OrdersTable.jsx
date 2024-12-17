import React from 'react';
import './OrdersTable.css';
import { serializeUser } from '@/utils';

const OrdersTable = ({ orders, onCancelOrder, role }) => {
  const isWorkerOrder = role === 'WORKER';
  const isAdminOrder = role === 'ADMIN';
  const isUserOrder = role === 'USER';

  return (
    <table>
      <thead>
      <tr>
        {isAdminOrder && <th>Id</th>}
        <th>Дата замовлення</th>
        {!isUserOrder && <th>Замовник</th>}
        <th>Транспорт</th>
        <th>Послуга</th>
        {!isWorkerOrder && <th>Відповідальний</th>}
        <th>Статус</th>
        <th>Ціна</th>
        {isUserOrder && <th>Дія</th>}
      </tr>
      </thead>
      <tbody>
      {orders.map((order, index) => (
        <tr key={index}>
          {isAdminOrder && <td>{order.id}</td>}
          <td>
            {new Date(order.orderDate).toLocaleDateString('uk', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </td>
          {!isUserOrder && (
            <td>
              {serializeUser(order.user)}
            </td>
          )}
          <td>{order.vehicle?.model} - {order.vehicle?.vin}</td>
          <td>{order.services.map((service) => service.name).join(', ')}</td>
          {!isWorkerOrder && (
            <td>
              {serializeUser(order.worker)}
            </td>
          )}
          <td className='cell-status'>
              <span className={`status ${order.status.replace(' ', '-')}`}>
                {order.status}
              </span>
          </td>
          <td>{order.totalPrice} грн</td>
          {isUserOrder && (
            <td>
              {order.status !== 'CANCELED' && (
                <button onClick={() => onCancelOrder(order.id)} className="red-button">
                  Відмінити
                </button>
              )}
            </td>
          )}
        </tr>
      ))}
      {orders.length === 0 && (
        <tr>
          <td colSpan="8" className="no-data">Замовлень не знайдено.</td>
        </tr>
      )}
      </tbody>
    </table>
  );
};

export default OrdersTable;