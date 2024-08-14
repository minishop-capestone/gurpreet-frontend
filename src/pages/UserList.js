import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import Modal from 'react-modal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({
    id: '',
    username: '',
    email: '',
    password: '',
    role: 'User',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://gurpreet-backend.onrender.com/api/adminUsers/getAll');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const openModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      setForm({
        id: user._id,
        username: user.username,
        email: user.email,
        password: '',
        role: user.isAdmin ? 'Admin' : 'User',
      });
    } else {
      setForm({
        id: '',
        username: '',
        email: '',
        password: '',
        role: 'User',
      });
    }
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitForm = {
      ...form,
      isAdmin: form.role === 'Admin',
    };
    try {
      if (selectedUser) {
        await axios.put(`https://gurpreet-backend.onrender.com/api/adminUsers/${selectedUser._id}`, submitForm);
        setUsers(users.map((user) => (user._id === selectedUser._id ? { ...user, ...submitForm } : user)));
      } else {
        const response = await axios.post('https://gurpreet-backend.onrender.com/api/adminUsers/create', submitForm);
        setUsers([...users, response.data]);
      }
      setModalIsOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://gurpreet-backend.onrender.com/api/adminUsers/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Users</h2>
        <button className="add-user text-white px-4 py-2 rounded" onClick={() => openModal()}>
          Add User
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">USER NAME</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROLE</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">user_{user._id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.isAdmin ? 'Admin' : 'User'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4" onClick={() => openModal(user)}>
                    <FaUserEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete(user._id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal" overlayClassName="modal-overlay">
        <button className="modal-close-button" onClick={closeModal}><FaTimes /></button>
        <h2 className="text-2xl font-semibold mb-4">{selectedUser ? 'Edit User' : 'Add User'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">User Name</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" name="username" type="text" placeholder="Enter user name" value={form.username} onChange={handleInputChange} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" placeholder="Enter email address" value={form.email} onChange={handleInputChange} required />
          </div>
          {!selectedUser && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="password" name="password" type="password" placeholder="Enter password" value={form.password} onChange={handleInputChange} required />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">Role</label>
            <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="role" name="role" value={form.role} onChange={handleInputChange} required>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button className="add-user bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              {selectedUser ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;
