use tauri::{Emitter, Runtime, Window};
use tauri_plugin_oauth::start;

#[tauri::command]
pub async fn start_oauth_server<R: Runtime>(window: Window<R>) -> Result<u16, String> {
    start(move |url| {
        // Because of the unprotected localhost port, you must verify the URL here.
        // Preferebly send back only the token, or nothing at all if you can handle everything else in Rust.
        println!("Received URL: {:?}", &url);
        let _ = window.emit("url", &url);
    })
    .map_err(|err| err.to_string())
}
