import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CHECKLISTS_FILE = path.join(DATA_DIR, 'checklists.json');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');
const PROJECT_TEAM_FILE = path.join(DATA_DIR, 'project_team.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initFile = (filePath, defaultData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initFile(CLIENTS_FILE, []);
initFile(PROJECTS_FILE, []);
initFile(USERS_FILE, []);
initFile(CHECKLISTS_FILE, []);
initFile(DOCUMENTS_FILE, []);
initFile(PROJECT_TEAM_FILE, []);

// Helper functions
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Mock query function that mimics PostgreSQL
export const query = async (text, params = []) => {
  const queryLower = text.toLowerCase().trim();

  // SELECT queries
  if (queryLower.startsWith('select')) {
    // COUNT queries
    if (queryLower.includes('count(*)')) {
      if (queryLower.includes('from projects')) {
        const projects = readData(PROJECTS_FILE);

        if (queryLower.includes('group by status')) {
          const grouped = {};
          projects.forEach(p => {
            grouped[p.status] = (grouped[p.status] || 0) + 1;
          });
          return { rows: Object.entries(grouped).map(([status, count]) => ({ status, count: count.toString() })) };
        }

        return { rows: [{ count: projects.length.toString() }] };
      }

      if (queryLower.includes('from clients')) {
        const clients = readData(CLIENTS_FILE);
        const activeClients = queryLower.includes('where status') ?
          clients.filter(c => c.status === 'Active') : clients;
        return { rows: [{ count: activeClients.length.toString() }] };
      }

      if (queryLower.includes('from audit_checklists')) {
        const checklists = readData(CHECKLISTS_FILE);
        const pending = queryLower.includes('where status') ?
          checklists.filter(c => c.status !== 'Completed') : checklists;
        return { rows: [{ count: pending.length.toString() }] };
      }
    }

    // Team workload query
    if (queryLower.includes('from users') && queryLower.includes('left join')) {
      const users = readData(USERS_FILE);
      const filteredUsers = users.filter(u =>
        u.role === 'senior_auditor' || u.role === 'junior_auditor'
      );

      return {
        rows: filteredUsers.map(u => ({
          user_id: u.id,
          first_name: u.first_name,
          last_name: u.last_name,
          role: u.role,
          active_projects: 0
        }))
      };
    }

    // Project activity query
    if (queryLower.includes('from projects') && queryLower.includes('join clients')) {
      const projects = readData(PROJECTS_FILE);
      const clients = readData(CLIENTS_FILE);
      const users = readData(USERS_FILE);

      return {
        rows: projects.map(p => {
          const client = clients.find(c => c.id === p.client_id);
          const teamLead = users.find(u => u.id === p.team_lead_id);
          return {
            ...p, // Include all project fields
            client_name: client?.legal_name || 'Unknown',
            team_lead_name: teamLead ? `${teamLead.first_name} ${teamLead.last_name}` : null,
            total_checklists: 0,
            completed_checklists: 0
          };
        })
      };
    }

    // Regular SELECT queries
    if (queryLower.includes('from clients')) {
      const clients = readData(CLIENTS_FILE);

      if (queryLower.includes('where id =')) {
        const id = params[0];
        const client = clients.find(c => c.id === id);
        return { rows: client ? [client] : [] };
      }

      if (queryLower.includes('order by created_at desc limit 1')) {
        const sorted = clients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return { rows: sorted.length > 0 ? [sorted[0]] : [] };
      }

      return { rows: clients };
    }

    if (queryLower.includes('from projects')) {
      const projects = readData(PROJECTS_FILE);
      return { rows: projects };
    }

    if (queryLower.includes('from users')) {
      const users = readData(USERS_FILE);

      if (queryLower.includes('where email =')) {
        const email = params[0];
        const user = users.find(u => u.email === email);
        return { rows: user ? [user] : [] };
      }

      return { rows: users };
    }

    if (queryLower.includes('from audit_checklists')) {
      const checklists = readData(CHECKLISTS_FILE);

      if (queryLower.includes('where project_id =')) {
        const projectId = params[0];
        const filtered = checklists.filter(c => c.project_id === projectId);
        return { rows: filtered };
      }

      if (queryLower.includes('where assigned_to =')) {
        const userId = params[0];
        const filtered = checklists.filter(c => c.assigned_to === userId && c.status !== 'Completed');
        return { rows: filtered };
      }

      return { rows: checklists };
    }

    // Documents queries
    if (queryLower.includes('from documents')) {
      const documents = readData(DOCUMENTS_FILE);
      const users = readData(USERS_FILE);

      if (queryLower.includes('where project_id =')) {
        const projectId = params[0];
        const filtered = documents.filter(d => d.project_id === projectId);

        // Join with users for uploaded_by_name
        const result = filtered.map(d => {
          const user = users.find(u => u.id === d.uploaded_by);
          return {
            ...d,
            uploaded_by_name: user ? `${user.first_name} ${user.last_name}` : null
          };
        });
        return { rows: result };
      }

      if (queryLower.includes('where checklist_id =')) {
        const checklistId = params[0];
        const filtered = documents.filter(d => d.checklist_id === checklistId);

        const result = filtered.map(d => {
          const user = users.find(u => u.id === d.uploaded_by);
          return {
            ...d,
            uploaded_by_name: user ? `${user.first_name} ${user.last_name}` : null
          };
        });
        return { rows: result };
      }

      return { rows: documents };
    }

    // Project team queries
    if (queryLower.includes('from project_team')) {
      const projectTeam = readData(PROJECT_TEAM_FILE);
      const users = readData(USERS_FILE);

      if (queryLower.includes('where project_id =')) {
        const projectId = params[0];
        const filtered = projectTeam.filter(pt => pt.project_id === projectId);

        // Join with users
        const result = filtered.map(pt => {
          const user = users.find(u => u.id === pt.user_id);
          return {
            ...pt,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            user_role: user?.role
          };
        });
        return { rows: result };
      }

      return { rows: projectTeam };
    }
  }

  // INSERT queries
  if (queryLower.startsWith('insert into clients')) {
    const clients = readData(CLIENTS_FILE);
    const newClient = {
      id: uuidv4(),
      client_code: params[0],
      legal_name: params[1],
      entity_type: params[2],
      address_line1: params[3],
      address_line2: params[4],
      city: params[5],
      state: params[6],
      country: params[7],
      zip_code: params[8],
      incorporation_date: params[9],
      business_nature: params[10],
      tax_id: params[11],
      contact_name: params[12],
      contact_email: params[13],
      contact_phone: params[14],
      prior_auditor: params[15],
      documents: params[16],
      status: 'Active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    clients.push(newClient);
    writeData(CLIENTS_FILE, clients);
    return { rows: [newClient] };
  }

  if (queryLower.startsWith('insert into projects')) {
    const projects = readData(PROJECTS_FILE);

    // Handle different INSERT formats
    const newProject = {
      id: uuidv4(),
      project_code: params[0],
      client_id: params[1],
      project_type: params[2],
      period: params[3],
      completion_date: params[4],
      project_value: params[5],
      team_lead_id: params[6] || null,
      status: 'Planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    projects.push(newProject);
    writeData(PROJECTS_FILE, projects);
    return { rows: [newProject] };
  }

  if (queryLower.startsWith('insert into users')) {
    const users = readData(USERS_FILE);
    const newUser = {
      id: uuidv4(),
      email: params[0],
      password_hash: params[1],
      first_name: params[2],
      last_name: params[3],
      role: params[4],
      department: params[5],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    writeData(USERS_FILE, users);
    return { rows: [newUser] };
  }

  if (queryLower.startsWith('insert into audit_checklists')) {
    const checklists = readData(CHECKLISTS_FILE);
    const newChecklist = {
      id: uuidv4(),
      project_id: params[0],
      checklist_code: params[1],
      checklist_title: params[2],
      category: params[3],
      assigned_to: params[4],
      status: params[5] || 'Pending',
      due_date: params[6],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    checklists.push(newChecklist);
    writeData(CHECKLISTS_FILE, checklists);
    return { rows: [newChecklist] };
  }

  if (queryLower.startsWith('insert into documents')) {
    const documents = readData(DOCUMENTS_FILE);
    const newDocument = {
      id: uuidv4(),
      project_id: params[0],
      checklist_id: params[1],
      file_name: params[2],
      file_key: params[3],
      file_size: params[4],
      mime_type: params[5],
      uploaded_by: params[6],
      metadata: params[7],
      upload_date: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    documents.push(newDocument);
    writeData(DOCUMENTS_FILE, documents);
    return { rows: [newDocument] };
  }

  if (queryLower.startsWith('insert into project_team')) {
    const projectTeam = readData(PROJECT_TEAM_FILE);
    const newTeamMember = {
      id: uuidv4(),
      project_id: params[0],
      user_id: params[1],
      work_percentage: params[2],
      role: params[3],
      added_at: new Date().toISOString()
    };
    projectTeam.push(newTeamMember);
    writeData(PROJECT_TEAM_FILE, projectTeam);
    return { rows: [newTeamMember] };
  }

  // UPDATE queries
  if (queryLower.startsWith('update clients')) {
    const clients = readData(CLIENTS_FILE);
    const idIndex = params.length - 1;
    const id = params[idIndex];
    const clientIndex = clients.findIndex(c => c.id === id);

    if (clientIndex !== -1) {
      clients[clientIndex].updated_at = new Date().toISOString();

      // Update fields based on query
      if (queryLower.includes('status =')) {
        clients[clientIndex].status = params[0];
      }

      writeData(CLIENTS_FILE, clients);
      return { rows: [clients[clientIndex]] };
    }
    return { rows: [] };
  }

  if (queryLower.startsWith('update projects')) {
    const projects = readData(PROJECTS_FILE);
    const id = params[params.length - 1];
    const projectIndex = projects.findIndex(p => p.id === id);

    if (projectIndex !== -1) {
      projects[projectIndex].updated_at = new Date().toISOString();

      if (queryLower.includes('status =')) {
        projects[projectIndex].status = params[0];
      }

      writeData(PROJECTS_FILE, projects);
      return { rows: [projects[projectIndex]] };
    }
    return { rows: [] };
  }

  if (queryLower.startsWith('update audit_checklists')) {
    const checklists = readData(CHECKLISTS_FILE);
    const id = params[params.length - 1];
    const checklistIndex = checklists.findIndex(c => c.id === id);

    if (checklistIndex !== -1) {
      checklists[checklistIndex].updated_at = new Date().toISOString();

      if (queryLower.includes('status =')) {
        checklists[checklistIndex].status = params[0];
      }

      writeData(CHECKLISTS_FILE, checklists);
      return { rows: [checklists[checklistIndex]] };
    }
    return { rows: [] };
  }

  // DELETE queries
  if (queryLower.startsWith('delete from clients')) {
    const clients = readData(CLIENTS_FILE);
    const id = params[0];
    const filtered = clients.filter(c => c.id !== id);
    const deleted = clients.find(c => c.id === id);
    writeData(CLIENTS_FILE, filtered);
    return { rows: deleted ? [{ id: deleted.id }] : [] };
  }

  if (queryLower.startsWith('delete from projects')) {
    const projects = readData(PROJECTS_FILE);
    const id = params[0];
    const filtered = projects.filter(p => p.id !== id);
    const deleted = projects.find(p => p.id === id);
    writeData(PROJECTS_FILE, filtered);
    return { rows: deleted ? [{ id: deleted.id }] : [] };
  }

  if (queryLower.startsWith('delete from audit_checklists')) {
    const checklists = readData(CHECKLISTS_FILE);
    const id = params[0];
    const filtered = checklists.filter(c => c.id !== id);
    const deleted = checklists.find(c => c.id === id);
    writeData(CHECKLISTS_FILE, filtered);
    return { rows: deleted ? [{ id: deleted.id }] : [] };
  }

  if (queryLower.startsWith('delete from documents')) {
    const documents = readData(DOCUMENTS_FILE);
    const id = params[0];
    const filtered = documents.filter(d => d.id !== id);
    const deleted = documents.find(d => d.id === id);
    writeData(DOCUMENTS_FILE, filtered);
    return { rows: deleted ? [{ id: deleted.id }] : [] };
  }

  if (queryLower.startsWith('delete from project_team')) {
    const projectTeam = readData(PROJECT_TEAM_FILE);
    const id = params[0];
    const filtered = projectTeam.filter(pt => pt.id !== id);
    const deleted = projectTeam.find(pt => pt.id === id);
    writeData(PROJECT_TEAM_FILE, filtered);
    return { rows: deleted ? [{ id: deleted.id }] : [] };
  }

  // Default return
  return { rows: [] };
};

export const getClient = () => ({
  query,
  release: () => { }
});

export default { query, getClient };
