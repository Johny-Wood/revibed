import FileUploader from '@/components/common/FileUploader';
import WantListImportStep from '@/components/wantList/import/WantListImportStep';
import FilesTypesConstants from '@/constants/files/types';

function WantListImportByDiscogsCSVFile({ navigateToSignInOrExecute, callbackImportWantList, inProcess }) {
  const onImport = ({ file }) => {
    callbackImportWantList(
      {
        name: 'file',
        value: file || '',
      },
      { importType: 'import_csv' }
    );
  };

  return (
    <WantListImportStep title="Import .CSV file">
      <FileUploader
        className="w-100pct"
        maxFiles={1}
        inputId="wantListFile"
        fullVersion
        dragonDrop
        pattern={[FilesTypesConstants.APPLICATION.CSV, FilesTypesConstants.APPLICATION.CSV_2]}
        accept=".csv"
        dragonDropFile
        attachDescription="Upload .csv file"
        onClick={(e) => {
          navigateToSignInOrExecute({
            notExecutableFunction: () => {
              e.preventDefault();
            },
          });
        }}
        callBackUploadBlobFiles={(files) => {
          navigateToSignInOrExecute({
            executableFunction: () => {
              onImport(files[0]);
            },
          });
        }}
        inProcess={inProcess}
      />
    </WantListImportStep>
  );
}

export default WantListImportByDiscogsCSVFile;
