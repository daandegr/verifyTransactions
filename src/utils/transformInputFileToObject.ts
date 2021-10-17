import File from "../interfaces/File";
import FileTypeTransformer from "../interfaces/FileTransformer";
import { Transactions } from "../classes/Transactions";
import CsvTransformer from "./fileTransformers/CsvTransformer";
import XmlTransformer from "./fileTransformers/XmlTransformer";

const transformers: Record<string, FileTypeTransformer> = {
    "text/xml": new XmlTransformer(),
    "text/csv": new CsvTransformer()
};

export const transformInputFile = async (file: File): Promise<Transactions> => {
    if(transformers[file.extension]) {
        return new Transactions(await (transformers[file.extension].transform(file)));
    }
    throw new Error("Could not transform file");
};