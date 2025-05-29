import { useEffect, useState } from "react";
import axios from "axios";
import TableView from "../components/TableView";

const Comments = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/comments")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="content">
      <h2>Comments</h2>
      <TableView data={data} />
    </div>
  );
};

export default Comments;
