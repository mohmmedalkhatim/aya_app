pub mod functions;
use crate::{
    DbConnection, app::commands::records::functions::{create_record, delete_record, find_one_by_date, update_record}
};
use async_std::sync::Mutex;
use migration::entities::records::Model;
use std::sync::Arc;
use tauri::{ipc::Channel, State};
mod objects;

#[tauri::command]
pub async fn records_control(
    data: State<'_, Arc<Mutex<DbConnection>>>,
    payload: objects::Payload,
    channel: Channel<Model>,
) -> Result<(), String> {
    let db = data.lock().await.db.clone().unwrap();
    match payload.command.as_str() {
        "create" => match payload.data {
            Some(state) => match create_record(state, &db).await {
                Ok(_state) => Ok(()),
                Err(err) => Err(err),
            },
            None => Err("you have to includ an data in the payload".to_string()),
        },
        "get_one_by_date" => match payload.date {
            Some(state) => match find_one_by_date(state, &db).await {
                Ok(_state) => {
                    let _ = channel.send(_state);
                    Ok(())
                }
                Err(err) => Err(err),
            },
            None => Err("you have to include date in the payload".to_string()),
        },
        "update_one" => match payload.date {
            Some(id) => match payload.data {
                Some(record) => match update_record(record, id, &db).await {
                    Ok(_item) => Ok(()),
                    Err(err) => Err(err),
                },
                None => Err("you have to add data to the payload".to_string()),
            },
            None => Err("you have to add date to get the record".to_string()),
        },
        "delete_record" => match payload.id {
            Some(state) => match delete_record(state, &db).await {
                Ok(state) => Ok(state),
                Err(err) => Err(err),
            },
            None => Err("you have to includ an data in the payload".to_string()),
        },
        _ => Err("you have entered unregisterd command".to_string()),
    }
}
