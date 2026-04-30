// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use async_std::sync::Mutex;
use migration::MigratorTrait;
use sea_orm::DatabaseConnection;
use std::sync::Arc;
use tauri::{path::BaseDirectory, Manager};
use tauri_plugin_store::StoreBuilder;
mod app;
mod firebase;
struct DbConnection {
    db: Option<DatabaseConnection>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
async fn main() {
    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_notifications::init())
        .plugin(tauri_plugin_keyring::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init());
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window("main")
                .expect("no main window")
                .set_focus();
        }));
    }

    builder
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![app::start_oauth_server,app::records_control])
        .setup(|app| {
            let database_url = app
                .app_handle()
                .path()
                .resolve("Database\\test.db", BaseDirectory::AppData)
                .unwrap();
            let _store = StoreBuilder::new(app.app_handle(), "main").build().unwrap();
            if !database_url.exists() {
                std::fs::create_dir_all(database_url.parent().unwrap()).unwrap();
                std::fs::File::create(&database_url).unwrap();
            }
            let database = Arc::new(Mutex::new(DbConnection { db: None }));
            let shadow = database.clone();
            tauri::async_runtime::spawn(async move {
                shadow.lock_arc().await.db =
                Some(app::database_connection(database_url.display().to_string()).await);
                let res = migration::Migrator::up(&shadow.lock_arc().await.db.clone().unwrap(), None)
                    .await;
                match res {
                    Ok(())=>{
                        println!("the magration has compeleted succfully")
                    }
                    Err(err)=>{
                        println!("{}",err.to_string())
                    }
                }
            });
            app.manage(database);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
