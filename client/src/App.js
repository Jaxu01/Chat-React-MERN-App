import './App.css';
import { useState } from 'react';


function App() {

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleNameChange(e) {
    setName(e.target.value)
  }

  function handleMessageChange(e) {
    setMessage(e.target.value)
  }

  async function sendMessage(event) {
    event.preventDefault()
    console.log(name, message)
    const newMessage = {name, message}

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
  }

  return (
    <div className="App">
      <nav>
        <ul menu className="Menu">
          <li className="item button"><a href="Logowanie">Logowanie</a></li>
          <li className="item button secondary"><a href="Zarejestruj Się">Zarejestruj Się</a></li>
        </ul>
      </nav>
      <form onSubmit={sendMessage} className="form" method="post">
        <input onChange={handleNameChange} type="text" value={name} name="name"/>
        <input onChange={handleMessageChange} type="text" value={message} name="message"/>
        <button>Wyślij</button>
      </form>
      <div className="MessageBox">
        <div className="Bubble">L</div>
        <div className="MainData"><h2>Lorem ipsum dolor sit amet</h2><p>Lorem ipsum dolor sit amet</p></div>
      </div>
    </div>
  )
}

export default App;
