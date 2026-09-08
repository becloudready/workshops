resource "supabase_project" "db" {
  organization_id   = var.supabase_organization_id
  name              = var.supabase_project_name
  database_password = var.supabase_db_password
  region            = var.supabase_region

  timeouts {
    create = "30m"
    update = "15m"
  }
}

resource "supabase_settings" "db" {
  project_ref = supabase_project.db.id

  network = jsonencode({
    restrictions = [
      "0.0.0.0/0",
      "::/0"
    ]
  })

  database = jsonencode({
    statement_timeout = "30s"
  })
}
