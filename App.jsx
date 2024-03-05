import './App.css'
import axios from "axios";
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [filterusers, setfilterusers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({nmae:"",age:"",city:""});

  const getAllUsers = async() => {
    await axios.get("http://localhost:8000/users").then((res)=>{
      setUsers(res.data);
      setfilterusers(res.data)
    })
  };
  useEffect(() => {
    getAllUsers()
  },[]);

  const handleSeachChange = (e) =>{
    const searchText = e.target.value.toLowerCase();
    const filteredUsers = users.filter((user)=>user.name.toLowerCase().include(searchText) || 
    user.city.toLowerCase().include(searchText));
    setfilterusers(filteredUsers);

  };

  const handleDelete = async(id) => {
    const isConfirmed = window.comfirm('Are you sure you want to delete this User?');
    if(isConfirmed){
    await  axios.delete(`http://localhost:8000/users/${id}`).then((res) => {
      setUsers(res.data);
      setfilterusers(res.data);
    })
  }

  const handleAddRecord = () => {
  setUserData({name:"", age:"", city:""});
  setIsModalOpen(true) 
};

const closeModal = () => {
  setIsModalOpen(false);
  getAllUsers();
};

const handleData = (e) => {
  setUserData({...userData, [e.target.name]:e.target.value}); 
}
  };
  
  const handleSubmit   = async (e) => {
    e.preventDefault();
    if(userData.id){
      await axios.patch(`http://localhost:8000/users"/${userData.id}`, userData).then((res) => {
      console.log(res);
    });

    } else {
      await axios.post("http://localhost:8000/users",userData).then((res) => {
      console.log(res);
    });
    }
  
    closeModal();
    setUserData({name:"", age:"", city:""});

    await axios.post("http://localhost:8000/users",userData).then((res) => {
      console.log(res);
    });
  }

const handleUpdateRecord (user) => {
  setUserData(user);
  setIsModalOpen(true);
}
  
  return (
    <>
      <div className='container'>
        <h3>CRUD Application with React.Js Frontend and Node.js Backend</h3>

        <div className="input-search">
          <input type="search" placeholder='Search Text Here' onChange={handleSeachChange}/>
          <button className='btn green'>Add Record</button>
        </div>

        <table className='table'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
           {filterusers && filterusers.map((user, index)=> {
            return (
            <tr key={user.id}>
              <td>{index + 1}</td>
             <td>{user.name}</td>
             <td>{user.age}</td>
             <td>{user.city}</td>
             <td><button onClick={()=> handleUpdateRecord(user)} className='btn green'>Edit</button></td>
             <td><button onClick={() => handleDelete(user.id)} className='btn red'>Delete</button></td>
            </tr> 
            )
          })};
              
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <h2>{userData.id ? "Update Record" : "Add Record"}</h2>

              <div className="input-group">
                <label htmlFor='name'>Full Name</label>
                <input type='text' value={userData.name} name="name" id="name" onChange={handleData}/>
              </div>

              <div className="input-group">
                <label htmlFor='age'>Age</label>
                <input type='number' value={userData.age} name="age" id="age" onChange={handleData}/>
              </div>

              <div className="input-group">
                <label htmlFor='city'>City</label>
                <input type='text'value={userData.city}  name="city" id="city" onChange={handleData}/>
              </div>

              <button className='btn green' onClick={handleSubmit}>{userData.id ? "Update Record" : "Add Record"}</button>

            </div>
          </div>
        )}


      </div>
    </>
  )
}

export default App
