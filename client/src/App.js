import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  // const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
  // const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()];
  const date = new Date();
  const jsonDate = date.toJSON();

  function setNewName() {
    askForName()
  }

  function askForName() {
    let sign = window.prompt("Jak masz na imię?")
    if (sign.localStorage.name>4) {
    localStorage.name = sign;
    setName(sign);
    }
    else {
      alert("Imię jest zbyt krótkie");
    }
  }
  
  function getName() {
    if (!localStorage.name) {
      askForName()
    }
    else {
      setName(localStorage.name);
    }
  }

  function handleMessageChange(e) {
    setMessage(e.target.value)
  }
  
  async function getMessages() {
    const response = await fetch(`http://localhost:5000/messages`);
    
    if (!response.ok) {
      const message = `An error occurred ${response.statusText}`;
      window.alert(message);
      return;
    }
    
    const messages = await response.json();
    setMessages(messages);
  }
  
  useEffect(() => {
    getName();
    getMessages();
    console.log(messagesEndRef)
    messagesEndRef.current.scrollIntoView()
    return;
  }, [messages.length]);
  
  
  async function sendMessage(event) {
    event.preventDefault()
    event.target.checkValidity();
    console.log(name, message, date)
    const newMessage = {name, message, date}
    
    await fetch("http://localhost:5000/action/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage)
    })
    .catch(error => {
      return window.alert(error);
    });
    
    setMessage("");
    getMessages();
  }
  
  
  return (
    <div className="App">
      <nav>
        <ul className="Menu">
          <li className="item button"><a onClick={setNewName}>Logowanie</a></li>
          <li className="item button primary"><a href="Zarejestruj Się">Zarejestruj Się</a></li>
        </ul>
      </nav>
      <section className="MessageBox">
      {messages.map((item) => (
      <div key={item._id} className={`message-container ${item.name==="Jakub"?"primary" : ""}`}>
        <section className="message-profile">
          {item?.name?.length ?item.name[0]:"?"}
        </section>
        <section className="message-bubble">
          <h1>{item.name}</h1>
          <p>{item.message}</p>
        </section>
      </div>
      ))}
      <div ref={messagesEndRef}></div>
    </section>
      <form onSubmit={sendMessage} className="form" method="post">
        <input onChange={handleMessageChange} placeholder="Wiadomość..." type="text" value={message} name="message" required/>
        <button>Wyślij</button>
      </form>
    </div>
  )
}

export default App;
