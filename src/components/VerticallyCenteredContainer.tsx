const VerticallyCenteredContainer = (props: { children: any }) => (
    <div className="h-100 container">
        <div className="row h-100 d-flex flex-row align-items-center">
            <div className="w-100">
                {props.children}
            </div>
        </div>
    </div>
);

export default VerticallyCenteredContainer;