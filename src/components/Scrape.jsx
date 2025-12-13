import { useState } from "react";
import DisplayWZ from "./DisplayWZ";

const Scrape = () => {
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setData([]);

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Błąd serwera");
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Podaj dane logowania:</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleScrape();
        }}
      >
        <input
          type="text"
          value={userLogin}
          onChange={(e) => setUserLogin(e.target.value)}
          placeholder="login"
        />
        <input
          type="password"
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
        <button type="submit" disabled={loading}>
          generuj
        </button>
      </form>
      {loading ? <p>generating...</p> : <DisplayWZ data={data} />}
      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </>
  );
};

export default Scrape;
