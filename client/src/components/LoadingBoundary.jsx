const LoadingBoundary = ({
    loading,
    error,
    data,
    loadingComponent = <div className="loading">Loading...</div>,
    errorComponent = null,
    emptyComponent = <div className="empty-state">No data found</div>,
    children
}) => {
    // Loading state
    if(loading) {
        return loadingComponent;
    }

    // Error state
    if(error){
        return errorComponent || (
            <div className="error-state">
                <p>{error}</p>
            </div>
        );
    }

    // Empty state
    if(!data || ((Array.isArray(data) && data.length === 0))) {
        return emptyComponent;
    }

    return children;
}

export default LoadingBoundary;