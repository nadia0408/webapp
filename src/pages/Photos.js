import { useEffect, useState } from "react";
import axios from "axios";
import TableView from "../components/TableView";

const Photos = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/photos")
      .then(res => setData(res.data.slice(0, 50))) // limit for performance
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="content">
      <h2>Photos</h2>
      <TableView data={data} />
    </div>
  );
};

export default Photos;
