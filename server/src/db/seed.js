import bcrypt from 'bcryptjs';
import pool from './connection.js';
import { v4 as uuidv4 } from 'uuid';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin@123', 10);
    const adminId = uuidv4();
    
    await pool.query(
      `INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [adminId, 'admin@integritat.com', adminPassword, 'Admin', 'User', 'admin', 'Management', true]
    );

    // Create sample auditors
    const auditorPassword = await bcrypt.hash('auditor@123', 10);
    const auditorIds = [];
    
    const auditors = [
      { email: 'rahul.sen@integritat.com', first: 'Rahul', last: 'Sen', role: 'senior_auditor' },
      { email: 'mira.desai@integritat.com', first: 'Mira', last: 'Desai', role: 'senior_auditor' },
      { email: 'kunal.roy@integritat.com', first: 'Kunal', last: 'Roy', role: 'junior_auditor' },
      { email: 'aisha.sharma@integritat.com', first: 'Aisha', last: 'Sharma', role: 'senior_auditor' },
    ];

    for (const auditor of auditors) {
      const id = uuidv4();
      auditorIds.push(id);
      await pool.query(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, auditor.email, auditorPassword, auditor.first, auditor.last, auditor.role, 'Audit', true]
      );
    }

    // Create sample clients
    const clients = [
      {
        code: 'CL-1001',
        name: 'ABC Corp Pvt Ltd',
        type: 'Public',
        city: 'Mumbai',
        contact: 'Rohan Mehta',
        email: 'rohan@abc.com'
      },
      {
        code: 'CL-1002',
        name: 'XYZ Business Solutions',
        type: 'Non-Public',
        city: 'Delhi',
        contact: 'Sneha Kapoor',
        email: 'sneha@xyz.com'
      },
      {
        code: 'CL-1003',
        name: 'Delta Finance Group',
        type: 'Public',
        city: 'Bangalore',
        contact: 'Arjun Patel',
        email: 'arjun@delta.com'
      },
    ];

    const clientIds = [];
    for (const client of clients) {
      const id = uuidv4();
      clientIds.push(id);
      await pool.query(
        `INSERT INTO clients (id, client_code, legal_name, entity_type, city, contact_name, contact_email, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [id, client.code, client.name, client.type, client.city, client.contact, client.email, 'Active']
      );
    }

    // Create sample projects
    const projects = [
      {
        code: 'PROJ-001',
        clientId: clientIds[0],
        type: 'Statutory Audit',
        period: 'FY 2024-25',
        lead: auditorIds[0]
      },
      {
        code: 'PROJ-002',
        clientId: clientIds[1],
        type: 'Tax Audit',
        period: 'FY 2024-25',
        lead: auditorIds[1]
      },
      {
        code: 'PROJ-003',
        clientId: clientIds[2],
        type: 'Internal Audit',
        period: 'Q1 2025',
        lead: auditorIds[2]
      },
    ];

    for (const project of projects) {
      await pool.query(
        `INSERT INTO projects (project_code, client_id, project_type, period, team_lead_id, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [project.code, project.clientId, project.type, project.period, project.lead, 'In Progress']
      );
    }

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
