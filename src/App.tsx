import { useState, useEffect } from 'react';
import { Transaction } from './classes/Transaction';
import ErrorComponent from './components/errorComponent';
import FileSelector from './components/fileSelector';
import InvalidTransactionsTable from './components/invalidTransactionsTable';
import './index.css';
import File from './interfaces/File';
import { transformInputFile } from './utils/transformInputFileToObject';

function App() {
  const [fileInput, setFileInput] = useState<File | undefined>();
  const [fileError, setFileError] = useState<string | false>(false);
  const [invalidTransactions, setInvalidTransactions] = useState<Transaction[]>([]);

  useEffect(()=>{
    (async ()=>{
      if(fileInput){
        setFileError(false);
        const records = await transformInputFile(fileInput);
        setInvalidTransactions(records.getInvalids());
      }
    })().catch((error)=>{
      setFileError(error instanceof Error ? error.message : "Something failed");
    });
  },[fileInput, setFileError]);
  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Verifify transactions</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <FileSelector setInput={setFileInput}/>
          {fileError && <ErrorComponent message={fileError} />}
          {!fileError && fileInput && invalidTransactions.length === 0 && <> 
            No invalid transactions found
          </>}
          <InvalidTransactionsTable transactions={invalidTransactions}/>
        </div>
      </main>
    </>
  );
}

export default App;
