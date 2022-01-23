import React, { useState } from 'react';

import { Button, HelperText, Input, Label } from '@luberius/fork-windmill-react-ui';
import { toast } from 'react-hot-toast';
import PageTitle from '../components/Typography/PageTitle';
import http from '../utils/axios/axios';

function InputData() {
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const doUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    const axiosCall = http.post('upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    toast
      .promise(axiosCall, {
        loading: 'Uploading..',
        success: 'Upload berhasil',
        error: 'Upload gagal'
      })
      .then(() => setFile(undefined))
      .catch((err) => err.message);
  };

  return (
    <>
      <PageTitle>Input Data</PageTitle>
      <div className="flex flex-col">
        <Label>
          <span>Data File (.csv)</span>
          <Input className="mt-2 p-4" type="file" accept="text/csv" onChange={handleFileChange} />
          <HelperText>
            <b>Note:</b> Pastikan format data sesuai
          </HelperText>
        </Label>
        <div className="flex justify-end">
          <Button onClick={doUpload}>Upload</Button>
        </div>
      </div>
    </>
  );
}

export default InputData;
