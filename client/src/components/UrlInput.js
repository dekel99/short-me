import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import ShortUrls from './ShortUrls';
import axios from "axios"

const serverUrl = process.env.REACT_APP_SERVER_URL
console.log(process.env.REACT_APP_SERVER_URL)

function UrlInput() {
  const [url, setUrl] = useState('');
  const [shortUrls, setShortUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [urlErr, setUrlErr] = useState('');

  function handleChange(e) {
    setUrl(e.target.value);
  }

  async function handleSubmit() {
    setLoading(true)
    setUrlErr('')
    const res = await axios.post(`${serverUrl}/new-url`, {data: url})
    console.log(res.data)
    if(res.data.success) {
      setShortUrls(prevUrl => { return [...prevUrl, res.data.content] })
    } else {
      setUrlErr(res.data.content)
    }
    setLoading(false)
  }

  return <div>
    <TextField onChange={handleChange} value={url} size='small'/>
    <LoadingButton loading={loading} onClick={handleSubmit}>Short me!</LoadingButton>
    <p style={{color: "red"}}>{urlErr}</p>
    {shortUrls.length > 0 && <ShortUrls shortUrls={shortUrls}></ShortUrls>}
  </div>;
}

export default UrlInput;
