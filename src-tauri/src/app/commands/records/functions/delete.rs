use migration::entities::records::Entity;
use sea_orm::{DatabaseConnection, EntityTrait};

pub async fn delete_record(id: i32, db: &DatabaseConnection) -> Result<(), String> {
    let _ = Entity::delete_by_id(id).exec(db).await.map_err(|err| {
        return err.to_string();
    })?;
    Ok(())
}
