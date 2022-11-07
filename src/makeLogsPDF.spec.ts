import { test, expect } from "@jest/globals";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { makeLogsPDf } from "./makeLogsPDF"; // Line ignore due to a problem with the import of the function and jest

const mockData = {
  items: [
    {
      "@collectionId": "dnw0dpkb18o697i",
      "@collectionName": "registros",
      id: "RECORD_ID",
      created: "2022-01-01 01:00:00",
      updated: "2022-01-01 23:59:59",
      desde: "test",
      cliente: "app",
      email_usuario: "test",
      cedula_paciente: "test",
    },
  ],
};

test("Make Logs PDF", async () => {
  const uri = await makeLogsPDf(mockData);
  expect(uri).not.toBeUndefined();
  if (uri === undefined) {
    return;
  }
  const fileExist = existsSync(uri);
  expect(fileExist).toBe(true);
  const PDF = await PDFDocument.load(await readFile(uri));
  const form = PDF.getForm();

  //Form fields
  const emailField = form.getTextField("email");
  const cedulaField = form.getTextField("cedula");
  const createdField = form.getTextField("created");
  const desdeField = form.getTextField("desde");

  expect(emailField.getText()).toBeTruthy();
  expect(cedulaField.getText()).toBeTruthy();
  expect(createdField.getText()).toBeTruthy();
  expect(desdeField.getText()).toBeTruthy();

  expect(emailField.getText()?.includes(mockData.items[0].email_usuario)).toBe(
    true
  );
  expect(
    cedulaField.getText()?.includes(mockData.items[0].cedula_paciente)
  ).toBe(true);
  expect(createdField.getText()?.includes(mockData.items[0].created)).toBe(
    true
  );
  expect(desdeField.getText()?.includes(mockData.items[0].desde)).toBe(true);
});
