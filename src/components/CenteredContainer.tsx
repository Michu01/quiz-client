const CenteredContainer = (props: { children: any }) => (
    <div className="h-100 container">
        <div className="row h-100 d-flex flex-row justify-content-center align-items-center">
            <div className="d-flex flex-column text-center bg-white p-5 rounded">
                {props.children}
            </div>
        </div>
    </div>
);

export default CenteredContainer;