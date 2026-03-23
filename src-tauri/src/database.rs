use std::fs;
use std::path::{Path, PathBuf};

use anyhow::{Context, Result};
use chrono::Local;

pub const DATA_FILE_NAME: &str = "taskDb.json";
pub const SETTINGS_FILE_NAME: &str = "settings.json";
pub const BACKUPS_DIR_NAME: &str = "Backups";

#[derive(Debug)]
pub struct JsonStore {
    file_path: PathBuf,
}

impl JsonStore {
    pub fn new(base_path: PathBuf, file_name: impl AsRef<Path>) -> Self {
        let file_path = base_path.join(file_name);
        JsonStore { file_path }
    }


    /// Ensures the file exists, creating it with '{}' if missing
    pub fn ensure_exists_with_empty_object(&self) -> Result<()> {
        let path = self.path();
        if !self.exists() {
            if let Some(parent) = path.parent() {
                fs::create_dir_all(parent)
                    .with_context(|| format!("Failed to create directories for: {}", path.display()))?;
            }
            fs::write(path, "{}")
                .with_context(|| format!("Failed to create file with empty object: {}", path.display()))?;
        }
        Ok(())
    }

    pub fn load(&self) -> Result<String> {
        self.ensure_exists_with_empty_object()?;
        let path = self.path();
        let content = fs::read_to_string(path)
            .with_context(|| format!("Failed to read file: {}", path.display()))?;
        Ok(content)
    }

    #[inline(never)]
    pub fn save(&self, data: &str) -> Result<()> {
        self.ensure_exists_with_empty_object()?;
        let path = self.path();
        eprintln!("Saving to path: {}", path.display());
        if let Some(parent) = path.parent() {
            eprintln!("Ensuring parent dir exists: {}", parent.display());
            fs::create_dir_all(parent)
                .with_context(|| format!("Failed to create directories for: {}", path.display()))?;
        }
        eprintln!("Writing data: {}", data);
        fs::write(path, data)
            .with_context(|| format!("Failed to write to file: {}", path.display()))?;
        eprintln!("Save complete");
        Ok(())
    }

    pub fn exists(&self) -> bool {
        self.file_path.exists()
    }

    pub fn path(&self) -> &Path {
        &self.file_path
    }
}

pub fn backup_data_file(base_path: PathBuf) -> Result<PathBuf> {
    let store = JsonStore::new(base_path.clone(), DATA_FILE_NAME);
    store.ensure_exists_with_empty_object()?;

    let source_path = store.path().to_path_buf();
    let backup_dir = base_path.join(BACKUPS_DIR_NAME);
    fs::create_dir_all(&backup_dir)
        .with_context(|| format!("Failed to create backup directory: {}", backup_dir.display()))?;

    let timestamp = Local::now().format("%Y_%m_%d_%H_%M_%S").to_string();
    let backup_file_name = format!("taskDb_{}.json", timestamp);
    let backup_path = backup_dir.join(backup_file_name);

    fs::copy(&source_path, &backup_path).with_context(|| {
        format!(
            "Failed to copy data file from {} to {}",
            source_path.display(),
            backup_path.display()
        )
    })?;

    Ok(backup_path)
}