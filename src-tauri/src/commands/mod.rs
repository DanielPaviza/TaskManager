use crate::app_paths::app_data_dir;
use crate::database::{backup_data_file, JsonStore, DATA_FILE_NAME, SETTINGS_FILE_NAME};

fn load_store(app_handle: tauri::AppHandle, file_name: &str, label: &str) -> Result<String, String> {
    eprintln!("{} called", label);
    let base_dir = app_data_dir(&app_handle)?;
    let store = JsonStore::new(base_dir, file_name);
    match store.load() {
        Ok(data) => Ok(data),
        Err(err) => {
            eprintln!(
                "{} missing or unreadable ({}), returning empty object instead",
                label, err
            );
            Ok("{}".to_string())
        }
    }
}

fn save_store(
    app_handle: tauri::AppHandle,
    file_name: &str,
    json_data: String,
    label: &str,
) -> Result<(), String> {
    eprintln!("{} called with json_data: {}", label, json_data);
    let base_dir = app_data_dir(&app_handle)?;
    let store = JsonStore::new(base_dir, file_name);
    eprintln!("Store created, about to save");
    let result = store.save(&json_data);
    eprintln!("save() returned: {:?}", result);
    result.map_err(|e| {
        eprintln!("Error from save: {}", e);
        e.to_string()
    })?;
    eprintln!("{} completed successfully", label);
    Ok(())
}

#[tauri::command]
pub fn load_data(app_handle: tauri::AppHandle) -> Result<String, String> {
    load_store(app_handle, DATA_FILE_NAME, "load_data")
}

#[tauri::command]
pub fn save_data(app_handle: tauri::AppHandle, json_data: String) -> Result<(), String> {
    save_store(app_handle, DATA_FILE_NAME, json_data, "save_data")
}

#[tauri::command]
pub fn save_data_backup(app_handle: tauri::AppHandle) -> Result<String, String> {
    eprintln!("save_data_backup called");
    let base_dir = app_data_dir(&app_handle)?;
    let backup_path = backup_data_file(base_dir).map_err(|err| {
        eprintln!("Backup failed: {}", err);
        err.to_string()
    })?;
    eprintln!("Backup created at {}", backup_path.display());
    Ok(backup_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn load_settings(app_handle: tauri::AppHandle) -> Result<String, String> {
    load_store(app_handle, SETTINGS_FILE_NAME, "load_settings")
}

#[tauri::command]
pub fn save_settings(app_handle: tauri::AppHandle, json_data: String) -> Result<(), String> {
    save_store(app_handle, SETTINGS_FILE_NAME, json_data, "save_settings")
}

#[tauri::command]
pub async fn get_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    let path = app_data_dir(&app_handle)?;
    Ok(path.to_string_lossy().to_string())
}
