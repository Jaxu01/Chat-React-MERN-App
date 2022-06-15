import './App.css'
import { useState, useEffect, useRef } from 'react'

function App() {
  const CDN_URL = 'http://localhost:5000'

  const i18n = {
    'PL': {
      'your-name': 'Jak masz na imię?',
      'name-too-short': 'Imię jest zbyt krótkie',
      'login': 'Logowanie',
      'send': 'Wyślij'
    }
  }
    const lang = i18n['PL']

  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)
  // const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()]
  // const [hour, minutes, seconds] = [date.getHours(), date.getMinutes(), date.getSeconds()]
  const date = new Date()
  const jsonDate = date.toJSON()

  function setNewName() {
    askForName()
  }

  function askForName() {
    let sign = window.prompt(lang['your-name'])
    if (sign.length > 4) {
      localStorage.name = sign
      setName(sign)
    }
    else {
      alert(lang['-name-too-short'])
    }
  }
  
  function getName() {
    if (!localStorage.name) {
      askForName()
    }
    else {
      setName(localStorage.name)
    }
  }

  function handleMessageChange(e) {
    setMessage(e.target.value)
  }
  
  async function getMessages() {
    const response = await fetch(`${CDN_URL}/messages`)
    
    if (!response.ok) {
      const message = `An error occurred ${response.statusText}`
      window.alert(message)
      return
    }
    
    const messages = await response.json()
    setMessages(messages)
  }
  
  useEffect(() => {
    getName()
    getMessages()
    messagesEndRef.current.scrollIntoView()
    return
  }, [messages.length])
  
  
  async function sendMessage(event) {
    event.preventDefault()
    event.target.checkValidity()
    console.log(name, message, date)
    const newMessage = {name, message, date}
    
    await fetch(`${CDN_URL}/action/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    })
    .catch(error => {
      return window.alert(error)
    })
    
    setMessage("")
  }
  
  
  return (
    <div className="App">
      <nav>
        <ul className="Menu">
          <li className="item button"><a onClick={setNewName}>${lang[login]}</a></li>
        </ul>
      </nav>
      <div className="MessageBox">
        {messages.map(({_id, name, message}) => (
        <div key={_id} className={`message-container ${name === localStorage.name ? "primary" : ""}`}>
          <div className="message-profile">
            {name?.length ? name[0] : "?"}
          </div>
          <div className="message-bubble">
            <strong>{name}</strong>
            <p>{message}</p>
        </div>
      </div>
      ))}
      <div ref={messagesEndRef}></div>
      </div>
      <form onSubmit={sendMessage} className="form" method="post">
        <input onChange={handleMessageChange} placeholder="Wiadomość..." type="text" value={message} name="message" required/>
        <button>${lang[send]}</button>
      </form>
    </div>
  )
}

export default App
