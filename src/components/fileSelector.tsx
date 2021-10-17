import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ReactComponent as AddFileImg } from "../images/svg/addFile.svg";
import File from "../interfaces/File";

interface Props {
  setInput: Dispatch<SetStateAction<File| undefined>>
}

const FileSelector: React.FC<Props> = (props) => {
  const fileChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if(event.target && event.target.files && event.target.files.length > 0){
        const fr = new FileReader();
        const name = event.target.files[0].name;
        const extension = event.target.files[0].type;
        fr.onloadend = () => {
            props.setInput({
                content: fr.result,
                extension, name
            });
        };
        fr.readAsText(event.target.files[0], 'ISO-8859-1');
    }
  };
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        File input
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <AddFileImg />
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="text/xml, .csv"
                onChange={fileChanged}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">csv or xml up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
