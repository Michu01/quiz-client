import Navbar from "./Navbar";

const RouteTemplate = (props: {children: any}) => {

    return (
        <div className="h-100 d-flex flex-column">
            <header>
                <Navbar/>
            </header>
            <div className="flex-grow">
                { props.children }
            </div>
        </div>
    );
}

export default RouteTemplate;