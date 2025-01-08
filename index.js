const express = require("express");
const app = express();
const db = require("./config/database");
const response = require("./response");

const {
  selectProject,
  selectbanner,
  getProjectDetail,
} = require("./model/projectModel");

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const projects = await selectbanner();
    console.log(projects);
    response(200, projects, "Success retrieving projects", res);
  } catch (err) {
    response(500, null, "Failed to retrieve projects", res);
  }
});
app.get("/project", async (req, res) => {
  try {
    const projects = await selectProject();
    console.log(projects);
    response(200, projects, "Success retrieving projects", res);
  } catch (err) {
    response(500, null, "Failed to retrieve projects", res);
  }
});

app.post("/project_detail", async (req, res) => {
  const { id } = req.body;
  const projects = await getProjectDetail(id);
  console.log(projects);
  if (!id) {
    return res.status(400).send({ error: "ID is required" });
  } else {
    try {
      const projects = await getProjectDetail(id);
      console.log(projects);
      response(200, projects, "Success retrieving projects", res);
    } catch (err) {
      response(500, null, "Failed to retrieve projects", res);
    }
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
