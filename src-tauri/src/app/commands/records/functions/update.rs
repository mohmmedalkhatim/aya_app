use migration::entities::records::{self, ActiveModel, Entity, Model};
use sea_orm::{entity::*, DatabaseConnection, DbErr, EntityTrait, QueryFilter, Set};


use crate::app::commands::records::objects::Record;

pub async fn update_record(
    payload: Record,
    date: String,
    db: &DatabaseConnection,
) -> Result<i32, String> {
    let model = Entity::find()
        .filter(records::Column::Date.eq(date))
        .one(db)
        .await
        .map_err(|err| err.to_string())?.unwrap();
    let update = Entity::update(ActiveModel {
        id: Set(model.id),
        date: Set(payload.date),
        medictions_records: Set(payload.medictions_records),
        sugar_levels: Set(payload.sugar_levels),
    })
    .exec(db)
    .await
    .map_err(|err| {
        let e = err.to_string(); 
        println!("{}",e.clone());
        return  e.clone();

    })?;
    Ok(update.id)
}
