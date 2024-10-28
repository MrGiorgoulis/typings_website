-- Add migration script here
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

CREATE TABLE IF NOT EXISTS game_history (
    user_uuid UUID NOT NULL,
    game_number INT NOT NULL,
    WPM FLOAT NOT NULL,
    time INT NOT NULL,  -- time in seconds or minutes, adjust as needed
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_uuid, game_number),
    FOREIGN KEY (user_uuid) REFERENCES users(user_uuid) ON DELETE CASCADE
);

-- Create the sequence
CREATE SEQUENCE game_number_seq;

-- Create the function to get the next game number
CREATE OR REPLACE FUNCTION get_next_game_number(user_id UUID) 
RETURNS INT AS $$
DECLARE
    next_number INT;
BEGIN
    IF user_id IS NULL THEN
        -- Handle anonymous case, e.g., assign a unique number or use a sequence
        next_number := nextval('game_number_seq');
    ELSE
        -- Increment game_number per user
        SELECT COALESCE(MAX(game_number), -1) + 1 INTO next_number
        FROM game_history
        WHERE user_uuid = user_id;
    END IF;

    RETURN next_number;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger function
CREATE OR REPLACE FUNCTION set_game_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.game_number := get_next_game_number(NEW.user_uuid);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER before_insert_game_history
BEFORE INSERT ON game_history
FOR EACH ROW
EXECUTE FUNCTION set_game_number();

