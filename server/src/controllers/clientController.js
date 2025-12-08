import { query } from '../db/connection.js';
import { asyncHandler } from '../utils/errorHandler.js';

export const getAllClients = asyncHandler(async (req, res) => {
  const result = await query('SELECT * FROM clients ORDER BY created_at DESC');
  
  res.json({
    success: true,
    data: result.rows
  });
});

export const getClientById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query('SELECT * FROM clients WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  res.json({
    success: true,
    data: result.rows[0]
  });
});

export const createClient = asyncHandler(async (req, res) => {
  const {
    clientCode, legalName, entityType, addressLine1, addressLine2,
    city, state, country, zipCode, incorporationDate, businessNature,
    taxId, contactName, contactEmail, contactPhone
  } = req.body;

  // Check if client code exists
  const existing = await query('SELECT id FROM clients WHERE client_code = $1', [clientCode]);
  if (existing.rows.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Client code already exists'
    });
  }

  const result = await query(
    `INSERT INTO clients (
      client_code, legal_name, entity_type, address_line1, address_line2,
      city, state, country, zip_code, incorporation_date, business_nature,
      tax_id, contact_name, contact_email, contact_phone
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    RETURNING *`,
    [
      clientCode, legalName, entityType, addressLine1, addressLine2,
      city, state, country, zipCode, incorporationDate, businessNature,
      taxId, contactName, contactEmail, contactPhone
    ]
  );

  res.status(201).json({
    success: true,
    message: 'Client created successfully',
    data: result.rows[0]
  });
});

export const updateClient = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, contactName, contactEmail, contactPhone, ...updateData } = req.body;

  // Verify client exists
  const existing = await query('SELECT id FROM clients WHERE id = $1', [id]);
  if (existing.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Build dynamic update query
  const fields = [];
  const values = [];
  let paramCount = 1;

  if (status) {
    fields.push(`status = $${paramCount++}`);
    values.push(status);
  }
  if (contactName) {
    fields.push(`contact_name = $${paramCount++}`);
    values.push(contactName);
  }
  if (contactEmail) {
    fields.push(`contact_email = $${paramCount++}`);
    values.push(contactEmail);
  }
  if (contactPhone) {
    fields.push(`contact_phone = $${paramCount++}`);
    values.push(contactPhone);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const updateQuery = `UPDATE clients SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  
  const result = await query(updateQuery, values);

  res.json({
    success: true,
    message: 'Client updated successfully',
    data: result.rows[0]
  });
});

export const deleteClient = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await query('DELETE FROM clients WHERE id = $1 RETURNING id', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  res.json({
    success: true,
    message: 'Client deleted successfully'
  });
});
