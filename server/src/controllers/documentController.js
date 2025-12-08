import { query } from '../db/connection.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const { projectId, checklistId } = req.body;
  const fileKey = req.file.filename;
  const userId = req.user.userId;

  const result = await query(
    `INSERT INTO documents (project_id, checklist_id, file_name, file_key, file_size, mime_type, uploaded_by, metadata)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [projectId, checklistId || null, req.file.originalname, fileKey, req.file.size, req.file.mimetype, userId, JSON.stringify({ originalName: req.file.originalname })]
  );

  res.status(201).json({
    success: true,
    message: 'Document uploaded successfully',
    data: result.rows[0]
  });
});

export const getDocumentsByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const result = await query(
    `SELECT d.*, u.first_name || ' ' || u.last_name as uploaded_by_name
     FROM documents d
     LEFT JOIN users u ON d.uploaded_by = u.id
     WHERE d.project_id = $1
     ORDER BY d.upload_date DESC`,
    [projectId]
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const getDocumentsByChecklist = asyncHandler(async (req, res) => {
  const { checklistId } = req.params;

  const result = await query(
    `SELECT d.*, u.first_name || ' ' || u.last_name as uploaded_by_name
     FROM documents d
     LEFT JOIN users u ON d.uploaded_by = u.id
     WHERE d.checklist_id = $1
     ORDER BY d.upload_date DESC`,
    [checklistId]
  );

  res.json({
    success: true,
    data: result.rows
  });
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM documents WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Document not found'
    });
  }

  res.json({
    success: true,
    message: 'Document deleted successfully'
  });
});
