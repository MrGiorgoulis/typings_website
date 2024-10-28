-- Add migration script here

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name VARCHAR(255) NOT NULL UNIQUE,
    total_games INT DEFAULT 0,
    WPM_average FLOAT DEFAULT 0,
    WPM_best FLOAT DEFAULT 0,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user'
);

-- Create game_history table with nullable user_uuid for anonymous users
CREATE TABLE IF NOT EXISTS game_history (
    user_uuid UUID,  -- Nullable to allow anonymous players
    game_number INT NOT NULL DEFAULT nextval('game_number_seq'),
    WPM FLOAT NOT NULL,
    time FLOAT NOT NULL,  -- Time in seconds or minutes, adjust as needed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_uuid, game_number),
    FOREIGN KEY (user_uuid) REFERENCES users(user_uuid) ON DELETE CASCADE
);

-- Insert a default "Anonymous" user if it doesn't already exist
INSERT INTO users (user_name, password_hash) 
VALUES ('Anonymous', '') 
ON CONFLICT (user_name) DO NOTHING;  -- Avoid duplicate entries