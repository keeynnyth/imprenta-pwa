
/* ============================================================
   QUOTEPDF.TS
   PARTE 1 DE 4
   NO PEGAR NADA DEBAJO TODAVÍA.
   ESPERAR LA PARTE 2.
============================================================ */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import sello from "../../assets/images/logo-redondo-agua.png";

import logo from "../../assets/images/logo.png";

export interface PdfProducto {
  nombre: string;
  cantidad: number;
  precioUsd: number;
  precioBs: number;
  subtotalUsd: number;
  subtotalBs: number;
}

export interface PdfOrdenTrabajo {
  numero: string;

  fecha: string;

  fechaEntrega?: string;

  cliente: string;

  documento: string;

  observaciones?: string;

  totalBs: number;

  abono?: number;

  saldoPendiente?: number;

  productos: PdfProducto[];
}
export function generarPdfOrdenTrabajo(
  orden: PdfOrdenTrabajo
) {
    function formatearFecha(fecha?: string) {
  if (!fecha) return "-";

  return new Date(fecha).toLocaleDateString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "letter",
  });

  //====================================================
  // CONFIGURACIÓN GENERAL
  //====================================================

  const colorPrincipal = [36, 71, 132];

  const colorGris = [110, 110, 110];

  const colorLinea = [220, 220, 220];

  const margen = 15;

  let y = 18;

  //====================================================
// LOGO CENTRADO
//====================================================

const pageWidth = doc.internal.pageSize.getWidth();

try {

  const logoWidth = 120;
  const logoHeight = 42;

  const logoX = (pageWidth - logoWidth) / 2;

  doc.addImage(
    logo,
    "PNG",
    logoX,
    8,
    logoWidth,
    logoHeight
  );

} catch {}

//====================================================
// INFORMACIÓN LEGAL
//====================================================

doc.setFont("helvetica", "bold");
doc.setFontSize(10);

doc.setTextColor(
  colorPrincipal[0],
  colorPrincipal[1],
  colorPrincipal[2]
);

doc.text(
  "INVERSIONES M.A.4, C.A.",
  15,
  55
);

doc.setFont("helvetica", "normal");

doc.setFontSize(9);

doc.setTextColor(
  colorGris[0],
  colorGris[1],
  colorGris[2]
);

doc.text(
  "RIF J-505607740",
  15,
  60
);

//====================================================
// DIRECCIÓN
//====================================================

doc.text(
  "Av. 4 con Calle 91, Local 2B-50",
  105,
  55,
  { align: "center" }
);

doc.text(
  "Maracaibo - Estado Zulia",
  105,
  60,
  { align: "center" }
);

//====================================================
// CONTACTO
//====================================================

doc.text(
  "WhatsApp: (0424) 606-3973",
  pageWidth - 15,
  55,
  {
    align: "right"
  }
);

doc.text(
  "Correo: lagographi@gmail.com",
  pageWidth - 15,
  60,
  {
    align: "right",
  }
);

doc.text(
  "Instagram: @lagographi",
  pageWidth - 15,
  65,
  {
    align: "right"
  }
);

y = 74;
  //====================================================
  // LÍNEA SEPARADORA
  //====================================================

  doc.setDrawColor(
    colorLinea[0],
    colorLinea[1],
    colorLinea[2]
  );

 doc.line(
  margen,
  y,
  200,
  y
);

y += 10;



  //====================================================
  // TÍTULO
  //====================================================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(18);

  doc.setTextColor(0);

  doc.text(
  "ORDEN DE TRABAJO",
  margen,
  y
);

doc.setFontSize(12);

doc.text(
  orden.numero,
  150,
  y
);

  y += 10;

  //====================================================
  // DATOS DEL CLIENTE
  //====================================================

  doc.setFontSize(10);

  doc.setFont(
    "helvetica",
    "normal"
  );

 doc.text(
  `Fecha: ${formatearFecha(orden.fecha)}`,
  margen,
  y
);

doc.text(
  `Entrega: ${formatearFecha(orden.fechaEntrega)}`,
  120,
  y
);

y += 7;

doc.text(
  `Cliente: ${orden.cliente || "-"}`,
  margen,
  y
);

y += 7;

doc.text(
  `Documento: ${orden.documento || "-"}`,
  margen,
  y
);

y += 10;

  //====================================================
  // AQUÍ CONTINUARÁ LA TABLA
  // EN LA PARTE 2
  //====================================================
    //====================================================
  // TABLA DE PRODUCTOS
  //====================================================

  autoTable(doc, {

    startY: y,

    head: [[
  "Producto",
  "Cantidad"
]],

    body: orden.productos.map((producto) => [

  producto.nombre,

  producto.cantidad.toString(),

]),

    theme: "grid",

    styles: {

      font: "helvetica",

      fontSize: 10,

      cellPadding: 3,

      lineColor: [220,220,220],

      lineWidth: 0.2,

      textColor: [40,40,40],

    },

    headStyles: {

      fillColor: [36,71,132],

      textColor: [255,255,255],

      fontStyle: "bold",

      halign: "center",

      fontSize: 10,

    },

    columnStyles: {

  0: {
    cellWidth: 145,
  },

  1: {
    cellWidth: 40,
    halign: "center",
  },

},

    alternateRowStyles: {

      fillColor: [248,248,248],

    }

  });

  //====================================================
  // POSICIÓN DESPUÉS DE LA TABLA
  //====================================================

y = (doc as any).lastAutoTable.finalY + 12;

//====================================================
// RESUMEN
//====================================================

doc.setFont(
  "helvetica",
  "bold"
);

doc.setFontSize(12);

doc.text(
  "Total",
  120,
  y
);

doc.text(
  `Bs ${orden.totalBs.toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  195,
  y,
  {
    align: "right",
  }
);

y += 8;

doc.setFont(
  "helvetica",
  "normal"
);

doc.text(
  "Abono recibido",
  120,
  y
);

doc.text(
  `Bs ${(orden.abono ?? 0).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  195,
  y,
  {
    align: "right",
  }
);
y += 8;

doc.setFont(
  "helvetica",
  "bold"
);

doc.text(
  "Saldo pendiente",
  120,
  y
);

doc.text(
  `Bs ${(orden.saldoPendiente ?? (orden.totalBs - (orden.abono ?? 0))).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`,
  195,
  y,
  {
    align: "right",
  }
);

doc.setFont(
  "helvetica",
  "normal"
);

y += 14;

doc.setFontSize(9);

doc.setTextColor(90);

doc.text(
  "* En caso de realizar un abono parcial, el saldo pendiente quedará sujeto a la variación del tipo de cambio vigente al momento de efectuar el pago restante.",
  margen,
  y,
  {
    maxWidth: 180,
  }
);

doc.setTextColor(0);

y += 18;

  //====================================================
  // EN LA PARTE 3
  // OBSERVACIONES
  // PIE
  // DESCARGA DEL PDF
  //====================================================
    //====================================================
  // OBSERVACIONES
  //====================================================

  if (orden.observaciones?.trim()) {

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);

    doc.text(
      "Observaciones",
      margen,
      y
    );

    y += 7;
    

    doc.setFont("helvetica", "normal");

    doc.setFontSize(12);

    const observaciones = doc.splitTextToSize(
      orden.observaciones,
      180
    );

    doc.text(
      observaciones,
      margen,
      y
    );

    y += observaciones.length * 5 + 8;

  }

  //====================================================
  // LÍNEA SEPARADORA
  //====================================================
//====================================================
// FIRMAS
//====================================================

//====================================================
// SELLO
//====================================================

doc.addImage(
  sello,
  "PNG",
  140,
  y - 10,
  50,
  50
);

y += 40;

//====================================================
// INFORMACIÓN DE CONTACTO
//====================================================

doc.setDrawColor(
  colorLinea[0],
  colorLinea[1],
  colorLinea[2]
);

doc.line(
  margen,
  y,
  195,
  y
);

y += 8;

doc.setFontSize(9);

doc.setFont(
  "helvetica",
  "normal"
);

doc.setTextColor(
  colorGris[0],
  colorGris[1],
  colorGris[2]
);

doc.text(
  "WhatsApp: (0424) 606-3973",
  margen,
  y
);

doc.text(
  "Instagram: @lagographi",
  90,
  y
);

doc.text(
  "lagographi@gmail.com",
  195,
  y,
  {
    align: "right"
  }
);

doc.setTextColor(0);
  //====================================================
  // CONTINÚA EN LA PARTE 4
  //====================================================
    //====================================================
  // GUARDAR PDF
  //====================================================

  doc.save(`$orden.numero}.pdf`);

}