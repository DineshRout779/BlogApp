const mysql = require("mysql");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

// auth login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const statement = "SELECT * FROM users where email = ?";

    db.query(statement, [email], (err, results) => {
      console.log(results.length);
      if (err) {
        console.log(err);
      }
      // if account doesn't exists
      if (results.length === 0) {
        res.render("login", { message: "Account does not exists" });
      } else {
        let hash = results[0].password;
        // check entered pw with pw in stored in db
        bcrypt.compare(password, hash, function (err, result) {
          // execute code to test for access and login
          hasAccess(result, results);
        });
      }
    });

    const hasAccess = (result, results) => {
      if (result) {
        // account found
        const id = results[0].id;
        // generating token
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        console.log(`token is ${token}`);
        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
          ),
          httpOnly: true,
        };

        res.cookie("jwt", token, cookieOptions);
        return res.status(200).redirect("/dashboard");
      } else {
        // access denied
        res.render("login", { message: "Incorrect email or password" });
      }
    };
  } catch (error) {
    console.log(error);
  }
};

// auth register
exports.register = (req, res) => {
  console.log(req.body);
  const { name, email, password, passwordConfirm } = req.body;
  db.query(
    "SELECT email FROM users WHERE email = ? ",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "That email has already been use!",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Passwords do not match!",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8, (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          console.log(hash);
        }
      });

      db.query(
        "INSERT INTO users SET ?",
        { name: name, email: email, password: hashedPassword },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            return res.render("register", {
              message: "User registered ",
              content: "<a href='/login' class='def-a'>Login</a>",
            });
          }
        }
      );
    }
  );
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  console.log("logged out");
  res.redirect("/");
};

exports.adminViewBlogs = (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  const { user, pass, key } = req.body;
  let blogs = [];
  if (
    user === process.env.ADMIN_USERNAME &&
    pass === process.env.ADMIN_PASSWORD &&
    key === process.env.ADMIN_KEYWORD
  ) {
    let query_posts = "SELECT * FROM posts";
    db.query(query_posts, (error, results) => {
      if (error) {
        console.log(error);
      }
      blogs = [...results];
      res.render("adminViewBlogs", {
        title: "Dashboard - Blogs | Admin",
        blogs,
      });
    });
  } else {
    res.render("error", { title: "Error 404" });
  }
};

exports.adminViewUsers = (req, res) => {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  const { user, pass, key } = req.body;
  let users = [];
  if (
    user === process.env.ADMIN_USERNAME &&
    pass === process.env.ADMIN_PASSWORD &&
    key === process.env.ADMIN_KEYWORD
  ) {
    let query_users = "SELECT * FROM users";
    db.query(query_users, (error, results) => {
      if (error) {
        console.log(error);
      }
      users = [...results];
      res.render("adminViewUsers", {
        title: "Dashboard - Users | Admin",
        users,
      });
    });
  } else {
    res.render("error", { title: "Error 404" });
  }
};
