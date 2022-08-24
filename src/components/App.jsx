import s from './App.module.css';
import { nanoid } from 'nanoid';
import { Component } from 'react';
import ContactForm from './ContactForm';
import ContactList from './ContactList';
import Filter from './Filter';
import Notification from './Notification';

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  addContact = ({ name, number }) => {
    const normalizedName = name.toLowerCase();

    let isAdded = this.state.contacts.find(
      el => el.name.toLowerCase() === normalizedName
    );

    if (isAdded) {
      alert(`${name} is already in contacts`);
      return;
    }

    const contact = {
      id: nanoid(),
      name: name,
      number: number,
    };

    this.setState(prevState => ({
      contacts: [...prevState.contacts, contact],
    }));
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };

  getFilteredContacts = () => {
    const { filter, contacts } = this.state;
    const normilizedFilter = filter.toLowerCase();

    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normilizedFilter)
    );
  };

  deleteContact = contactId => {
    this.setState({
      contacts: this.state.contacts.filter(contact => contact.id !== contactId),
    });
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parcedContacts = JSON.parse(contacts);

    if (parcedContacts) {
      this.setState({ contacts: parcedContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = this.getFilteredContacts();
    return (
      <div className={s.container}>
        <div>
          <h1>Phonebook</h1>
          <ContactForm onSubmit={this.addContact} />
        </div>
        <div>
          <h2>Contacts</h2>
          <div>All contacts: {contacts.length}</div>
          <Filter value={filter} onChange={this.changeFilter} />
          {contacts.length > 0 ? (
            <ContactList
              contacts={filteredContacts}
              onDeleteContact={this.deleteContact}
            />
          ) : (
            <Notification message="No contacts yet :))" />
          )}
        </div>
      </div>
    );
  }
}

export default App;
