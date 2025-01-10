require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./config/database");
const response = require("./response");

// const { format } = require("date-fns");
const now = new Date().toISOString().split("T")[0];

// const cors = require("cors");
// app.use(cors());

const {
  selectProject,
  selectbanner,
  getProjectDetail,
  insertProjectBatch,
  insertProject,
  updateProject,
  deleteProject,
} = require("./model/projectModel");

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const data = await selectbanner();
    response(200, data, "Success retrieving projects", res);
  } catch (err) {
    response(500, null, "Failed to retrieve projects", res);
  }
});

app.get("/project", async (req, res) => {
  try {
    const data = await selectProject();
    response(200, data, "Success retrieving projects", res);
  } catch (err) {
    response(500, null, "Failed to retrieve projects", res);
  }
});

app.post("/project/detail", async (req, res) => {
  const { id } = req.body;
  const data = await getProjectDetail(id);

  if (!id) {
    return res.status(400).send({ error: "ID is required" });
  } else {
    try {
      const data = await getProjectDetail(id);

      response(200, data, "Success retrieving projects", res);
    } catch (err) {
      response(500, null, "Failed to retrieve projects", res);
    }
  }
});

app.post("/project/insert", async (req, res) => {
  const { name, shortDescription, description, dirImage, url } = req.body;
  const createdAt = now;
  const updatedAt = now;
  try {
    const data = await insertProject(
      name,
      shortDescription,
      description,
      dirImage,
      url,
      createdAt,
      updatedAt
    );

    if (data.rowCount != 0) {
      const resData = {
        isSuccess: true,
        id: data.id,
      };
      response(200, resData, "Success inserting project", res);
    } else {
      const resData = {
        isSuccess: false,
        id: 0,
      };
      response(400, resData, "Failed to insert project", res);
    }
  } catch (err) {
    response(500, null, "Failed to retrieve projects", res);
  }
});

app.post("/project/insert_batch", async (req, res) => {
  const project = req.body;

  const dataProject = project.map((project) => ({
    name: project.name,
    shortDescription: project.shortDescription,
    description: project.description,
    dirImage: project.dirImage,
    url: project.url,
    createdAt: now,
    updatedAt: now,
  }));

  try {
    const data = await insertProjectBatch(dataProject);

    console.log(data);
    if (data.rowCount != 0) {
      const resData = {
        isSuccess: true,
        id: data.id,
      };
      response(200, resData, "Success inserting project", res);
    } else {
      const resData = {
        isSuccess: false,
        id: 0,
      };
      response(400, resData, "Failed to insert project", res);
    }
  } catch (err) {
    response(500, null, "Failed to retrieve projects", res);
  }
});

app.put("/project/update", async (req, res) => {
  const { id, name, shortDescription, description, dirImage, url } = req.body;
  const updatedAt = now;
  try {
    const data = await updateProject(
      id,
      name,
      shortDescription,
      description,
      dirImage,
      url,
      updatedAt
    );

    if (data.rowCount != 0) {
      const resData = {
        isSuccess: true,
        id: id,
      };
      response(200, resData, "Success updating project", res);
    } else {
      const resData = {
        isSuccess: false,
        id: 0,
      };
      response(400, resData, "Failed to update project", res);
    }
  } catch (err) {
    response(500, null, "Failed to update projects", res);
  }
});

app.delete("/project/delete", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).send({ error: "ID is required" });
  } else {
    try {
      const data = await deleteProject(id);
      if (data.rowCount == 0) {
        const resData = {
          isSuccess: false,
          id: 0,
        };
        response(400, resData, "Failed to delete project", res);
      } else {
        const resData = {
          isSuccess: true,
          id: id,
        };
        response(200, resData, "Success delete projects", res);
      }
    } catch (err) {
      response(500, null, "Failed to retrieve projects", res);
    }
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
