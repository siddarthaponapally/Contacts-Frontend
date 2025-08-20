


import React, { useState, useEffect } from 'react';

import './App.css'

const App = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobileno: '',
  });

  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null); // Track if we're editing a contact

  // Fetch all contacts
  const getContacts = async () => {
    try {
      const response = await fetch('http://localhost:5000/contacts/allcontacts');
      const data = await response.json();
      console.log('Contacts:', data); // Debug: check if contacts are fetched correctly
      setContacts(data);
    } catch (error) {
      console.log('Error fetching contacts:', error);
    }
  };

  // Fetch a single contact (for editing)
  const getContact = async (id) => {
    if (!id) return; // Add a check to ensure id is valid
    try {
      const response = await fetch(`http://localhost:5000/contacts/contact/${id}`);
      const data = await response.json();
      console.log('Editing contact:', data); // Debug: check if contact is fetched for editing
      setFormData({ name: data.name, mobileno: data.mobileno });
      setEditingContact(data._id); // Set editing state to the current contact _id
    } catch (error) {
      console.log('Error fetching contact for edit:', error);
    }
  };

  // Add or Update contact
  const onSubmitForm = async (e) => {
    e.preventDefault();
    const url = editingContact
      ? `http://localhost:5000/contacts/update/${editingContact}` // Update route
      : 'http://localhost:5000/contacts/add-contact'; // Add route

    const options = {
      method: editingContact ? 'PUT' : 'POST', // Use PUT if editing, POST if adding
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('Success:', data);
      alert(editingContact ? 'Contact Updated' : 'Contact Added');
      
      // Update the contacts list (either by replacing or adding the contact)
      if (editingContact) {
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === editingContact ? { ...contact, ...formData } : contact
          )
        );
      } else {
        // For new contact, just add it to the list
        setContacts((prevContacts) => [...prevContacts, { _id: data._id, ...formData }]);
      }

      setFormData({ name: '', mobileno: '' }); // Clear form
      setEditingContact(null); // Reset editing state
    } catch (error) {
      console.log('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  // Handle input changes
  const onNameChange = (e) => setFormData((prev) => ({ ...prev, name: e.target.value }));
  const onMobileChange = (e) => setFormData((prev) => ({ ...prev, mobileno: e.target.value }));

  // Delete contact
  const deleteContact = async (id) => {
    if (!id) return; // Add a check to ensure id is valid
    const url = `http://localhost:5000/contacts/delete/${id}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });
      const data = await response.json();
      console.log('Deleted contact:', data); // Debug: check if delete is successful
      setContacts((prevContacts) => prevContacts.filter((contact) => contact._id !== id)); // Remove from the list
    } catch (error) {
      console.log('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  useEffect(() => {
    getContacts(); // Fetch contacts when the component mounts
  }, []);

  return (
    <>
      <h2>{editingContact ? 'Edit Contact' : 'Add Contact'}</h2>
      <form onSubmit={onSubmitForm}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={onNameChange}
        />
        <br />
        <label htmlFor="mobileno">Mobile No</label>
        <input
          id="mobileno"
          type="text"
          value={formData.mobileno}
          onChange={onMobileChange}
        />
        <br />
        <button type="submit">{editingContact ? 'Update' : 'Submit'}</button>
      </form>

      <h3>Contacts List</h3>
      <ul>
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li key={contact._id}>
              <h4>{contact.name}</h4>
              <p>{contact.mobileno}</p>
              <button onClick={() => deleteContact(contact._id)}>Delete</button>
              <button onClick={() => getContact(contact._id)}>Edit</button>
            </li>
          ))
        ) : (
          <p>No contacts available</p>
        )}
      </ul>
    </>
  );
};

export default App;

