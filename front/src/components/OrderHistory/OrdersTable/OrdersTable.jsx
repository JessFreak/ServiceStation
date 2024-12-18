import React from 'react';
import './OrdersTable.css';
import { getDateString, serializeUser, statusOptions } from '@/utils';
import Dropdown from '@UI/Dropdown/Dropdown';

const OrdersTable = ({ orders, role, onCancelOrder, onStatusChange, onWorkerChange, workers }) => {
  const columnRenderers = {
    id: (order) => <td className="id">{order.id}</td>,
    orderDate: (order) => <td>{getDateString(order.orderDate)}</td>,
    user: (order) => <td>{serializeUser(order.user)}</td>,
    vehicle: (order) => <td>{order.vehicle?.model} - {order.vehicle?.vin}</td>,
    services: (order) => <td>{order.services.map((service) => service.name).join(', ')}</td>,
    worker: (order, isAdminOrder) => (
      <td>
        {isAdminOrder ? (
          <Dropdown
            options={workers}
            active={serializeUser(order.worker)}
            setActive={(userName) => onWorkerChange(order.id, userName)}
          />
        ) : (
          serializeUser(order.worker)
        )}
      </td>
    ),
    status: (order, isAdminOrder, isWorkerOrder) => (
      <td className="cell-status">
        <span className={`status ${order.status.replace(' ', '-')}`}>
          {isWorkerOrder ? (
            <Dropdown
              options={statusOptions}
              active={order.status}
              setActive={(status) => onStatusChange(order.id, status)}
            />
          ) : (
            order.status
          )}
        </span>
      </td>
    ),
    price: (order) => <td>{order.totalPrice} грн</td>,
    action: (order) => (
      <td>
        {order.status !== 'CANCELED' && (
          <button onClick={() => onCancelOrder(order.id)} className="red-button">
            Відмінити
          </button>
        )}
      </td>
    ),
  };

  const roleConfig = {
    WORKER: {
      columns: ['orderDate', 'vehicle', 'services', 'status', 'price'],
    },
    ADMIN: {
      columns: ['id', 'orderDate', 'user', 'vehicle', 'services', 'worker', 'status', 'price'],
    },
    USER: {
      columns: ['orderDate', 'vehicle', 'services', 'status', 'price', 'action'],
    },
  };

  const renderRow = (order) => {
    const isWorkerOrder = role === 'WORKER';
    const isAdminOrder = role === 'ADMIN';

    return (
      <tr key={order.id}>
        {roleConfig[role].columns.map((column) =>
          columnRenderers[column](order, isAdminOrder, isWorkerOrder)
        )}
      </tr>
    );
  };

  const renderEmptyState = () => (
    <tr>
      <td colSpan={roleConfig[role].columns.length} className="no-data">Замовлень не знайдено.</td>
    </tr>
  );

  return (
    <table>
      <thead>
      <tr>
        {roleConfig[role].columns.map((column, index) => (
          <th key={index}>
            {{
              id: 'Id',
              orderDate: 'Дата замовлення',
              user: 'Замовник',
              vehicle: 'Транспорт',
              services: 'Послуги',
              worker: 'Відповідальний',
              status: 'Статус',
              price: 'Ціна',
              action: 'Дія',
            }[column]}
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {orders.length > 0 ? orders.map(renderRow) : renderEmptyState()}
      </tbody>
    </table>
  );
};

export default OrdersTable;
