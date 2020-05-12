CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  creator_id BIGINT NOT NULL REFERENCES users (id),
  performer_id BIGINT REFERENCES users (id),
  is_accepted BOOLEAN,
  date_accepted DATE,
  completed BOOLEAN DEFAULT FALSE,
  date_completed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_posted TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  header VARCHAR(50) NOT NULL,
  priority SMALLINT NOT NULL,
  cost NUMERIC(4,2) NOT NULL CONSTRAINT positive_cost CHECK (cost >= 0.00),
  type VARCHAR(30) NOT NULL,
  description VARCHAR(200) NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  date_expected DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TYPE t_status as ('invalid', 'pending', 'complete')

CREATE TABLE task_transaction (
  task_id BIGINT NOT NULL REFERENCES tasks (id),
  performer_id BIGINT NOT NULL REFERENCES users (id),
  creator_id BIGINT NOT NULL REFERENCES users (id),
  transaction_status t_status,
  amount NUMERIC(4,2) NOT NULL CONSTRAINT positive_wallet CHECK (wallet >= 0.00)
);

CREATE TABLE task_report (
  task_id BIGINT NOT NULL REFERENCES tasks (id),
  author_id BIGINT NOT NULL REFERENCES users (id),
  accused_id BIGINT NOT NULL REFERENCES users (id),
  date_submit TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  type VARCHAR(50) NOT NULL,
  description VARCHAR(300) NOT NULL
);

CREATE TYPE gender AS ENUM ('m', 'f', 'other');

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(75) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20),
  wallet NUMERIC(4,2) DEFAULT 10.00,
  gender gender,
  tasks_published INT DEFAULT 0,
  tasks_completed INT DEFAULT 0,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT positive_wallet CHECK (wallet >= 0.00)
);

CREATE TYPE status AS ENUM ('friend', 'blocked', 'requested');

CREATE TABLE user_relationships (
  requestor_id BIGINT NOT NULL REFERENCES users (id),
  receiver_id BIGINT NOT NULL REFERENCES users (id),
  type status,

  primary key(requestor_id, receiver_id)
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  author_id BIGINT REFERENCES users (id),
  author_name VARCHAR(50),
  send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  message_text VARCHAR(200) NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_date TIMESTAMP,
  conversation_id BIGINT REFERENCES conversations (id)
);

CREATE TABLE conversations (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(50),
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_conversations (
  conversation_id BIGINT REFERENCES conversations (id)
  user_id BIGINT REFERENCES users (id),
  num_unread INT NOT NULL DEFAULT 0
);
