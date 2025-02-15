import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { setPageTitle } from "../utils/utils";
import { supabase } from "../utils/supabaseClient";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider.jsx";
import { Button, TextField, Box, Typography, Container } from "@mui/material";
import Grid from "@mui/material/Grid2";
import bodybuddyLogo from "/assets/bodybuddy_logo_color.svg";
import { Onboarding } from "../components/Onboarding";

export const SignIn = (props) => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle(props.title);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Grid container sx={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <Grid
        size={{ sm: 12, md: 6 }}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Onboarding />
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: '#000000',
            color: '#ffffff',
          }}
        >
          <Box sx={{ margin: "0 auto", textAlign: "center" }}>
            <Box sx={{ mb: 1 }}>
              <img src={bodybuddyLogo} alt="BodyBuddy Logo" width={60} />
            </Box>

            <Typography variant="h4" sx={{ marginBottom: 2 }}>Welcome back!</Typography>

            <Typography component="h1" variant="h3" sx={{ mb: 2 }}>Sign In</Typography>

            <Box sx={{ width: { xs: "80%", sm: "50%" }, margin: "0 auto" }}>
              <Box component="form" noValidate onSubmit={handleSignIn} sx={{ mt: 1 }}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff', borderColor: '#ffffff' } }}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff', borderColor: '#ffffff' } }}
                />
                {error && <Typography color="error">{error}</Typography>}

                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 2,
                    background: 'linear-gradient(80deg, #d41169, #2451d8)',
                    color: '#ffffff',
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>

        <Box sx={{ mx: 4 }}>
          <Typography variant="body2" sx={{ marginBottom: 1 }}>
            Don&apos;t have an account?{' '}
            <Button
              variant="text"
              component={NavLink}
              to="/create-program"
              sx={{ color: '#ffffff', fontWeight: 700 }}
              onClick={() => localStorage.setItem("currentSlide", 0)}
            >
              Start here
            </Button>
          </Typography>

          <Typography variant="body2" sx={{ lineHeight: 1.3, marginLeft: 2, marginRight: 2 }}>
            BodyBuddy provides general fitness guidance and real-time feedback for form improvement. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your physician before starting a new exercise program, especially if you have any pre-existing medical conditions.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

SignIn.propTypes = {
  title: PropTypes.string,
};
