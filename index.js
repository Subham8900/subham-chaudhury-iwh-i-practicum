const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "pat-na1-b5ad8d94-c161-4073-92d0-36facca15119";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
app.get("/", async (req, res) => {
  const contacts = "https://api.hubapi.com/crm/v3/objects/2-22478587";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  // In a real application, you would make a GET request to retrieve CRM record data
  // For now, using dummy data
  let crmRecords = {};
  let body = {
    properties: ["income", "name", "superpower"],
    inputs: [],
  };

  try {
    const pageTitle = "CRM Records Homepage";

    const resp = await axios.get(contacts, { headers });
    let id_list = [];
    resp.data.results.map((val, index) => {
      id_list.push(val.id);
    });
    console.log("here data", id_list);
    id_list.map((val, index) => {
      body.inputs.push({ id: val });
    });
    console.log("body data", body);
    const detailResp = await axios.post(
      "https://api.hubapi.com/crm/v3/objects/2-22478587/batch/read",
      body,
      { headers }
    );
    console.log("final data", detailResp.data.results);
    const crmRecords = detailResp.data.results;
    res.render("homepage", { pageTitle, crmRecords });
  } catch (error) {
    console.error(error);
  }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
app.get("/updated-cobj", (req, res) => {
  // Your existing form submission logic here

  // For demonstration purposes, let's redirect to a success page
  res.render("updates");
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here
app.post("/updated-cobj", async (req, res) => {
  // Process form data and create CRM record here
  // Replace the following lines with your CRM record creation logic
  console.log("req", req.body);
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  const { name, income, superPower } = req.body;
  const properties = {
    properties: {
      income: income,
      name: name,
      superpower: superPower,
    },
  };
  // Your CRM record creation logic goes here
  const newDataResp = await axios.post(
    "https://api.hubapi.com/crm/v3/objects/2-22478587",
    properties,
    { headers }
  );
  if (newDataResp) {
    console.log("new resp".newDataResp);
    res.redirect("/");
  }

  // Redirect back to the homepage after creating the CRM record
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
