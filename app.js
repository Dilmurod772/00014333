const express = require("express");
const app = express();
const fs = require("fs");

app.set("view engine", "pug");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const address = req.body.address;
  const emailAddress = req.body.emailAddress;
  const phoneNumber = req.body.phoneNumber;
  const level = req.body.level;
  const courseTitle = req.body.courseTitle;

  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    level.trim() === "" ||
    courseTitle.trim() === "" ||
    address.trim() === "" ||
    phoneNumber.trim() === ""
  ) {
    res.render("create", { error: true });
  } else {
    fs.readFile("./data/students.json", (err, data) => {
      if (err) throw err;

      const students = JSON.parse(data);

      students.push({
        id: id(),
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        address: address,
        emailAddress: emailAddress,
        phoneNumber: phoneNumber,
        level: level,
        courseTitle: courseTitle,
      });

      fs.writeFile("./data/students.json", JSON.stringify(students), (err) => {
        if (err) throw err;

        res.render("create");
      });
    });
  }
});

app.get("/students", (req, res) => {
  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;

    const students = JSON.parse(data);

    res.render("students", { students: students });
  });
});

app.get("/students/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;

    const students = JSON.parse(data);

    const student = students.filter((student) => student.id == id)[0];

    res.render("read", { student: student });
  });
});

app.get("/students/delete/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;

    const students = JSON.parse(data);

    const filteredData = students.filter((student) => student.id != id);

    fs.writeFile(
      "./data/students.json",
      JSON.stringify(filteredData),
      (err) => {
        if (err) throw err;

        res.render("students", { students: filteredData });
      }
    );
  });
});

app.get("/edit/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/students.json", (err, data) => {
    if (err) throw err;

    const students = JSON.parse(data);

    const student = students.find((student) => student.id == id);

    res.render("edit", { student: student });
  });
});

app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const middleName = req.body.middleName;
  const emailAddress = req.body.emailAddress;
  const phoneNumber = req.body.phoneNumber;
  const level = req.body.level;
  const courseTitle = req.body.courseTitle;

  if (
    firstName.trim() === "" ||
    lastName.trim() === "" ||
    level.trim() === "" ||
    courseTitle.trim() === "" ||
    phoneNumber.trim() === ""
  ) {
    console.log("error");
  } else {
    fs.readFile("./data/students.json", (err, data) => {
      if (err) throw err;

      let students = JSON.parse(data);
      let student = students.find((student) => student.id == id);
      let itemId = parseInt(students.indexOf(student));

      students[itemId].firstName = firstName;
      students[itemId].lastName = lastName;
      students[itemId].middleName = middleName;
      students[itemId].emailAddress = emailAddress;
      students[itemId].phoneNumber = phoneNumber;
      students[itemId].level = level;
      students[itemId].courseTitle = courseTitle;

      fs.writeFile(
        "./data/students.json",
        JSON.stringify(students),
        (err) => {
          if (err) throw err;

          res.render("edit", { student: students[itemId], success: true });
        }
      );
    });
  }
});

app.listen(3000, (error) => {
  if (error) console.log(error);

  console.log("Server is running on port 3000");
});

// creating a random id for each data
var id = () => {
  return "_" + Math.random().toString(36).substring(2, 9);
};
