export default interface File {
  name: string;
  content: string | ArrayBuffer | null;
  extension: string;
}
