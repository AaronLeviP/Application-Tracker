const ChartCard = ({ children, title }) => {
    return (
        <div className="chart-card">
            <h3>{title}</h3>
            <div className="chart-content">
                {children}
            </div>
        </div>
    );
}

export default ChartCard;