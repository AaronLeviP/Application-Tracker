const StatCard = ({ title, value, icon, color ='#3b82f6 '}) => {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ color }}>
                {icon}
            </div>

            <div className="stat-content">
                <h3>{title}</h3>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;