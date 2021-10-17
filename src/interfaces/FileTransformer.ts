import File from "./File";
import { Transaction } from "../classes/Transaction";

export default interface FileTypeTransformer {
    transform: (file: File) => Promise<Transaction[]>
}