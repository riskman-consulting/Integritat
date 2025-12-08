import { query } from '../db/connection.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const getDashboardSummary = asyncHandler(async (req, res) => {
  // Total projects
  const projectsResult = await query(
    `SELECT COUNT(*) as count FROM projects`
  );
  const totalProjects = parseInt(projectsResult.rows[0].count);

  // Projects by status
  const statusResult = await query(
    `SELECT status, COUNT(*) as count FROM projects GROUP BY status`
  );
  const projectsByStatus = {};
  statusResult.rows.forEach(row => {
    projectsByStatus[row.status] = parseInt(row.count);
  });

  // Total clients
  const clientsResult = await query(
    `SELECT COUNT(*) as count FROM clients WHERE status = 'Active'`
  );
  const totalClients = parseInt(clientsResult.rows[0].count);

  // Pending checklists
  const checklistResult = await query(
    `SELECT COUNT(*) as count FROM audit_checklists WHERE status != 'Completed'`
  );
  const pendingChecklists = parseInt(checklistResult.rows[0].count);

  res.json({
    success: true,
    data: {
      totalProjects,
      projectsByStatus,
      totalClients,
      pendingChecklists
    }
  });
});

export const getTeamWorkload = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT u.id, u.first_name || ' ' || u.last_name as name,
            COUNT(DISTINCT pt.project_id) as projects_count,
            COUNT(DISTINCT ac.id) as assigned_checklists,
            COALESCE(SUM(pt.work_percentage), 0) as total_work_percent
     FROM users u
     LEFT JOIN project_team pt ON u.id = pt.user_id
     LEFT JOIN audit_checklists ac ON u.id = ac.assigned_to AND ac.status != 'Completed'
     WHERE u.role IN ('senior_auditor', 'junior_auditor')
     GROUP BY u.id, u.first_name, u.last_name
     ORDER BY projects_count DESC`
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const getPendingTasks = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const result = await query(
    `SELECT ac.id, ac.checklist_title as title, ac.checklist_code as code,
            ac.due_date, ac.status, p.project_code, c.legal_name as client_name
     FROM audit_checklists ac
     JOIN projects p ON ac.project_id = p.id
     JOIN clients c ON p.client_id = c.id
     WHERE ac.assigned_to = $1 AND ac.status != 'Completed'
     ORDER BY ac.due_date ASC
     LIMIT 10`,
    [userId]
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const getProjectActivity = asyncHandler(async (req, res) => {
  const result = await query(
    `SELECT p.project_code, p.status, c.legal_name as client_name,
            u.first_name || ' ' || u.last_name as team_lead,
            COUNT(DISTINCT ac.id) as total_checklists,
            COUNT(DISTINCT CASE WHEN ac.status = 'Completed' THEN ac.id END) as completed_checklists,
            p.completion_date
     FROM projects p
     JOIN clients c ON p.client_id = c.id
     LEFT JOIN users u ON p.team_lead_id = u.id
     LEFT JOIN audit_checklists ac ON p.id = ac.project_id
     GROUP BY p.id, p.project_code, p.status, c.legal_name, u.first_name, u.last_name, p.completion_date
     ORDER BY p.updated_at DESC
     LIMIT 20`
  );

  res.json({
    success: true,
    data: result.rows
  });
});
