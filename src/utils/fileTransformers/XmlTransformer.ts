import File from "../../interfaces/File";
import FileTypeTransformer from "../../interfaces/FileTransformer";
import xml2js from "xml2js";
import { Transaction } from "../../classes/Transaction";
import Ajv, { JSONSchemaType } from "ajv";
const ajv = new Ajv();

interface XMLRecords {
    records: {
        record: Array<{
            "$": {reference: string},
            accountNumber: string[],
            description: string[],
            endBalance: string[],
            mutation: string[],
            startBalance: string[],
        }>
    }    
}

const schema: JSONSchemaType<XMLRecords> = {
    type: "object",
    properties: {
        records: {
            type: "object",
            properties: {
                record: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            "$": {
                                type: "object",
                                properties: {
                                    reference: {type: "string"}
                                },
                                required: ["reference"],
                                additionalProperties: false,
                            },
                            accountNumber: {type: "array", items:{type: "string"}, minItems: 1, maxItems: 1},
                            description: {type: "array", items:{type: "string"}, minItems: 1, maxItems: 1},
                            endBalance: {type: "array", items:{type: "string"}, minItems: 1, maxItems: 1},
                            mutation: {type: "array", items:{type: "string"}, minItems: 1, maxItems: 1},
                            startBalance: {type: "array", items:{type: "string"}, minItems: 1, maxItems: 1},
                        },
                        required: ["$", "accountNumber", "description", "endBalance", "mutation", "startBalance"],
                        additionalProperties: false,
                    }
                }
            },
            required: ["record"],
            additionalProperties: false,
        }
    },
    required: ["records"],
    additionalProperties: false,
};
const validateXML = ajv.compile(schema);

const xmlRecordsToTransaction = (xmlResult: XMLRecords): Transaction[] => {
    const transactions: Transaction[] = [];
    for(const record of xmlResult.records.record){
        transactions.push(new Transaction(record["$"].reference, record.accountNumber[0], record.description[0], Number(record.startBalance[0]), Number(record.mutation[0]), Number(record.endBalance[0])));
    }
    return transactions;
};

export default class XmlTransformer implements FileTypeTransformer {
    async transform(file: File) {
        if(typeof file.content === 'string'){
            const result = await xml2js.parseStringPromise(file.content);
            if (!validateXML(result)) {
                console.error('XML schema validation error: ', validateXML.errors);
                throw new Error(`XML content does not match schema, check console for error`);
            }
            return xmlRecordsToTransaction(result);
        }
        throw new Error("XML file content was not of type string");
    }
}