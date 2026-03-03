const LoadingBoundary = ({
    loading,
    error,
    onRetry,
    // data,
    loadingComponent = <div className="loading">Loading...</div>,
    errorComponent = null,
    // emptyComponent = <div className="empty-state">No data found</div>,
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
                {onRetry && (
                    <button onClick={onRetry} className="btn-secondary retry-btn">
                        Try again
                    </button>
                )}
            </div>
        );
    }

    // // Empty state
    // if(!data || ((Array.isArray(data) && data.length === 0))) {
    //     return emptyComponent;
    // }

    return children;
}

export default LoadingBoundary;
