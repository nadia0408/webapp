import { useEffect, useState } from "react";
import axios from "axios";
import TableView from "../components/TableView";

const Users = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="content">
      <h2>Users</h2>
      <TableView data={data} />
    </div>
  );
};

export default Users;
