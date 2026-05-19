use uuid::Uuid;

#[derive(Debug, Clone)]
pub struct UserRecord {
    pub id: Uuid,
    pub display_name: String,
}
