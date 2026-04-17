if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const bookingRouter = require("./routes/bookings.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl =
  process.env.ATLASDB_URL ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

function resolveLocalImageByFilename(fileName) {
  if (!fileName) return null;

  const encodedName = encodeURIComponent(fileName);
  const candidateRoots = [
    { dir: path.join(__dirname, "public", "gallery"), webPath: "/gallery" },
    { dir: path.join(__dirname, "public", "images"), webPath: "/images" },
    { dir: path.join(__dirname, "public", "uploads"), webPath: "/uploads" },
    { dir: path.join(__dirname, "uploads"), webPath: "/uploads" },
  ];

  for (const candidate of candidateRoots) {
    const fullPath = path.join(candidate.dir, fileName);
    if (fs.existsSync(fullPath)) {
      return `${candidate.webPath}/${encodedName}`;
    }
  }

  return null;
}

function resolveImageUrl(imageLike, fallback = "/gallery/img1.png") {
  const raw =
    typeof imageLike === "string" ? imageLike : imageLike?.url || "";
  const normalized = String(raw).trim().replace(/\\/g, "/");

  if (!normalized) return fallback;

  const lower = normalized.toLowerCase();
  const isRemote =
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("//") ||
    lower.startsWith("data:") ||
    lower.startsWith("blob:");
  if (isRemote) return normalized;

  const stripLeading = normalized.replace(/^\.?\//, "");
  const lowerStrip = stripLeading.toLowerCase();

  if (lowerStrip.startsWith("public/")) {
    return `/${stripLeading.slice(7)}`;
  }
  if (lowerStrip.startsWith("gallery/")) {
    return `/${stripLeading}`;
  }
  if (lowerStrip.startsWith("uploads/")) {
    return `/${stripLeading}`;
  }
  if (lowerStrip.startsWith("images/")) {
    return `/${stripLeading}`;
  }
  if (normalized.startsWith("/")) {
    return normalized;
  }

  const cleanPath = normalized.split("?")[0].split("#")[0];
  const fileName = path.basename(cleanPath);
  const localByName = resolveLocalImageByFilename(fileName);
  if (localByName) return localByName;

  return fallback;
}


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,
});


store.on("error",(err)=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire: Date.now() + 3 * 24 * 60 * 60 * 1000,
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
};


// middlewares
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser= req.user;
  res.locals.resolveImageUrl = resolveImageUrl;
  res.locals.listingFallbackImage = "/gallery/img1.png";
  res.locals.avatarFallbackImage = "/gallery/img10.png";
  next();
});


// root route - MOVED HERE (after all middleware)
app.get("/", (req, res) => {
  res.redirect("/listings");
});


// use all routes 
app.use("/listings",listingRouter);
// use all review routes
app.use("/listings/:id/reviews",reviewRouter);
// use all bookings routes 
app.use("/bookings", bookingRouter);

app.use("/",userRouter);




// catch-all route for 404
app.all("/*splat", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


// centralized error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
//   res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});


if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`server is listening to port ${PORT}`);

    if (process.env.NODE_ENV !== "production" && process.env.AUTO_OPEN_BROWSER !== "false") {
      const url = `http://localhost:${PORT}`;
      const openCmd =
        process.platform === "win32"
          ? `start "" "${url}"`
          : process.platform === "darwin"
          ? `open "${url}"`
          : `xdg-open "${url}"`;

      exec(openCmd, (err) => {
        if (err) {
          console.warn(`Could not auto-open browser: ${err.message}`);
        }
      });
    }
  });
}

module.exports = app;


