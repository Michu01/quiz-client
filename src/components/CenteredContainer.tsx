const CenteredContainer = (props: { children: any }) => (
    <div className="h-100 container">
        <div className="row h-100 d-flex flex-row justify-content-center align-items-center">
            <div className="d-flex flex-column justify-content-center align-items-center opaque-white p-3 rounded">
                {props.children}
            </div>
        </div>
    </div>
);

export default CenteredContainer;