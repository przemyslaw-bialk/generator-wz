import { useState } from "react";
import DisplayWZ from "./DisplayWZ";

const Scrape = () => {
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [data, setData] = useState([]);

  const handleScrape = async () => {
    try {
      const response = await fetch("http://localhost:5000/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_login: userLogin,
          user_password: userPassword,
          order_number: orderNumber,
        }),
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Podaj dane logowania:</h1>
      <input
        type="text"
        value={userLogin}
        onChange={(e) => setUserLogin(e.target.value)}
        placeholder="login"
      />
      <input
        type="text"
        value={userPassword}
        onChange={(e) => setUserPassword(e.target.value)}
        placeholder="haslo"
      />
      <input
        type="text"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder="numer zamowienia"
      />
      <button onClick={handleScrape}>generuj</button>
      <DisplayWZ data={data} />
    </>
  );
};

export default Scrape;
