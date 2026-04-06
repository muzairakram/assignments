-- Team Members
INSERT INTO team_members (name, email, role) VALUES
  ('Uzair Akram', 'uzair.akram@da.com', 'Lead Consultant'),
  ('Kate Cherednichenko', 'kate.cherednichenko@da.com', 'Senior Advisor'),
  ('Romina Genovesi', 'romina.genovesi@da.com', 'Strategy Lead'),
  ('Arqam Lodhi', 'arqam.lodhi@da.com', 'Technical Specialist'),
  ('Hafsa Iqbal', 'hafsa.iqbal@da.com', 'Implementation Manager'),
  ('Olia Gladkova-Burgess', 'olia.gladkova-burgess@da.com', 'Capacity Building Lead'),
  ('Narcis Tulbure', 'narcis.tulbure@da.com', 'Assessment Analyst');

-- Client 1: Ministry of Education
INSERT INTO clients (name, engagement_type, phase, rag_status, start_date, target_outcome, notes) VALUES
  ('Ministry of Education - Digital Transformation', 'Technical Assistance', 'Delivery', 'Green', '2026-01-10',
   'Digitise 80% of citizen-facing services by Q3 2026 and establish a sustainable digital operations team.',
   'Strong ministerial sponsorship. Weekly steering committee in place.');

INSERT INTO milestones (client_id, name, completed, sort_order) VALUES
  (1, 'Stakeholder mapping & needs assessment', 1, 1),
  (1, 'Digital maturity baseline report', 1, 2),
  (1, 'Platform architecture design approved', 1, 3),
  (1, 'Pilot services launched (3 services)', 0, 4),
  (1, 'Full rollout & handover plan', 0, 5);

INSERT INTO actions (client_id, task, owner, deadline, status) VALUES
  (1, 'Finalise pilot service user-testing report', 'Uzair Akram', date('now', '+2 days'), 'In Progress'),
  (1, 'Submit platform security audit findings', 'Arqam Lodhi', date('now', '-1 days'), 'In Progress'),
  (1, 'Prepare change-management workshop deck', 'Kate Cherednichenko', date('now', '+10 days'), 'Not Started');

-- Client 2: National Health Authority
INSERT INTO clients (name, engagement_type, phase, rag_status, start_date, target_outcome, notes) VALUES
  ('National Health Authority - Strategy Refresh', 'Strategy Advisory', 'Design', 'Amber',  '2026-03-01',
   'Develop a 5-year health-system strengthening strategy aligned to WHO benchmarks.',
   'Data availability is a challenge. Procurement delays on analytics contract.');

INSERT INTO milestones (client_id, name, completed, sort_order) VALUES
  (2, 'Situational analysis complete', 1, 1),
  (2, 'Strategic options paper drafted', 0, 2),
  (2, 'Costing model finalised', 0, 3),
  (2, 'Ministerial sign-off on strategy', 0, 4);

INSERT INTO actions (client_id, task, owner, deadline, status) VALUES
  (2, 'Chase procurement team on analytics vendor', 'Hafsa Iqbal', date('now', '-3 days'), 'Blocked'),
  (2, 'Draft strategic options paper v1', 'Romina Genovesi', date('now', '+1 days'), 'In Progress'),
  (2, 'Schedule WHO benchmarking workshop', 'Olia Gladkova-Burgess', date('now', '+7 days'), 'Not Started'),
  (2, 'Compile regional health data sets', 'Narcis Tulbure', date('now', '+3 days'), 'In Progress');

-- Client 3: Regional Transport Agency
INSERT INTO clients (name, engagement_type, phase, rag_status, start_date, target_outcome, notes) VALUES
  ('Regional Transport Agency - Capacity Program', 'Capacity Building', 'Discovery', 'Red', '2026-03-20',
   'Build internal project-management capability to independently deliver transport infrastructure programmes.',
   'Agency lacks PMO structure. Staff turnover is high. Requires significant upskilling.');

INSERT INTO milestones (client_id, name, completed, sort_order) VALUES
  (3, 'Capacity needs assessment', 0, 1),
  (3, 'Training curriculum designed', 0, 2),
  (3, 'PMO framework established', 0, 3);

INSERT INTO actions (client_id, task, owner, deadline, status) VALUES
  (3, 'Complete staff skills audit', 'Uzair Akram', date('now', '-5 days'), 'Not Started'),
  (3, 'Map existing project governance processes', 'Arqam Lodhi', date('now', '-2 days'), 'In Progress'),
  (3, 'Draft capacity-building proposal', 'Kate Cherednichenko', date('now', '+2 days'), 'Not Started');

-- Client 4: Urban Development Commission
INSERT INTO clients (name, engagement_type, phase, rag_status, start_date, target_outcome, notes) VALUES
  ('Urban Development Commission - Implementation Review', 'Implementation Support', 'Sustain', 'Green', '2025-10-15',
   'Embed continuous-improvement practices and ensure sustainability of the urban renewal programme outcomes.',
   'Engagement winding down. Client team is self-sufficient. Transitioning to light-touch support.');

INSERT INTO milestones (client_id, name, completed, sort_order) VALUES
  (4, 'Implementation gap analysis', 1, 1),
  (4, 'Remediation action plan approved', 1, 2),
  (4, 'Quick-win initiatives delivered', 1, 3),
  (4, 'Sustainability framework documented', 1, 4),
  (4, 'Final lessons-learned report', 0, 5);

INSERT INTO actions (client_id, task, owner, deadline, status) VALUES
  (4, 'Draft lessons-learned report', 'Romina Genovesi', date('now', '+14 days'), 'In Progress'),
  (4, 'Conduct sustainability review meeting', 'Hafsa Iqbal', date('now', '+5 days'), 'Not Started'),
  (4, 'Archive project documentation', 'Narcis Tulbure', date('now', '+21 days'), 'Not Started');
