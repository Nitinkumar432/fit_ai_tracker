import { useState, useMemo, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Box, useMediaQuery } from "@mui/material";
import { Footer } from "../components/Footer";
import theme from "../theme";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { useAuth } from "../utils/AuthProvider.jsx";
import DashboardIcon from "/assets/icon-dashboard.svg";
import TrainingIcon from "/assets/icon-training.svg";
import LearningIcon from "/assets/icon-learning.svg";
import ProfileIcon from "/assets/icon-profile.svg";
import Notifications from "../components/Notifications.jsx";
import bodybuddyLogoDesktop from "/assets/bodybuddy.svg";
import bodybuddyLogoMobile from "/assets/bodybuddy_logo_color.svg";
import { getUser } from "../controllers/UserController.js";
import "./MainLayout.css";

// Links to display in the left Navbar
const NavBar = [
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: (
      <img
        src={DashboardIcon}
        alt="Dashboard Icon"
        style={{ width: "24px", height: "24px" }}
      />
    ),
  },
  {
    segment: "training",
    title: "Training",
    icon: (
      <img
        src={TrainingIcon}
        alt="Training Icon"
        style={{ width: "24px", height: "24px" }}
      />
    ),
  },
  {
    segment: "learning",
    title: "Learning",
    icon: (
      <img
        src={LearningIcon}
        alt="Learning Icon"
        style={{ width: "24px", height: "24px" }}
      />
    ),
  },
  {
    segment: "profile",
    title: "Profile",
    icon: (
      <img
        src={ProfileIcon}
        alt="Profile Icon"
        style={{ width: "24px", height: "24px" }}
      />
    ),
  },
];

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleSignOut } = useAuth();
  
  const [session, setSession] = useState({
    user: {
      name: "",
      email: "",
      image: "",
    },
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await getUser(user, false);
        setSession({
          user: {
            name: response.name,
            email: user.email,
            image: response.picture,
          },
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUserInfo();
  }, [user]);

const isMobile = useMediaQuery("(max-width:600px)");
const logoSource = isMobile ? bodybuddyLogoMobile : bodybuddyLogoDesktop;

const authentication = useMemo(() => {
    return {
      signIn: () => {
        navigate("/dashboard");
      },
      signOut: () => {
        handleSignOut();
      },
    };
  }, []);

 const router = {
    pathname: location.pathname,
    searchParams: new URLSearchParams(location.search),
    navigate: (path) => {
      navigate(path);
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppProvider
        theme={theme}
        branding={{
          logo: <img src={logoSource} alt="Fit-Front" />,
          title: "",
        }}
        session={session}
        authentication={authentication}
        navigation={NavBar}
        router={router}
      >
        <DashboardLayout
          disableCollapsibleSidebar
          slots={{ toolbarActions: Notifications }}
          sx={{ position: "relative", backgroundColor: "background.default" }}
        >
          <Box sx={{ margin: 2, flexGrow: 1 }}>
            <Outlet />
          </Box>
          <Footer />
        </DashboardLayout>
      </AppProvider>
    </Box>
  );
};
