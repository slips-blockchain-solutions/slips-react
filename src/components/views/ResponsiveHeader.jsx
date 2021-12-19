import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { useWalletModalToggle, useWalletModalOpen, useApplicationContext, useToggleLoggedIn, useLogUserIn, useLogUserOut } from '../../contexts/Application'
import { WalletSidebar } from '../'
import WalletModal from '../WalletModal'
import Identicon from '../Identicon'
import { useSetLoggedIn, useLoggedInState } from '../../contexts/LocalStorage';
import {signTypedData} from "../../helpers"

export default function ResponsiveHeader({userAccount}){
  
    const setLoggedIn = useSetLoggedIn();
    const userLoggedIn = useLoggedInState();

    const context = useWeb3React();
    const {
      connector,
      library,
      chainId,
      account,
      activate,
      deactivate,
      active,
      error
    } = context;

    const toggleWalletModal = useWalletModalToggle()
  
    if(account && userAccount && userLoggedIn){
        var welcome = "Welcome "+userAccount.name;
    } else {
        var welcome = "Log In or Create An Account";
    }
    var pageItems = [
        {path:"/explore-collections", name:"Explore"},
        {path:"/stats", name:"Stats"},
        {path:"/resources", name:"Resources"},
        {path:"/asset/create", name:"Create"},
    ]
    var settingsItems = [
        {path:"/account", name:"Profile"},
        {path:"/account/favorites", name:"Favorites"},
        {path:"/account/settings", name:"Settings"},
        {path:"/my-collections/", name:"My Collections"},
        {path:"/debugcontracts", name:"Debug"},
    ]

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const [route, setRoute] = React.useState();
  React.useEffect(() => {
      setRoute(window.location.pathname)
  }, [setRoute]);

  const iconButton = () => {
    if(account && userAccount && !userAccount.image ) {
      return (
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Identicon />
        </IconButton>
      )
    } else {
      return ( 
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt={userAccount && userAccount.name} src={userAccount && userAccount.image} /> 
        </IconButton>
      )
    }
              
  }
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Link onClick={()=>{setRoute("/")}} to={"/"}>
                <img src="/images/slips_white.png" className="logo" />
            </Link>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pageItems.map((page, key) => {
                return (
                <MenuItem key={key} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link onClick={()=>{setRoute(page.path)}} to={page.path}>{page.name}</Link>
                  </Typography>
                </MenuItem>
                )
            })}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            <Link onClick={()=>{setRoute("/")}} to={"/"}>
                <img src="/images/slips_white.png" className="logo" />
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pageItems.map((page, key) => {
                return (
                <Button key={key} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link onClick={()=>{setRoute(page.path)}} to={page.path}>{page.name}</Link>
                  </Typography>
                </Button>
                )
            })}
          </Box>

          <Box className='header-account-box' sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              {iconButton()}
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                {welcome}
                {settingsItems.map((item, key) => {                    
                return ( 
                    <MenuItem selected ={route == item.path} key={key} style={{ index:"9"}} onClick={handleCloseNavMenu}>
                        <Link onClick={()=>{
                          setRoute(item.path);
                          handleCloseUserMenu();
                          }} to={item.path}>{item.name}</Link>
                    </MenuItem>
                    ) 
                })}
                 {(userLoggedIn) && (
                    <Button
         
                      onClick={() => {
                        setLoggedIn(false)
                        if(account){
                          deactivate();
                        }
                        handleCloseUserMenu();
                      }}
                    >
                      Logout NOW
                    </Button>
                  )}
                  {(!userLoggedIn) && (
                    <Button
           
                      onClick={() => {
                        setLoggedIn(true)
                        handleCloseUserMenu();
                        toggleWalletModal();
                      }}
                    >
                      Login
                    </Button>
                  )}
                  <Button
           
                    onClick={() => {
                      signTypedData(account, 293478234)
                      handleCloseUserMenu();
                    }}
                  >
                    Sign In
                  </Button>

             

            </Menu>
            
            <WalletModal />

            <WalletSidebar />
            
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};