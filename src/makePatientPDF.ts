import { Record } from "pocketbase";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { rm, writeFile } from "fs/promises";
import { Response } from "express-serve-static-core";
import { pdfBytesPatient } from "./index.js";

export async function makePatientPDF(response: Record, res: Response) {
  const docname = `Informe-${response.nombres}-${response.apellidos}-${response.cedula}`;
  const uri = path.join("./generated/" + docname + ".pdf");

  const pdfdoc = await PDFDocument.load(pdfBytesPatient);
  const form = pdfdoc.getForm();

  //Form fields
  const idField = form.getTextField("id");
  const nombresField = form.getTextField("nombres");
  const apellidosField = form.getTextField("apellidos");
  const cedulaField = form.getTextField("cedula");
  const direccionField = form.getTextField("direccion");
  const edadField = form.getTextField("edad");
  const historiaField = form.getTextField("historia");
  const telefonoField = form.getTextField("telefono");
  const sangreField = form.getTextField("sangre");
  const nombres_acudienteField = form.getTextField("nombres_acudiente");
  const apellidos_acudienteField = form.getTextField("apellidos_acudiente");
  const telefono_acudienteField = form.getTextField("telefono_acudiente");
  const direccion_acudienteField = form.getTextField("direccion_acudiente");

  idField.setText(response.id);
  nombresField.setText(response.nombres);
  apellidosField.setText(response.apellidos);
  cedulaField.setText(response.cedula);
  direccionField.setText(response.direccion);
  edadField.setText(response.edad.toString());
  historiaField.setText(response.historia);
  telefonoField.setText(response.telefono);
  sangreField.setText(response.sangre);
  nombres_acudienteField.setText(response.nombres_acudiente);
  apellidos_acudienteField.setText(response.apellidos_acudiente);
  telefono_acudienteField.setText(response.telefono_acudiente);
  direccion_acudienteField.setText(response.direccion_acudiente);

  const exportedPDF = await pdfdoc.save();
  // res.setHeader('Content-Type', 'application/pdf');
  await writeFile(uri, exportedPDF);
  res.download(uri, async () => {
    rm(uri).catch(console.log);
  });
}
