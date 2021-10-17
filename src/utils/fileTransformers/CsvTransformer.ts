import File from "../../interfaces/File";
import FileTypeTransformer from "../../interfaces/FileTransformer";
import csv from "csvtojson";
import Ajv, { JSONSchemaType } from "ajv";
import { Transaction } from "../../classes/Transaction";
const ajv = new Ajv();

interface CSVRecord {
    "Reference": string;
    "Account Number": string;
    "Description": string;
    "Start Balance": string;
    "Mutation": string;
    "End Balance": string;
}

const schema: JSONSchemaType<CSVRecord[]> = {
    type: "array",
    items: {
        type:"object",
        properties: {
            "Reference": {type: "string"},
            "Account Number": {type: "string"},
            "Description": {type: "string"},
            "Start Balance": {type: "string"},
            "Mutation": {type: "string"},
            "End Balance": {type: "string"},
        },
        required: ["Reference", "Account Number", "Description", "Start Balance", "Mutation", "End Balance"],
        additionalProperties: false
    }
};
const validateCSV = ajv.compile(schema);

const csvRecordsToTransactions = (records: CSVRecord[]):Transaction[] => {
    const transactions: Transaction[] = [];
    for(const record of records){
        transactions.push(new Transaction(record.Reference, record["Account Number"], record.Description, Number(record["Start Balance"]), Number(record.Mutation), Number(record["End Balance"])));
    }
    return transactions;
};

export default class CsvTransformer implements FileTypeTransformer {
    async transform (file: File) {
        if(typeof file.content === 'string'){
            const result = await csv().fromString(file.content);
            if (!validateCSV(result)) {
                console.error('CSV schema validation error: ', validateCSV.errors);
                throw new Error(`CSV content does not match schema, check console for error`);
            }
            return csvRecordsToTransactions(result);
        }
        throw new Error('CSV file content was not of type string');
    }
}