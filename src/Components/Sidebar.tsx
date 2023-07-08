import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoT from "../LogoT.png";
import LogoLight from "../LogoLight.png";
import "../Components/SidebarStyle.css";
import ThemeToggle from "./ThemeToggle";
import { TbLayoutBoardSplit } from "react-icons/tb";
import { FaEyeSlash } from "react-icons/fa";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalPopUp from "./TaskModal";
import { RootState, store } from "../Store/store";
import {
  openTaskModal,
  openBoardModal,
  openDeleteModal,
} from "../features/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchTrelloData } from "../features/TrelloDataSlice";
import BoardModalPopUp from "./BoardModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteModal from "./DeleteModal";
import { selectBoardId, selectBoardName } from "../features/boardSlice";

const drawerWidth = 300;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 3),
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function Sidebar(props: any) {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme);
  const { boards } = useSelector((state: RootState) => state.trello);
  const selectedBoardName = useSelector((state:RootState)=>state.board.selectedBoardName)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleBoardName = (boardName: string,boardId:any) => {
    dispatch(selectBoardName(boardName));
    dispatch(selectBoardId(boardId));
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    store.dispatch(fetchTrelloData());
  }, []);
  const handleTaskOpen = () => dispatch(openTaskModal());
  const handleBoardOpen = () => dispatch(openBoardModal());
  const handleDeleteModal = () => dispatch(openDeleteModal());

  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: theme === "dark" ? "#2B2C37" : "#fff",
          color: "#000112",
          boxShadow: "0",
          borderBottom: `1px solid ${theme === "dark" ? "#3E3F4E" : "#e4ebfa"}`,
        }}
      >
        <Toolbar>
          <div
            className="logo-wrapper"
            style={{ display: open ? "none" : "flex" }}
          >
            <a href="#logo">
              <img
                src={`${theme === "dark" ? LogoLight : LogoT}`}
                alt="Logo"
                style={{ height: "25px" }}
              />
            </a>
          </div>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              ml: 3,
              display: open ? "none" : "block",
              borderColor: theme === "dark" ? "#3E3F4E" : "#e4ebfa",
            }}
          />
          <div className="appbar">
            <h2
              className="appbar-header"
              style={{
                marginLeft: "20px",
                color: theme === "dark" ? "#fff" : "#000112",
              }}
            >
              {selectedBoardName}
            </h2>
            <div className="addNewTaskBtn-options">
              <Button
                onClick={handleTaskOpen}
                sx={{
                  backgroundColor: "#635FC7",
                  fontSize: "15px",
                  fontWeight: "700",
                  borderRadius: "25px",
                  p: "10px 20px",
                  color: "#fff",
                  textTransform: "none",
                  mr: 2,
                  "&:hover": {
                    backgroundColor: "#A8A4FF",
                  },
                }}
              >
                + Add New Task
              </Button>
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon sx={{ color: "#828FA3" }} />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Fab
        onClick={handleDrawerOpen}
        sx={{
          position: "fixed",
          boxShadow: "0",
          backgroundColor: "#635FC7",
          padding: "0px auto",
          height: "48px",
          width: "56px",
          borderRadius: "0px 40px 40px 0px",
          bottom: (theme) => theme.spacing(5),
          left: (theme) => theme.spacing(-1),
          zIndex: (theme) => theme.zIndex.appBar + 1,
          ...(open && { display: "none" }),
          "&:hover": {
            backgroundColor: "#A8A4FF",
          },
        }}
      >
        <VisibilityIcon sx={{ color: "#fff" }} fontSize="small" />
      </Fab>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme === "dark" ? "#2B2C37" : "#fff",
            borderRight: `1px solid ${
              theme === "dark" ? "#3E3F4E" : "#E4EBFA"
            }`,
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader
          sx={{ backgroundColor: theme === "dark" ? "#2B2C37" : "#fff" }}
        >
          <div className="logo-wrapper">
            <a href="#logo" style={{ marginLeft: "20px" }}>
              <img
                src={`${theme === "dark" ? LogoLight : LogoT}`}
                alt="Logo"
                style={{ height: "25px" }}
              />
            </a>
          </div>
        </DrawerHeader>

        <ListSubheader
          className="all-boards"
          sx={{
            fontWeight: "700",
            fontSize: "12px",
            pt: 2,
            paddingLeft: "42px",
            color: "#828fa3",
            backgroundColor: theme === "dark" ? "#2B2C37" : "#fff",
          }}
        >
          ALL BOARDS <span>({boards.length})</span>
        </ListSubheader>
        <List sx={{ mr: 3 }}>
          {boards.map((text) => (
            <ListItem key={text.id} disablePadding sx={{ pt: 1 }}>
              <ListItemButton
                onClick={()=>handleBoardName(text.name,text.id)}
                className="boards-list"
                sx={{
                  height: "50px",
                  borderRadius: "0 50px 50px 0",
                  "&:hover": {
                    backgroundColor:
                      theme === "dark" ? "#fff" : "rgba(99, 95, 199, 0.1)",
                  },
                  "&:hover p,&:hover .layout-icon": {
                    color: "#635FC7",
                  },
                  "&:focus ": {
                    backgroundColor: "#635FC7",
                  },
                  "&:focus p, &:focus .layout-icon": {
                    color: "#fff",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "45px" }}>
                  <TbLayoutBoardSplit className="layout-icon" />
                </ListItemIcon>
                <p className="text">{text.name}</p>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ pl: 0 }}>
            <ListItemButton
              onClick={handleBoardOpen}
              sx={{
                pl: 5,
                textAlign: "center",
                height: "50px",
                borderRadius: "0 50px 50px 0",
                "&:hover ": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "45px" }}>
                <TbLayoutBoardSplit
                  className="layout-icon"
                  style={{ color: "#635FC7" }}
                />
              </ListItemIcon>
              <p className="text" style={{ color: "#635FC7" }}>
                + Create New Board
              </p>
            </ListItemButton>
          </ListItem>
        </List>
        <ThemeToggle />
        <button
          onClick={handleDrawerClose}
          className={`hide-btn ${
            theme === "dark" ? "dark-mode" : "light-mode"
          }`}
          style={{
            backgroundColor: "transparent",
          }}
        >
          <FaEyeSlash
            style={{ color: "#828FA3", fontSize: "22px" }}
            className="hidden-icon"
          />
          <p className="text">Hide Sidebar</p>
        </button>
      </Drawer>
      <Main
        open={open}
        sx={{
          minHeight: "100vh",
        }}
      >
        {props.children}
        <ModalPopUp />
        <BoardModalPopUp />
        <div className="menu-modal">
          <Menu
            id="basic-menu"
            open={menuOpen}
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{
              "& .MuiMenu-paper": {
                backgroundColor: theme === "dark" ? "#20212C" : "#FFF",
              },
            }}
          >
            <MenuItem className="edit-board">Edit Board</MenuItem>
            <MenuItem className="delete-board" onClick={handleDeleteModal}>
              Delete Board
            </MenuItem>
          </Menu>
        </div>
        <DeleteModal/>
      </Main>
    </Box>
  );
}
