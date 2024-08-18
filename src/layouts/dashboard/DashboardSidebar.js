import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@mui/material';
import Cookies from 'js-cookie';
// mock
import account from '../../_mock/account';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
//
import navConfig from './NavConfig';
import { TestContext, ProdContext } from '../../Context';

// ----------------------------------------------------------------------


const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH,
  },
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
  langPack: PropTypes.object
};




export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, langPack}) {
  const { pathname } = useLocation();

  const context = useContext(TestContext);
  const { drupalHostname } = context;

  const isDesktop = useResponsive('up', 'lg');
  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Logo />
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="/form/currentUserInfo">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.primary' }}>
                {Cookies.get('username')? (langPack.navSide_ShipInfoWelcomeBack):(langPack.navSide_ShipInfoInput1) }
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {Cookies.get('username')? Cookies.get('username'):(langPack.navSide_ShipInfoInput2) }
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {account.role}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={navConfig(langPack)} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/static/illustrations/email_leftbottom.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              {langPack.navSide_QuestionContact1}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {langPack.navSide_QuestionContact2}
            </Typography>
          </Box>

          <Button href={`https://${drupalHostname}/contact`} target="_blank" variant="contained">
            {langPack.navSide_QuestionContact3}
          </Button>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
