use axum::{
    body::Body,
    extract::Request,
    http::Response,
    routing::get_service,
    serve, Router,
};
use oauth2::{
    basic::{BasicClient, BasicTokenType},
    reqwest::async_http_client,
    AuthUrl, AuthorizationCode, ClientId, CsrfToken, EmptyExtraTokenFields, PkceCodeChallenge,
    RedirectUrl, Scope, StandardTokenResponse, TokenResponse, TokenUrl,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, convert::Infallible, sync::Arc};
use tauri::{ Emitter, Listener, Window};

#[tauri::command]
pub async fn start_oauth_server(window: Window) -> Result<String, String> {
    let atomic = Arc::from(window);
    let client = BasicClient::new(
        ClientId::new("GOOGLE_CLIENT_ID".to_string()),
        None,
        AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
            .map_err(|e| e.to_string())?,
        Some(
            TokenUrl::new("https://oauth2.googleapis.com/token".to_string())
                .map_err(|e| e.to_string())?,
        ),
    )
    .set_redirect_uri(
        RedirectUrl::new("http://127.0.0.1:7878/callback".to_string())
            .map_err(|e| e.to_string())?,
    );

    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    let (auth_url, _csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/userinfo.profile".into(),
        ))
        .set_pkce_challenge(pkce_challenge)
        .url();

    // open system browser
    open::that(auth_url.as_str()).unwrap();

    // start temporary server
    let _ = wait_for_callback(Arc::clone(&atomic)).await?;

    let _ = atomic.clone().once("result", move |evet| {
        let _ = async move {
            let token_result: oauth2::StandardTokenResponse<
                oauth2::EmptyExtraTokenFields,
                oauth2::basic::BasicTokenType,
            > = client
                .exchange_code(AuthorizationCode::new(evet.payload().to_string()))
                .set_pkce_verifier(pkce_verifier)
                .request_async(async_http_client)
                .await
                .map_err(|e| e.to_string())
                .unwrap();
            save_user_info(atomic.clone(), token_result).await;
        };
    });

    Ok("login_has_successed".to_string())
}

fn generate_query(query_str: String) -> Result<HashMap<String, String>, String> {
    let mut query = HashMap::new();
    for pair in query_str.split('&') {
        let mut parts = pair.split('=');
        query.insert(
            parts.next().unwrap_or("").to_string(),
            parts.next().unwrap_or("").to_string(),
        );
    }
    return Ok(query);
}
async fn wait_for_callback(window: Arc<Window>) -> Result<String, String> {
    let atom = window.clone();
    let callback = tower::service_fn(move |req: Request| {
        let atom = atom.clone();
        async move {
            let query = generate_query(req.uri().query().unwrap_or("").to_string()).unwrap();

            match query.get("code") {
                Some(code) => {
                    // handle code
                    let _ = atom.emit("result", code);

                    let _ = atom.set_focus();
                }
                None => {
                    // handle missing code
                    let _ = atom.emit("oauth_result", "feild");
                }
            }
            Ok::<_, Infallible>(Response::new(Body::empty()))
        }
    });

    let listener = tokio::net::TcpListener::bind("127.0.0.1:7878")
        .await
        .map_err(|err| err.to_string())?;
    let router = Router::new().route("/callback", get_service(callback));

    let server = serve(listener, router);

    server.await.map_err(|e| e.to_string())?;
    todo!()
}

#[derive(Serialize,Deserialize,Clone)]
struct ResponseToken {
    access_token: String,
}
async fn save_user_info(
    atomic: Arc<Window>,
    token_res: StandardTokenResponse<EmptyExtraTokenFields, BasicTokenType>,
) {
    let mut body=  HashMap::new();
    body.insert("token".to_string(), token_res.access_token().secret().as_str().to_string());
    let info = Client::new();
    let payload = info
        .post("http://localhost:4000/oauth")
        .form(&body).send().await.unwrap();
    let _ = atomic.emit("token", payload.json::<ResponseToken>().await.unwrap());
}
