import { query } from '../db/connection.js';
import { asyncHandler } from '../utils/errorHandler.js';

// Get all checklists for a project
export const getChecklistsByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await query(
    'SELECT * FROM audit_checklists WHERE project_id = $1 ORDER BY created_at DESC',
    [projectId]
  );

  res.json({
    success: true,
    data: result.rows
  });
});

// Create a single checklist
export const createChecklist = asyncHandler(async (req, res) => {
  const {
    projectId, checklistCode, checklistTitle, category,
    assignedTo, dueDate, status
  } = req.body;

  const result = await query(
    `INSERT INTO audit_checklists (
      project_id, checklist_code, checklist_title, category,
      assigned_to, due_date, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [projectId, checklistCode, checklistTitle, category, assignedTo, dueDate, status || 'Pending']
  );

  res.status(201).json({
    success: true,
    message: 'Checklist created successfully',
    data: result.rows[0]
  });
});

// Bulk create checklists
export const bulkCreateChecklists = asyncHandler(async (req, res) => {
  const { projectId, checklists } = req.body;

  const createdChecklists = [];

  for (const checklist of checklists) {
    const result = await query(
      `INSERT INTO audit_checklists (
        project_id, checklist_code, checklist_title, category,
        assigned_to, due_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        projectId,
        checklist.checklistCode,
        checklist.checklistTitle,
        checklist.category,
        checklist.assignedTo || null,
        checklist.dueDate || null,
        checklist.status || 'Pending'
      ]
    );
    createdChecklists.push(result.rows[0]);
  }

  res.status(201).json({
    success: true,
    message: `${createdChecklists.length} checklists created successfully`,
    data: createdChecklists
  });
});

// Update checklist status
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
    `UPDATE audit_checklists 
     SET status = $1, 
         completion_date = CASE WHEN $1 = 'Completed' THEN CURRENT_TIMESTAMP ELSE completion_date END,
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING *`,
    [status, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Checklist not found'
    });
  }

  res.json({
    success: true,
    message: 'Checklist status updated',
    data: result.rows[0]
  });
});

// Sign off checklist
export const signOffChecklist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { signedOffBy } = req.body;
  const userId = req.user?.userId || signedOffBy;

  const result = await query(
    `UPDATE audit_checklists 
     SET signed_off_by = $1, 
         sign_off_date = CURRENT_TIMESTAMP,
         status = 'Completed',
         completion_date = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP 
     WHERE id = $2 
     RETURNING *`,
    [userId, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Checklist not found'
    });
  }

  res.json({
    success: true,
    message: 'Checklist signed off successfully',
    data: result.rows[0]
  });
});

// Delete checklist
export const deleteChecklist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query(
    'DELETE FROM audit_checklists WHERE id = $1 RETURNING id',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Checklist not found'
    });
  }

  res.json({
    success: true,
    message: 'Checklist deleted successfully'
  });
});
