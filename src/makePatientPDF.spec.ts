import { test, expect } from "@jest/globals";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import makePatientPDF from "./makePatientPDF";

const mockData = {
  "@collectionId": "wXfSupiJmOKyvRU",
  "@collectionName": "pacientes",
  id: "RECORD_ID",
  created: "2022-01-01 01:00:00",
  updated: "2022-01-01 23:59:59",
  nombres: "test",
  apellidos: "test",
  edad: 123,
  direccion: "test",
  foto: "filename.jpg",
  cedula: "test",
  sangre: "test",
  telefono: "test",
  nombres_acudiente: "test",
  apellidos_acudiente: "test",
  telefono_acudiente: "test",
  direccion_acudiente: "test",
  historia: "test",
};

test("Make Patient PDF", async () => {
  const uri = await makePatientPDF(mockData);
  expect(uri).not.toBeUndefined();
  if (uri === undefined) {
    return;
  }
  const fileExist = existsSync(uri);
  expect(fileExist).toBe(true);
  const PDF = await PDFDocument.load(await readFile(uri));
  const form = PDF.getForm();

  //Form fields
  const nombresField = form.getTextField("nombres");
  const apellidosField = form.getTextField("apellidos");
  const edadField = form.getTextField("edad");
  const direccionField = form.getTextField("direccion");
  const cedulaField = form.getTextField("cedula");
  const sangreField = form.getTextField("sangre");
  const telefonoField = form.getTextField("telefono");
  const nombresAcudienteField = form.getTextField("nombres_acudiente");
  const apellidosAcudienteField = form.getTextField("apellidos_acudiente");
  const telefonoAcudienteField = form.getTextField("telefono_acudiente");
  const direccionAcudienteField = form.getTextField("direccion_acudiente");
  const historiaField = form.getTextField("historia");

  expect(nombresField.getText()).toBeTruthy();
  expect(apellidosField.getText()).toBeTruthy();
  expect(edadField.getText()).toBeTruthy();
  expect(direccionField.getText()).toBeTruthy();
  expect(cedulaField.getText()).toBeTruthy();
  expect(sangreField.getText()).toBeTruthy();
  expect(telefonoField.getText()).toBeTruthy();
  expect(nombresAcudienteField.getText()).toBeTruthy();
  expect(apellidosAcudienteField.getText()).toBeTruthy();
  expect(telefonoAcudienteField.getText()).toBeTruthy();
  expect(direccionAcudienteField.getText()).toBeTruthy();
  expect(historiaField.getText()).toBeTruthy();

  expect(nombresField.getText()?.includes(mockData.nombres)).toBe(true);
  expect(apellidosField.getText()?.includes(mockData.apellidos)).toBe(true);
  expect(edadField.getText()?.includes(String(mockData.edad))).toBe(true);
  expect(direccionField.getText()?.includes(mockData.direccion)).toBe(true);
  expect(cedulaField.getText()?.includes(mockData.cedula)).toBe(true);
  expect(sangreField.getText()?.includes(mockData.sangre)).toBe(true);
  expect(telefonoField.getText()?.includes(mockData.telefono)).toBe(true);
  expect(
    nombresAcudienteField.getText()?.includes(mockData.nombres_acudiente)
  ).toBe(true);
  expect(
    apellidosAcudienteField.getText()?.includes(mockData.apellidos_acudiente)
  ).toBe(true);
  expect(
    telefonoAcudienteField.getText()?.includes(mockData.telefono_acudiente)
  ).toBe(true);
  expect(
    direccionAcudienteField.getText()?.includes(mockData.direccion_acudiente)
  ).toBe(true);
});
