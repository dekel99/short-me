import React, { useState } from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import '../styles/ShortUrls.css';

function ShortUrls({shortUrls}) {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return <div className='url-list'>
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Your short links
        </ListSubheader>
      }
    >
      {shortUrls.map((url, i) => {
        return <ListItemButton key={i}>
          <ListItemIcon>
            <ContentCopyIcon />
          </ListItemIcon>
          <ListItemText primary={url} onClick={() => {navigator.clipboard.writeText(url)}}/>
        </ListItemButton>
      })}
    </List>
  </div>;
}

export default ShortUrls;
