const DisplayWZ = ({ data }) => {
  return (
    <>
      <h3>gotowa WZ</h3>
      {data.map((item, index) => (
        <p key={index}>
          {item.item_name} - {item.item_qtn}
        </p>
      ))}
    </>
  );
};

export default DisplayWZ;
