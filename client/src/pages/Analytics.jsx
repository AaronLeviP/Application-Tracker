import StatCard from "../components/StatCard";

const Analytics = () => {
    return (
        <div className="statistics-container">
            <div className="statistics-header">
                <h2>Statistics</h2>
            </div>
            <div className="statistics-grid">
                <StatCard title="Total Applications" value={42} icon="📊" />
            </div>
        </div>
    )
}

export default Analytics;