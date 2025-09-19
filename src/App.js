import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [formdata, setFormdata] = useState({ name: '', mobileno: '' });
  const [editingContact, setEditingContact] = useState(null);

  const getContacts = async () => {
    try {
      const response = await fetch('https://contacts-backend-adqr.onrender.com/contacts/allcontacts');
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.log("Error fetching contacts", error);
    }
  };

  const getContact = async (id) => {
    if (!id) return;
    try {
      const response = await fetch(`https://contacts-backend-adqr.onrender.com/contacts/contact/${id}`);
      const data = await response.json();
      setFormdata({ name: data.name, mobileno: data.mobileno });
      setEditingContact(data._id);
    } catch (error) {
      console.log('Error fetching contact for edit:', error);
    }
  };

  const onNameChange = (e) => setFormdata(prev => ({ ...prev, name: e.target.value }));
  const onMobilenoChange = (e) => setFormdata(prev => ({ ...prev, mobileno: e.target.value }));

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const url = editingContact
      ? `https://contacts-backend-adqr.onrender.com/contacts/update/${editingContact}`
      : 'https://contacts-backend-adqr.onrender.com/contacts/add-contact';

    const options = {
      method: editingContact ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      alert(editingContact ? 'Contact Updated' : 'Contact Added');

      if (editingContact) {
        setContacts(prev =>
          prev.map(contact => contact._id === editingContact ? { ...contact, ...formdata } : contact)
        );
      } else {
        setContacts(prev => [...prev, { _id: data._id, ...formdata }]);
      }

      setFormdata({ name: '', mobileno: '' });
      setEditingContact(null);
    } catch (error) {
      console.log('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  const onDelete = async (id) => {
    try {
      await fetch(`https://contacts-backend-adqr.onrender.com/contacts/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      getContacts();
      alert("Contact deleted successfully");
    } catch (error) {
      console.log("Error deleting contact", error);
    }
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="container">
      <h1>{editingContact ? 'Edit Contact' : 'Add Contact'}</h1>

      <form onSubmit={onSubmitForm}>
        <label htmlFor='name'>Name</label>
        <input id='name' type='text' onChange={onNameChange} value={formdata.name} required />

        <label htmlFor='mobileno'>Mobile No</label>
        <input id='mobileno' type='text' onChange={onMobilenoChange} value={formdata.mobileno} required />

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            {editingContact ? 'Update' : 'Submit'}
          </button>
          {editingContact && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingContact(null);
                setFormdata({ name: '', mobileno: '' });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="contacts-grid">
        {contacts.length===0 ? (<h2 className='no-contacts'> No Contacts Found </h2>) : contacts.map((contact) => (
       
          (<li key={contact._id}>
            <div className="contact-info">
              <h3>{contact.name}</h3>
              <p>{contact.mobileno}</p>
            </div>
            <div className="contact-actions">
              <button className="edit-btn" onClick={() => getContact(contact._id)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(contact._id)}>Delete</button>
            </div>
          </li>)
        ))}
      </ul>
    </div>
  );
};

export default App;
