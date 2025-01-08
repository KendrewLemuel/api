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

module.exports = { selectProject, selectbanner, getProjectDetail };
