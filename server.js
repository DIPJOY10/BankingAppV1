require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

//global vars

var userId, memberCode, showID;
var user_name,
  user_address,
  user_PIN,
  user_voter,
  user_adhar,
  user_dob,
  user_phone,
  user_email;
var loanUserName,
  loanUserAddress,
  loanUserPIN,
  loanUserVoter,
  loanUserAdhar,
  loanUserDob,
  loanUserPhone,
  loanUserEmail,
  loanUserPan;

//middlewares
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//dbconfig
const connection_url =
  "mongodb+srv://admin-dipjoy:" +
  process.env.PASSWORD +
  "@cluster0.e43id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/usersDB";
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// mongoose.connect("mongodb+srv://Rana619:Rana@1702@cluster0.lzo1o.mongodb.net/toDoList",{ useUnifiedTopology: true , useNewUrlParser: true  });

//mongo "mongodb+srv://cluster0.e43id.mongodb.net/myFirstDatabase" --username admin-dipjoy

const userSchema = new mongoose.Schema({
  //initial member creation form
  userName: String,
  fName: String,
  address: String,
  phone: Number,
  pin: Number,
  pan: String,
  voter: String,
  adhar: Number,
  email: String,
  dob: String,
  //from deposit entry form

  depositType: String,
  depositAmount: Number,
  depositTimePeriod: Number,
  maturityAmount: Number,
  totalDepositAmount: Number,
  nominiName: String,
  nominiRelationship: String,
  nominiAge: Number,
  nominiProof: String,
  maturityType: String,
  refNumber: String,

  //from loanEntry form
  monthlyIncome: Number,
  occupation: String,
  loanAmount: Number,
  creditScore: Number,
  sanctionAmountLoan: Number,
  loanPeriod: Number,
  loanType: String,
  loanColateral: String,
  colateralAmount: Number,
  installmentAmount: Number,
  loanPaymentType: String,

  //from emiEntry form
  loanApplicantName: String,
  branchName: String,
  loanAccountNumber: String,
  loanCategory: String,
  loanSubCategory: String,
  loanPlanCode: String,
  loanApprovedAmount: Number,
  loanTenure: Number,
  loanPaymentMode: String,
  noInstallments: Number,
  loanInterestAmount: Number,
  totalPayable: Number,
  loanEmiAmount: Number,
  loanProcessingCharge: Number,
  loanOtherCharges: Number,
  loanInterestRate: Number,
  loanInterestType: String,
  loanAdvisorName: String,
  city: String,
  state: String,
  loanNarration: String,
});

const User = mongoose.model("User", userSchema);

const adminSchema = new mongoose.Schema({
  userName: { type: String },
  passWord: { type: String },
});

const secret = "ThisIsOurLittleSecret.";
adminSchema.plugin(encrypt, { secret: secret, encryptedFields: ["passWord"] });

const Admin = new mongoose.model("Admin", adminSchema);

// const newAdmin = new Admin({
//   userName: "admin-dj",
//   passWord: "dj123",
// });

// newAdmin.save();

//home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home.html");
});

//success route
app.get("/success", (req, res) => {
  res.render("success", {
    showID: showID,
  });
  showID = "";
});

//login route
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post("/login", (req, res) => {
  Admin.findOne({ userName: req.body.name }, (err, gotAdmin) => {
    if (!err && gotAdmin) {
      if (gotAdmin.passWord === req.body.password) {
        res.sendFile(__dirname + "/Tab.html");
      } else {
        res.sendFile(__dirname + "/login.html");
      }
    } else {
      res.sendFile(__dirname + "/login.html");
    }
  });
});

//tab route
// app.post("/Tab", (req, res) => {
//   //parse usename and password

//   //redirect to the route
//   res.redirect("/Tab");
// });

//member route
app.get("/Tab/member", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});

app.post("/memberRegister", (req, res) => {
  const user = new User({
    userName: req.body.userName,
    fName: req.body.fName,
    address: req.body.address,
    phone: req.body.phone,
    pin: req.body.pin,
    pan: req.body.pan,
    voter: req.body.voter,
    adhar: req.body.adhar,
    email: req.body.email,
    dob: req.body.dob,
  });
  User.insertMany(user, (docs) => {
    if (docs) {
      showID = docs.insertedDocs[0]._id;
      res.redirect("/success");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

//deposit route
app.get("/Tab/deposit", (req, res) => {
  res.render("deposit", {
    user_name: user_name,
    user_address: user_address,
    user_PIN: user_PIN,
    user_voter: user_voter,
    user_adhar: user_adhar,
    user_dob: user_dob,
    user_phone: user_phone,
    user_email: user_email,
  });
});

app.post("/search", (req, res) => {
  //autofill the auto_form by searching in the database
  userId = req.body.uniqueId;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      res.redirect("/Tab/deposit");
    } else {
      user_name = user.userName;
      user_address = user.address;
      user_PIN = user.pin;
      user_voter = user.voter;
      user_adhar = user.adhar;
      user_email = user.email;
      user_dob = user.dob;
      user_phone = user.phone;
      res.redirect("/Tab/deposit");
    }
  });
});

app.post("/Tab/deposit/save", (req, res) => {
  //save the new fields under the searched ID
  User.updateOne(
    { _id: userId },
    {
      depositType: req.body.depositType,
      depositAmount: req.body.depositAmount,
      depositTimePeriod: req.body.depositTimePeriod,
      maturityAmount: req.body.maturityAmount,
      totalDepositAmount: req.body.totalDepositAmount,
      nominiName: req.body.nominiName,
      nominiRelationship: req.body.nominiRelationship,
      nominiAge: req.body.nominiAge,
      nominiProof: req.body.nominiProof,
      maturityType: req.body.maturityType,
      refNumber: req.body.refNumber,
    },
    (err) => {
      if (err) {
        res.sendFile(__dirname + "/failure.html");
      } else {
        userId = "";
        user_name = "";
        user_address = "";
        user_PIN = "";
        user_voter = "";
        user_adhar = "";
        user_dob = "";
        user_phone = "";
        user_email = "";
        res.redirect("/success");
      }
    }
  );
});

//loan route
app.get("/Tab/loan", (req, res) => {
  res.sendFile(__dirname + "/loan.html");
});

//loan entry route under loan route
app.get("/Tab/loan/NewLoanEntry", (req, res) => {
  res.render("loanEntry", {
    loanUserName: loanUserName,
    loanUserAddress: loanUserAddress,
    loanUserPIN: loanUserPIN,
    loanUserVoter: loanUserVoter,
    loanUserAdhar: loanUserAdhar,
    loanUserDob: loanUserDob,
    loanUserPhone: loanUserPhone,
    loanUserEmail: loanUserEmail,
    loanUserPan: loanUserPan,
  });
});

app.post("/NewLoanEntry/search", (req, res) => {
  memberCode = req.body.memberCode;
  User.findOne({ _id: memberCode }, (err, user) => {
    if (err) {
      console.log(err);
      res.redirect("/Tab/loan/NewLoanEntry");
    } else {
      loanUserName = user.userName;
      loanUserAddress = user.address;
      loanUserPIN = user.pin;
      loanUserVoter = user.voter;
      loanUserAdhar = user.adhar;
      loanUserEmail = user.email;
      loanUserDob = user.dob;
      loanUserPhone = user.phone;
      loanUserPan = user.pan;
      res.redirect("/Tab/loan/NewLoanEntry");
    }
  });
});

app.post("/Tab/loan/NewLoanEntry/save", (req, res) => {
  User.updateOne(
    { _id: memberCode },
    {
      monthlyIncome: req.body.monthlyIncome,
      occupation: req.body.occupation,
      loanAmount: req.body.loanAmount,
      creditScore: req.body.creditScore,
      sanctionAmountLoan: req.body.sanctionAmountLoan,
      loanPeriod: req.body.loanPeriod,
      loanType: req.body.loanType,
      loanColateral: req.body.loanColateral,
      colateralAmount: req.body.colateralAmount,
      installmentAmount: req.body.installmentAmount,
      loanPaymentType: req.body.loanPaymentType,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.sendFile(__dirname + "/failure.html");
      } else {
        memberCode = "";
        monthlyIncome = "";
        occupation = "";
        loanAmount = "";
        creditScore = "";
        sanctionAmountLoan = "";
        loanPeriod = "";
        loanType = "";
        loanColateral = "";
        colateralAmount = "";
        installmentAmount = "";
        loanPaymentType = "";
        res.redirect("/success");
      }
    }
  );
});

//emi entry route under loan route
app.get("/Tab/loan/EMIentry", (req, res) => {
  res.sendFile(__dirname + "/emiEntry.html");
});

app.post("/Tab/loan/EMIentry/save", (req, res) => {
  User.updateOne(
    { _id: req.body.memberID },
    {
      loanApplicantName: req.body.loanApplicantName,
      branchName: req.body.branchName,
      loanAccountNumber: req.body.loanAccountNumber,
      loanCategory: req.body.loanCategory,
      loanSubCategory: req.body.loanSubCategory,
      loanPlanCode: req.body.loanPlanCode,
      loanApprovedAmount: req.body.loanApprovedAmount,
      loanTenure: req.body.loanTenure,
      loanPaymentMode: req.body.loanPaymentType,
      noInstallments: req.body.noInstallments,
      loanInterestAmount: req.body.loanInterestAmount,
      totalPayable: req.body.totalPayable,
      loanEmiAmount: req.body.loanEmiAmount,
      loanProcessingCharge: req.body.loanProcessingCharge,
      loanOtherCharges: req.body.loanOtherCharges,
      loanInterestRate: req.body.loanInterestRate,
      loanInterestType: req.body.loanInterestType,
      loanAdvisorName: req.body.loanAdvisorName,
      city: req.body.city,
      state: req.body.state,
      loanNarration: req.body.loanNarration,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.sendFile(__dirname + "/failure.html");
      } else {
        res.redirect("/success");
      }
    }
  );
});

//report route
app.get("/Tab/report", (req, res) => {
  res.render("reportCard", {
    dataType: "",
    getUser: "",
  });
});

app.post("/Tab/report/search", (req, res) => {
  User.findOne({ _id: req.body.memberCode }, (err, getUser) => {
    res.render("reportCard", {
      dataType: req.body.reportType,
      getUser: getUser,
    });
  });
});

//port

app.listen(process.env.PORT || 3500, function () {
  console.log("server running on port 3500");
});
