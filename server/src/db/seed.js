import bcrypt from 'bcryptjs';
import { query } from './connection.js';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, department)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['admin@integritat.com', hashedPassword, 'Admin', 'User', 'admin', 'Management']
    );

    console.log('✅ Admin user created (email: admin@integritat.com, password: Admin@123)');

    // Create some sample team members
    const teamMembers = [
      { email: 'john.doe@integritat.com', firstName: 'John', lastName: 'Doe', role: 'senior_auditor', department: 'Audit' },
      { email: 'jane.smith@integritat.com', firstName: 'Jane', lastName: 'Smith', role: 'junior_auditor', department: 'Audit' },
      { email: 'mike.johnson@integritat.com', firstName: 'Mike', lastName: 'Johnson', role: 'partner', department: 'Management' }
    ];

    for (const member of teamMembers) {
      const memberPassword = await bcrypt.hash('password123', 10);
      await query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, department)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [member.email, memberPassword, member.firstName, member.lastName, member.role, member.department]
      );
    }

    console.log('✅ Team members created');

    // Create sample clients
    const sampleClients = [
      {
        code: 'CL-1001',
        name: 'Acme Corporation Ltd.',
        entityType: 'Public',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        zipCode: '10001',
        contactName: 'Robert Smith',
        contactEmail: 'robert@acmecorp.com',
        contactPhone: '+1-555-0101',
        taxId: 'EIN-12-3456789'
      },
      {
        code: 'CL-1002',
        name: 'TechStart Innovations Inc.',
        entityType: 'Non-Public',
        city: 'San Francisco',
        state: 'CA',
        country: 'United States',
        zipCode: '94102',
        contactName: 'Sarah Johnson',
        contactEmail: 'sarah@techstart.com',
        contactPhone: '+1-555-0102',
        taxId: 'EIN-98-7654321'
      },
      {
        code: 'CL-1003',
        name: 'Global Manufacturing Co.',
        entityType: 'Public',
        city: 'Chicago',
        state: 'IL',
        country: 'United States',
        zipCode: '60601',
        contactName: 'Michael Chen',
        contactEmail: 'mchen@globalmanuf.com',
        contactPhone: '+1-555-0103',
        taxId: 'EIN-45-6789012'
      }
    ];

    for (const client of sampleClients) {
      await query(
        `INSERT INTO clients (
          client_code, legal_name, entity_type, address_line1, address_line2,
          city, state, country, zip_code, incorporation_date, business_nature,
          tax_id, contact_name, contact_email, contact_phone
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          client.code, client.name, client.entityType, '123 Business Street', 'Suite 100',
          client.city, client.state, client.country, client.zipCode, null, 'Professional Services',
          client.taxId, client.contactName, client.contactEmail, client.contactPhone
        ]
      );
    }

    console.log('✅ Sample clients created');
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@integritat.com');
    console.log('   Password: Admin@123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seedDatabase();
