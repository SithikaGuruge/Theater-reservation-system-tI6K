import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import SearchBar from "./Searchbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
const TheatreCard = (props) => {
  return (
    <div>
      <div
        className={`theatre-card w-80 h-auto relative overflow-hidden transition-transform duration-300 hover:scale-105 ${
          props.is_active ? "" : "inactive"
        }`}
      >
        <div className="relative transition-opacity duration-300 hover:opacity-75 rounded-xl mt-4 w-80 h-96">
          <Link to={`/theatre/${props.id}`}>
            <img
              src={props.image_url}
              alt={props.name}
              className="object-cover w-full h-full rounded-xl"
              onError={(e) =>
                (e.target.src =
                  "https://blog.bbt4vw.com/wp-content/uploads/2021/05/sorry-we-are-closed-sign-on-door-store-business-vector-27127112-1.jpg")
              }
            />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-gray-900 to-transparent cursor-pointer group-hover:opacity-50">
          <h3 className="text-xl font-bold mb-2 text-white">{props.name}</h3>
          <p className="text-white font-thin">{props.details}</p>
        </div>
      </div>
    </div>
  );
};

const TheatreList = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const particlesInit = useCallback(async (engine) => {
    console.log(engine);

    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    await console.log(container);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/theatres");
        setData(response.data);
      } catch (error) {
        setError(error.message);
        //navigate("/login", { state: { from: location }, replace: true });
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress
            sx={{ "svg circle": { stroke: "url(#my_gradient)" } }}
          />
        </Backdrop>
      </React.Fragment>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GradientCircularProgress /> {/* Loading spinner */}
      </div>
    );
  }

  if (error.length > 0) {
    console.log(error);
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredTheatres = data.filter((theatre) =>
    theatre.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Determine the number of cards to show
  const theatresToShow = showAll
    ? filteredTheatres
    : filteredTheatres.slice(0, 8);

  return (
    <div className="py-16 mb-10">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#09081d",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "repulse", // Adds the repulse effect on hover
              },
              resize: true, // Adjusts to screen resize
            },
            modes: {
              repulse: {
                distance: 200, // Distance particles repulse from the cursor
                duration: 0.4, // Duration of the repulse effect
              },
            },
          },
          particles: {
            number: {
              value: 90, // Number of particles
              density: {
                enable: true,
                value_area: 800, // Density of particles in the canvas
              },
            },
            color: {
              value: "#ffffff", // Particle color
            },
            shape: {
              type: "circle", // Shape of particles
            },
            opacity: {
              value: 0.5, // Opacity of particles
              random: true, // Randomize opacity
            },
            size: {
              value: 5, // Size of particles
              random: true, // Randomize size
            },
            move: {
              enable: true, // Enable particle movement
              speed: 3, // Speed of movement
              direction: "none", // No specific direction
              random: false, // Not random movement
              straight: false, // Not moving in a straight line
              out_mode: "bounce", // Particles bounce when reaching canvas edges
              attract: {
                enable: false, // Disable particle attraction
              },
            },
          },
          detectRetina: true,
        }}
      />

      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: "#111827" }}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 5,
                marginLeft: {
                  xs: 1, // Margin for extra small screens
                  sm: 10, // Margin for small screens and up
                },
                fontSize: {
                  xs: "12px", // Font size for extra small screens
                  sm: "20px", // Default font size for small screens and up
                },
              }}
            >
              Theatres
            </Typography>
            <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          </Toolbar>
        </AppBar>
      </Box>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center mx-auto">
        {theatresToShow.length > 0 ? (
          theatresToShow.map((theatre) => (
            <TheatreCard
              key={theatre.id}
              id={theatre.id}
              name={theatre.name}
              details={theatre.details}
              image_url={theatre.image_url}
              is_active={theatre.is_active}
            />
          ))
        ) : (
          <p className="text-white">No theatres found.</p>
        )}
      </div>

      {!showAll && filteredTheatres.length > 8 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-10"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default TheatreList;
