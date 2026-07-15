
/* ============================================================
   QUOTEPDF.TS
   PARTE 1 DE 4
   NO PEGAR NADA DEBAJO TODAVÍA.
   ESPERAR LA PARTE 2.
============================================================ */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import logo from "../../assets/images/logo.png";

export interface PdfProducto {
  nombre: string;
  cantidad: number;
  precioUsd: number;
  precioBs: number;
  subtotalUsd: number;
  subtotalBs: number;
}

export interface PdfCotizacion {
  numero: string;

  fecha: string;

  cliente: string;

  documento: string;

  observaciones: string;

  subtotalUsd: number;
  subtotalBs: number;

  ivaUsd: number;
  ivaBs: number;

  totalUsd: number;
  totalBs: number;

  productos: PdfProducto[];
}

export function generarPdfCotizacion(
  cotizacion: PdfCotizacion
) {

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
    "COTIZACIÓN",
    margen,
    y
  );

  doc.setFontSize(12);

  doc.text(
    cotizacion.numero,
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
    `Fecha: ${cotizacion.fecha}`,
    margen,
    y
  );

  y += 7;

  doc.text(
    `Cliente: ${
      cotizacion.cliente || "-"
    }`,
    margen,
    y
  );

  y += 7;

  doc.text(
    `Documento: ${
      cotizacion.documento || "-"
    }`,
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
      "Cantidad",
      "USD",
      "Bs"
    ]],

    body: cotizacion.productos.map((producto) => [

      producto.nombre,

      producto.cantidad.toString(),

      `$ ${producto.subtotalUsd.toFixed(2)}`,

      producto.subtotalBs.toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),

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

        cellWidth: 90,

      },

      1: {

        cellWidth: 25,

        halign: "center",

      },

      2: {

        cellWidth: 30,

        halign: "right",

      },

      3: {

        cellWidth: 40,

        halign: "right",

      }

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
  // TOTALES
  //====================================================

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(11);

  doc.text(
    "Subtotal USD",
    120,
    y
  );

  doc.text(
    `$ ${cotizacion.subtotalUsd.toFixed(2)}`,
    195,
    y,
    {
      align: "right"
    }
  );

  y += 7;

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.text(
    "Subtotal Bs",
    120,
    y
  );

  doc.text(
    cotizacion.subtotalBs.toLocaleString("es-VE",{
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    }),
    195,
    y,
    {
      align:"right"
    }
  );

  y += 7;

  doc.text(
    "IVA",
    120,
    y
  );

  doc.text(
    cotizacion.ivaBs.toLocaleString("es-VE",{
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    }),
    195,
    y,
    {
      align:"right"
    }
  );

  y += 10;

  doc.setDrawColor(180);

  doc.line(
    120,
    y-4,
    195,
    y-4
  );

  doc.setFont(
    "helvetica",
    "bold"
  );

  doc.setFontSize(14);

  doc.text(
    "TOTAL USD",
    120,
    y+2
  );

  doc.text(
    `$ ${cotizacion.totalUsd.toFixed(2)}`,
    195,
    y+2,
    {
      align:"right"
    }
  );

  y += 9;

  doc.setTextColor(
    colorPrincipal[0],
    colorPrincipal[1],
    colorPrincipal[2]
  );

  doc.text(
    "TOTAL Bs",
    120,
    y+2
  );

  doc.text(
    cotizacion.totalBs.toLocaleString("es-VE",{
      minimumFractionDigits:2,
      maximumFractionDigits:2,
    }),
    195,
    y+2,
    {
      align:"right"
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

  if (cotizacion.observaciones?.trim()) {

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
      cotizacion.observaciones,
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

  y += 10;

  //====================================================
  // MENSAJE AL CLIENTE
  //====================================================

doc.setFont("times", "italic");

doc.setFontSize(18);

doc.setTextColor(
  colorPrincipal[0],
  colorPrincipal[1],
  colorPrincipal[2]
);

doc.text(
  "¡Gracias por preferirnos!",
  margen,
  y
);
  y += 8;

  doc.setFont(
    "helvetica",
    "normal"
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

doc.setFontSize(9);

doc.setTextColor(0);

y -= 12;

 doc.text(
  "Esta cotización tiene una vigencia de 1 día.",
  195,
  y,
  {
    align: "right",
  }
);

y += 6;

doc.text(
  "Si requiere factura fiscal, se adicionará el IVA correspondiente.",
  195,
  y,
  {
    align: "right",
  }
);
  y += 12;

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

  //====================================================
  // CONTINÚA EN LA PARTE 4
  //====================================================
    //====================================================
  // GUARDAR PDF
  //====================================================

  doc.save(`${cotizacion.numero}.pdf`);

}