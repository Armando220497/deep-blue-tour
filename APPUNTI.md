Ecco un riassunto delle funzioni implementate nei vari componenti:

### 1. **LoginComponent**

- **Login**:
  - L'utente inserisce email e password nel modulo di login.
  - Quando l'utente clicca sul pulsante di login, viene eseguita la funzione `login()`:
    - Se i dati sono validi, un token fittizio viene salvato nel `localStorage` per simulare un'autenticazione riuscita.
    - Il router reindirizza l'utente alla pagina `home`.

### 2. **NavbarComponent**

- **Logout**:
  - Quando l'utente clicca sul pulsante di logout, viene eseguita la funzione `logout()`:
    - La funzione rimuove il token dal `localStorage` tramite il servizio `AuthService`.
    - Il router reindirizza l'utente alla pagina di login.

### 3. **RegisterComponent**

- **Registration**:
  - Quando l'utente invia il modulo di registrazione tramite la funzione `onSubmit()`, vengono raccolti i dati dell'utente (email e password) e
    inviati a un server tramite una richiesta POST (`this.http.post()`).
  - Se la registrazione ha successo, viene visualizzato un messaggio di conferma.
  - In caso di errore, viene visualizzato un messaggio di errore.

### 4. **GuestGuard**

- **Route Guard**:
  - Il `GuestGuard` impedisce l'accesso alla pagina di login se l'utente è già loggato, verificando la presenza di un token nel `localStorage`.

### **Avvio del server**:

- Per avviare il server, viene eseguito il comando `node server.js`, che avvia il server sul backend.

### Routing:

- Le route sono configurate per reindirizzare correttamente l'utente alla pagina giusta (`home`, `about`, `contact`, `login`, `register`).
- L'accesso alla pagina di login è protetto dal `GuestGuard`.

Questi sono gli elementi principali implementati nei vari componenti. L'autenticazione è simulata tramite il salvataggio del token nel `localStorage` e
il logout tramite la sua rimozione.
