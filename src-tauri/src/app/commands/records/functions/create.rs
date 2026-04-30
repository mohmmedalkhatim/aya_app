use migration::entities::records::{ActiveModel, Entity};
use sea_orm::{ActiveValue::Set, DatabaseConnection, EntityTrait};

use crate::app::commands::records::objects::Record;


pub async fn create_record(
    payload: Record,
    db: &DatabaseConnection,
) -> Result<i32, String> {
    let active_value = ActiveModel {
        date: Set(payload.date),
        mediction_record: Set(payload.medictions_records),
        sugar_levels: Set(payload.sugar_levels),
        ..Default::default()
    };
    let update = Entity::insert(active_value)
    .exec(db)
    .await
    .map_err(|err| {
        return err.to_string();
    })?;
    Ok(update.last_insert_id)
}
