const LoadingBoundary = ({
    loading,
    error,
    onRetry,
    loadingComponent = <div className="loading">Loading...</div>,
    errorComponent = null,
    children
}) => {
    if (loading) {
        return loadingComponent;
    }

    if (error) {
        return errorComponent || (
            <div className="error-state">
                <p>{error}</p>
                {onRetry && (
                    <button onClick={onRetry} className="btn-secondary retry-btn">
                        Try again
                    </button>
                )}
            </div>
        );
    }

    return children;
}

export default LoadingBoundary;
