exports.index = (req, res) => {
  res.render("index");
};

exports.login = (req, res) => {
  res.render("login", { title: "Login | BlogApp" });
};

exports.register = (req, res) => {
  res.render("register", { title: "Login | NodeApp" });
};
