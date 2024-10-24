use chrono::NaiveDateTime;
use sqlx::types::Uuid;

pub struct Game {
    pub user_uuid: Uuid,
    pub game_number: i32,
    pub wpm: f64,
    pub time: i32,
    pub timestamp: NaiveDateTime,
}

impl Game {
    pub fn new(
        user_uuid: Uuid,
        game_number: i32,
        wpm: f64,
        time: i32,
        timestamp: NaiveDateTime,
    ) -> Game {
        Game {
            user_uuid,
            game_number,
            wpm,
            time,
            timestamp,
        }
    }
}

pub struct NewGame {
    pub user_uuid: Uuid,
    pub wpm: f64,
    pub time: i32,
}

impl NewGame {
    pub fn new(user_uuid: Uuid, wpm: f64, time: i32) -> NewGame {
        NewGame {
            user_uuid,
            wpm,
            time,
        }
    }
}
