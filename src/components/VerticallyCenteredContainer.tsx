const VerticallyCenteredContainer = (props: { children: any }) => (
    <div className="h-100 container">
        <div className="row h-100 d-flex flex-row align-items-center justify-content-center">
            {props.children}
        </div>
    </div>
);

export default VerticallyCenteredContainer;