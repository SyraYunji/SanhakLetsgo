function MenuCard({ icon, label, desc, onClick }) {
  return (
    <button type="button" className="menu-card" onClick={onClick}>
      <span className="menu-card-icon">{icon}</span>
      <span className="menu-card-label">{label}</span>
      <span className="menu-card-desc">{desc}</span>
    </button>
  );
}

export default MenuCard;
