function MessageDate({ jsonDate }) {
    const date = new Date(jsonDate)
    const [hour, minutes] = [date.getHours(), date.getMinutes()]

    return <p>{hour}:{minutes}</p>
}
 
function Message({ name, message, date }) {
    return (
        <div className={`message-container ${name === localStorage.name ? "primary" : ""}`}>
            <div className="message-profile">
                {name.length ? name[0] : "?"}
            </div>
            <div className="message-bubble">
                <strong>{name}</strong>
                <p>{message}</p>
                <MessageDate jsonDate={date} />
            </div>
        </div>
    )
}

export { Message }