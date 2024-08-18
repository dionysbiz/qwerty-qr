import { useRef, useState } from 'react';
//import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// @mui
//import { alpha } from '@mui/material/styles';
//import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton } from '@mui/material';
import Cookies from 'js-cookie';
// components
import MenuPopover from '../../components/MenuPopover';
import ConnectMetaMask from '../../components/ConnectMetaMask';
// mocks_
//import account from '../../_mock/account';


// ----------------------------------------------------------------------
AccountPopover.propTypes = {
  langPack: PropTypes.object
};

export default function AccountPopover({langPack}) {
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(null);
  const [netId, setNetId] = useState('UNKNOWN');

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSetNetId = (fromChild) => {
    console.log(fromChild);
    setNetId(fromChild);
  };

  const MENU_OPTIONS = [
    {
      label: langPack.acctPop_home,
      icon: 'eva:home-fill',
      linkTo: '/',
    },
    {
      label: langPack.acctPop_setting,
      icon: 'eva:settings-2-fill',
      linkTo: '/form/currentUserInfo',
    },
  ];

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src='/static/icons/logo_anonymus.png' alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {Cookies.get('username')? Cookies.get('username'):langPack.acctPop_newUser }
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
          {Cookies.get('email')? Cookies.get('email'):'' }
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        
        {/* TODO
        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>
        */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <ConnectMetaMask handler={handleSetNetId} />
      </MenuPopover>
    </>
  );
}
