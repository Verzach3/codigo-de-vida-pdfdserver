import { Response } from "express";
import { readFile, rm, writeFile } from "fs/promises";
import { join } from "path";
import { PDFDocument } from "pdf-lib";

export async function makeLogsPDf(
  response: any,
  res?: Response
): Promise<string | undefined> {
  const pdfBytesLogs = await readFile("./res/logs-final.pdf");
  const docname = `Logs-${Date.now()}`;
  const uri = join("./generated/" + docname + ".pdf");

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
  response.items.map((record: any) => {
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
  res?.download(uri, async () => {
    rm(uri).catch(console.log);
  });
  if (res === undefined) {
    return uri;
  }
}
