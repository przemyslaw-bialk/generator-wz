import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../fonts/Roboto-Regular-normal";

const DisplayWZ = ({ data }) => {
  const handleGenerate = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular", "normal");
    doc.setFontSize(12);

    // Nagłówek
    doc.text("Zamówienie: #Z251208606 z dnia: 08/12/25", 20, 20);
    doc.text("Calibra Mateusz Dzieliński", 20, 27);
    doc.text("Chylońska 130", 20, 34);
    doc.text("81-021 Gdynia", 20, 41);
    doc.text("VAT: 9581595323", 20, 48);

    // Tabela
    const tableColumn = ["#", "Nazwa", "szt."];
    const tableRows = data.map((el, index) => [
      index + 1,
      el.item_name,
      el.item_qtn,
    ]);

    autoTable(doc, {
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200] },
      styles: { font: "Roboto-Regular", fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 130 },
        2: { cellWidth: 30 },
      },
    });

    doc.save("wz.pdf");
  };

  return (
    <>
      <h3>gotowa WZ</h3>
      {data.map((item, index) => (
        <p key={index}>
          {index + 1} {item.item_name} - {item.item_qtn}
        </p>
      ))}
      <button onClick={handleGenerate}>pobierz pdf</button>
    </>
  );
};

export default DisplayWZ;
