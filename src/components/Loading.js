const Loading = ({ onload }) => {
    return (
        <div id="loading" className={onload ? "" : "active"}>
            <p>LOADING</p>
        </div>
    )
}

export default Loading;

