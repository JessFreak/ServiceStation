import './Sidebar.css';

const Sidebar = ({ options, active, setActive }) => {
  return (
    <div className="sidebar">
      <ul className="nav-links">
        {options.map((option) => (
          <li key={option.name}>
            <button
              type="button"
              className={active === option.name ? 'active' : ''}
              onClick={() => setActive(option.name)}
            >
              <i className={`bx ${option.icon}`}></i>
              <span className="link_name">{option.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
