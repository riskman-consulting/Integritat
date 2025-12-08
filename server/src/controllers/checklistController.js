import { query } from '../db/connection.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const getChecklistsByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await query(
    `SELECT ac.*, u.first_name || ' ' || u.last_name as assigned_to_name,
            su.first_name || ' ' || su.last_name as signed_off_by_name
     FROM audit_checklists ac
     LEFT JOIN users u ON ac.assigned_to = u.id
     LEFT JOIN users su ON ac.signed_off_by = su.id
     WHERE ac.project_id = $1
     ORDER BY ac.category, ac.checklist_code`,
    [projectId]
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const createChecklistItem = asyncHandler(async (req, res) => {
  const { projectId, checklistCode, checklistTitle, category, referenceDoc, assignedTo, dueDate } = req.body;

  const result = await query(
    `INSERT INTO audit_checklists (project_id, checklist_code, checklist_title, category, reference_doc, assigned_to, due_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending')
     RETURNING *`,
    [projectId, checklistCode, checklistTitle, category, referenceDoc, assignedTo, dueDate]
  );

  res.status(201).json({
    success: true,
    message: 'Checklist item created',
    data: result.rows[0]
  });
});

export const updateChecklistStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'In Progress', 'Completed', 'Blocked'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status'
    });
  }

  const result = await query(
    'UPDATE audit_checklists SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Checklist item not found'
    });
  }

  res.json({
    success: true,
    message: 'Checklist status updated',
    data: result.rows[0]
  });
});

export const signOffChecklist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { signedOffBy } = req.body;

  const result = await query(
    `UPDATE audit_checklists 
     SET status = 'Completed', signed_off_by = $1, sign_off_date = CURRENT_TIMESTAMP, 
         completion_date = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING *`,
    [signedOffBy, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Checklist item not found'
    });
  }

  res.json({
    success: true,
    message: 'Checklist signed off successfully',
    data: result.rows[0]
  });
});

export const deleteChecklistItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM audit_checklists WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Checklist item not found'
    });
  }

  res.json({
    success: true,
    message: 'Checklist item deleted'
  });
});

export const bulkCreateChecklists = asyncHandler(async (req, res) => {
  const { projectId, checklists } = req.body;

  const results = [];

  for (const item of checklists) {
    const result = await query(
      `INSERT INTO audit_checklists (project_id, checklist_code, checklist_title, category, reference_doc, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING *`,
      [projectId, item.code, item.title, item.category, item.reference]
    );
    results.push(result.rows[0]);
  }

  res.status(201).json({
    success: true,
    message: `Created ${results.length} checklist items`,
    data: results
  });
});
