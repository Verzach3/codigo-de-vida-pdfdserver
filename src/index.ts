import "isomorphic-fetch";
import express from "express";
import pocketbaseEs from "pocketbase";
import * as dotenv from "dotenv";
import { readFile } from "fs/promises";
import { makeLogsPDf } from "./makeLogsPDF.js";
import makePatientPDF from "./makePatientPDF.js";
dotenv.config();
const client = new pocketbaseEs(process.env.BACKEND_URL);
await client.admins.authViaEmail(
  process.env.BACKEND_USERNAME || "",
  process.env.BACKEND_PASSWORD || ""
);
export const pdfBytesPatient = await readFile(
  "./res/formulario-codigo-de-vida.pdf"
);
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
  await makePatientPDF(response, res);
});

app.get("/logs/:page", async (req, res) => {
  let response = undefined;
  const pageNum = isNaN(parseInt(req.params.page))
    ? 1
    : parseInt(req.params.page);
  try {
    response = await client.records.getList("registros", pageNum, undefined, {
      order: "-created",
    });
    console.log(response);
  } catch (error) {
    res.json(error);
    return;
  }

  makeLogsPDf(response, res);
});

app.listen(port, "127.0.0.1");
