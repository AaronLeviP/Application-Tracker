/*
  StatCard — redesigned with colored icon wrapper and bolder typography.

  Props:
    title   — label displayed below the value
    value   — the main metric (number or string)
    icon    — SVG JSX element rendered inside the icon wrapper
    color   — accent color used for the value text and icon stroke
    iconBg  — background color of the icon wrapper (light tint of color)
*/

const StatCard = ({
    title,
    value,
    icon,
    color = '#3b82f6',
    iconBg = 'rgba(59, 130, 246, 0.1)',
}) => {
    return (
        <div className="stat-card">
            <div
                className="stat-icon-wrapper"
                aria-hidden="true"
                style={{ backgroundColor: iconBg, color }}
            >
                {icon}
            </div>

            <div className="stat-content">
                <h3>{title}</h3>
                <p className="stat-value" style={{ color }}>{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
