import "isomorphic-fetch";
import express from "express";
import pocketbaseEs from "pocketbase";
import * as dotenv from "dotenv";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { readFile, rm, writeFile } from "fs/promises";
dotenv.config();
const client = new pocketbaseEs(process.env.BACKEND_URL);
await client.admins.authViaEmail(
  process.env.BACKEND_USERNAME || "",
  process.env.BACKEND_PASSWORD || ""
);
const pdfBytesPatient = await readFile("./res/formulario-codigo-de-vida.pdf");
const pdfBytesLogs = await readFile("./res/logs-final.pdf");
const app = express();
const port = 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

console.log(process.env.BACKEND_URL);
app.get("/generate/:id", async (req, res) => {
  let response = undefined;
  try {
    response = await client.records.getOne("pacientes", req.params.id);
    console.log(response);
    // res.json(response);
  } catch (error) {
    res.json(error);
    return;
  }
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

  console.log(req.params.id);
});

app.get("/logs/:page", async (req, res) => {
  let response = undefined;
  const pageNum = isNaN(parseInt(req.params.page))
    ? 1
    : parseInt(req.params.page);
  try {
    response = await client.records.getList("registros", pageNum);
    console.log(response);
  } catch (error) {
    res.json(error);
    return;
  }
  const docname = `Logs-${Date.now()}`;
  const uri = path.join("./generated/" + docname + ".pdf");

  const pdfdoc = await PDFDocument.load(pdfBytesLogs);
  const form = pdfdoc.getForm();

  //Form fields
  const emailField = form.getTextField("email");
  const cedulaField = form.getTextField("cedula");
  const createdField = form.getTextField("created");
  const desdeField = form.getTextField("desde");
  let email = "";
  let cedula = "";
  let created = "";
  let desde = "";
  response.items.forEach((record) => {
    email += `${record.email_usuario}
`;
    cedula += `${record.cedula_paciente}
`;
    created += `${record.created}
`;
    desde += `${record.desde}
`;
  });
  emailField.setText(email);
  cedulaField.setText(cedula);
  createdField.setText(created);
  desdeField.setText(desde);

  const exportedPDF = await pdfdoc.save();
  await writeFile(uri, exportedPDF);
  res.download(uri, async () => {
    rm(uri).catch(console.log);
  });
});

app.listen(port, "127.0.0.1");
