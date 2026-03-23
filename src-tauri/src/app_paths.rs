use std::path::PathBuf;

use tauri::Manager;

/// Returns the application data directory, using a dev-specific subfolder while running in development.
pub fn app_data_dir(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let mut path = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;

    if tauri::is_dev() {
        path.push("Development");
    }

    Ok(path)
}
