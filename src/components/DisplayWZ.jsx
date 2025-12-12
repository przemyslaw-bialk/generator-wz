import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import "../fonts/Roboto-Regular-normal";
import React from "react";

const dt = new Date();
const date = dt.toISOString().slice(0, 10).replaceAll("-", "/");

const DisplayWZ = ({ data }) => {
  const { result, address, order_date } = data;

  // order number
  const order_number = "#Z251209608";
  const wz_number = order_number.replace("#", "WZ");

  const handleGenerate = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular", "normal");
    doc.setFontSize(12);

    // address and date
    doc.text(`Wejherowo, ${date}`, 148, 7);

    // buyer data
    doc.text("Kupujący", 14, 15, { align: "left" });
    doc.text(`${address}`, 14, 21, { align: "left" });

    // seller data
    doc.text("Sprzedający", 148, 15, { align: "left" });
    doc.text("Ecoterm", 148, 21, { align: "left" });
    doc.text("os. Kaszubskie 1/21", 148, 25, { align: "left" });
    doc.text("84-200 Wejherowo", 148, 30, { align: "left" });
    doc.text("Numer BDO: 000024265", 148, 35, { align: "left" });
    doc.text("VAT: 588-182-20-63", 148, 40, { align: "left" });

    // header
    doc.setFontSize(14);
    doc.text(`Wydanie zewnętrzne numer: ${wz_number}`, 55, 50);
    doc.text(
      `na podstawie zamówienia: ${order_number} z ${order_date}`,
      44,
      56
    );

    // table
    const tableColumn = ["#", "Nazwa", "szt."];
    const tableRows = result.map((el, index) => [
      index + 1,
      el.item_name,
      el.item_qtn,
    ]);

    autoTable(doc, {
      startY: 63,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [200, 200, 200] },
      styles: { font: "Roboto-Regular", fontSize: 7, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 140 },
        2: { cellWidth: 30 },
      },
      // footer
      didDrawPage: () => {
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;

        const leftMargin = 17;
        const rightMargin = 39;

        doc.setFontSize(12);
        doc.text("Wystawił: P. Białk", leftMargin, pageHeight - 10);
        doc.text("Odebrał(a)", pageWidth - rightMargin, pageHeight - 10);
      },
    });

    doc.save("wz.pdf");
  };

  return (
    <>
      {result?.length > 0 && (
        <button onClick={handleGenerate}>pobierz pdf</button>
      )}
      <p style={{ whiteSpace: "pre-line" }}>{address}</p>
      {result?.map((item, index) => (
        <p key={index}>
          {index + 1} {item.item_name} - {item.item_qtn}
        </p>
      ))}
    </>
  );
};

export default React.memo(DisplayWZ);
