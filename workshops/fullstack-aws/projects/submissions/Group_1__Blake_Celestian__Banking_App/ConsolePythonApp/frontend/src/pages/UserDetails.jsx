import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getUser,
  updateUser,
} from "../services/userService";

import {
  getAccountsByOwner,
} from "../services/accountService";


function UserDetails() {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    birthday: "",
    phone_number: "",
  });


  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getUser(userId);
        const accountData = await getAccountsByOwner(userId);

        setUser(userData);

        setFormData({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          birthday: userData.birthday,
          phone_number: userData.phone_number,
        });

        setAccounts(accountData.accounts);
      } catch (error) {
        setError(error.message);
      }
    }

    loadUser();
  }, [userId]);


  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }


  async function handleSave() {
    try {
      const updatedUser = await updateUser(
        userId,
        formData
      );

      setUser(updatedUser);
      setEditing(false);
    } catch (error) {
      setError(error.message);
    }
  }


  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }


  return (
    <div>
      <h1>User Details</h1>

      {!editing ? (
        <div>
          <p>
            Name: {user.first_name} {user.last_name}
          </p>

          <p>Email: {user.email}</p>
          <p>Birthday: {user.birthday}</p>
          <p>Phone: {user.phone_number}</p>

          <button
            onClick={() => setEditing(true)}
          >
            Edit User
          </button>
        </div>
      ) : (
        <div>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />

          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />

          <button onClick={handleSave}>
            Save
          </button>

          <button
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}


      <h2>Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        accounts.map((account) => (
          <div key={account.account_number}>
            <p>
              Type: {account.account_type}
            </p>

            <p>
              Account Number: {account.account_number}
            </p>

            <p>
              Balance: ${account.balance}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserDetails;