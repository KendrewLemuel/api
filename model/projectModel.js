const db = require("../config/database");

const selectProject = () => {
  return new Promise((resolve, reject) => {
    const q = `SELECT * FROM project`;

    db.query(q, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.rows);
    });
  });
};

const insertProjectBatch = (projects) => {
  return new Promise((resolve, reject) => {
    // Map data menjadi string SQL untuk setiap baris
    const values = projects
      .map(
        (p) =>
          `('${p.name}', '${p.shortDescription}', '${p.description}', '${p.dirImage}', '${p.url}', '${p.createdAt}', '${p.updatedAt}')`
      )
      .join(", ");

    // Query batch insert
    const q = `
      INSERT INTO project (name, short_description, description, dir_image, url, created_at, updated_at)
      VALUES ${values}
      RETURNING id;
    `;

    // Eksekusi query
    db.query(q, (err, results) => {
      if (err) {
        return reject(err); // Jika ada error, reject promise
      }
      resolve({
        rowCount: results.rowCount, // Jumlah baris yang berhasil dimasukkan
        id: results.rows.map((row) => row.id), // Ambil semua id yang di-return
      });
    });
  });
};

const insertProject = (
  name,
  shortDescription,
  description,
  dirImage,
  url,
  createdAt,
  updatedAt
) => {
  return new Promise((resolve, reject) => {
    const q = `
      INSERT INTO project (name, short_description, description, dir_image, url, created_at, updated_at)
      VALUES ('${name}', '${shortDescription}','${description}', '${dirImage}', '${url}', '${createdAt}', '${updatedAt}')
      RETURNING id;
    `;

    console.log(q);

    db.query(q, (err, results) => {
      console.log(results);
      if (err) {
        return reject(err);
      }
      resolve({
        rowCount: results.rowCount,
        id: results.rows[0].id,
      });
    });
  });
};
const updateProject = (
  id,
  name,
  shortDescription,
  description,
  dirImage,
  url,
  updatedAt
) => {
  return new Promise((resolve, reject) => {
    const q = `
      UPDATE  project
      SET name  = '${name}', short_description =  '${shortDescription}',description = '${description}', 
      dir_image  = '${dirImage}', url = '${url}', updated_at ='${updatedAt}'
      WHERE id = ${id}
    `;

    db.query(q, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.rowCount);
    });
  });
};

const getProjectDetail = (projectId) => {
  return new Promise((resolve, reject) => {
    const q = `
      SELECT 
        p.id AS project_id,
        p.name AS project_name,
        p.short_description,
        p.description,
        p.dir_image,
        p.url,
        p.created_at,
        p.updated_at,
        pi.id AS image_id,
        pi.image_url
      FROM project p
      LEFT JOIN project_image pi ON pi.parent_id = p.id
      WHERE p.id = $1
    `;

    db.query(q, [projectId], (err, results) => {
      if (err) {
        return reject(err);
      }
      if (results.rows.length === 0) {
        return resolve(null);
      }

      const project = {
        id: results.rows[0].project_id,
        name: results.rows[0].project_name,
        short_description: results.rows[0].short_description,
        description: results.rows[0].description,
        dir_image: results.rows[0].dir_image,
        url: results.rows[0].url,
        created_at: results.rows[0].created_at,
        updated_at: results.rows[0].updated_at,
        images: results.rows
          .filter((row) => row.image_id)
          .map((row) => ({
            id: row.image_id,
            image_url: row.image_url,
          })),
      };

      resolve(project);
    });
  });
};

const selectbanner = () => {
  return new Promise((resolve, reject) => {
    const q = `SELECT * FROM banner`;

    db.query(q, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.rows);
    });
  });
};

const deleteProject = (id) => {
  return new Promise((resolve, reject) => {
    const q = `DELETE  FROM project WHERE id = ${id}`;

    db.query(q, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  selectProject,
  selectbanner,
  getProjectDetail,
  insertProjectBatch,
  insertProject,
  updateProject,
  deleteProject,
};
