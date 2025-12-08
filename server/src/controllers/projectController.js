import { query } from '../db/connection.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const getAllProjects = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.*, c.legal_name as client_name, u.first_name || ' ' || u.last_name as team_lead_name
     FROM projects p
     LEFT JOIN clients c ON p.client_id = c.id
     LEFT JOIN users u ON p.team_lead_id = u.id
     ORDER BY p.created_at DESC`
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    `SELECT p.*, c.legal_name as client_name, u.first_name || ' ' || u.last_name as team_lead_name
     FROM projects p
     LEFT JOIN clients c ON p.client_id = c.id
     LEFT JOIN users u ON p.team_lead_id = u.id
     WHERE p.id = $1`,
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
});

export const createProject = asyncHandler(async (req, res) => {
  const { projectCode, clientId, projectType, period, completionDate, projectValue, teamLeadId } = req.body;

  // Check if project code exists
  const existing = await query('SELECT id FROM projects WHERE project_code = $1', [projectCode]);
  if (existing.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Project code already exists'
    });
  }

  const result = await query(
    `INSERT INTO projects (project_code, client_id, project_type, period, completion_date, project_value, team_lead_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Planning')
     RETURNING *`,
    [projectCode, clientId, projectType, period, completionDate, projectValue, teamLeadId]
  );

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: result.rows[0]
  });
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Planning', 'In Progress', 'Under Review', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const result = await query(
    'UPDATE projects SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    message: 'Project status updated',
    data: result.rows[0]
  });
});

export const addTeamMember = asyncHandler(async (req, res) => {
  const { projectId, userId, workPercentage, role } = req.body;

  const result = await query(
    `INSERT INTO project_team (project_id, user_id, work_percentage, role)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [projectId, userId, workPercentage, role]
  );

  res.status(201).json({
    success: true,
    message: 'Team member added',
    data: result.rows[0]
  });
});

export const getProjectTeam = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await query(
    `SELECT pt.*, u.first_name, u.last_name, u.email, u.role as user_role
     FROM project_team pt
     JOIN users u ON pt.user_id = u.id
     WHERE pt.project_id = $1`,
    [projectId]
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.json({
    success: true,
    message: 'Project deleted successfully'
  });
});
