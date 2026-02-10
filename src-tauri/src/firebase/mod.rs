use firebase_rust_sdk::{self as firebase, AppOptions};

fn init_firebase(){
    let app = firebase::app::App::create(AppOptions{
        project_id:"aya-app-33a9e".to_string(),
        app_name:Some("project-824517900422".to_string()),
        ..Default::default()
    });
} 