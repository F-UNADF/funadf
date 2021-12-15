# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_15_130353) do

  create_table "active_storage_attachments", charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.string "trackable_type"
    t.bigint "trackable_id"
    t.string "owner_type"
    t.bigint "owner_id"
    t.string "key"
    t.text "parameters"
    t.string "recipient_type"
    t.bigint "recipient_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["owner_id", "owner_type"], name: "index_activities_on_owner_id_and_owner_type"
    t.index ["owner_type", "owner_id"], name: "index_activities_on_owner"
    t.index ["recipient_id", "recipient_type"], name: "index_activities_on_recipient_id_and_recipient_type"
    t.index ["recipient_type", "recipient_id"], name: "index_activities_on_recipient"
    t.index ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type"
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable"
  end

  create_table "attachments", id: :integer, charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.integer "post_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_attachments_on_post_id"
  end

  create_table "campaigns", id: :integer, charset: "utf8", force: :cascade do |t|
    t.integer "structure_id"
    t.string "name"
    t.text "description"
    t.string "code"
    t.datetime "start_at"
    t.datetime "end_at"
    t.boolean "opened"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "is_public"
    t.integer "meeting_id"
    t.boolean "manual"
    t.string "state", default: "coming"
    t.index ["structure_id"], name: "index_campaigns_on_structure_id"
  end

  create_table "categories", id: :integer, charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.string "name"
    t.string "color"
    t.string "kind"
    t.integer "structure_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title"
    t.string "description"
    t.datetime "start_at"
    t.datetime "end_at"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "structure_id"
    t.integer "category_id"
    t.index ["category_id"], name: "index_events_on_category_id"
    t.index ["structure_id"], name: "index_events_on_structure_id"
  end

  create_table "gratitudes", charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.string "level"
    t.integer "referent_id"
    t.date "start_at"
    t.date "end_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_gratitudes_on_user_id"
  end

  create_table "intranets", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "subdomain"
    t.integer "structure_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["structure_id"], name: "index_intranets_on_structure_id"
  end

  create_table "meetings", id: :integer, charset: "utf8", force: :cascade do |t|
    t.string "name"
    t.date "begin_at"
    t.date "end_at"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "motions", id: :integer, charset: "utf8", force: :cascade do |t|
    t.integer "campaign_id"
    t.integer "order"
    t.string "name"
    t.string "kind"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["campaign_id"], name: "index_motions_on_campaign_id"
  end

  create_table "notifications", id: :integer, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "posts", id: :integer, charset: "utf8", collation: "utf8_unicode_ci", force: :cascade do |t|
    t.string "title"
    t.text "content"
    t.integer "structure_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["structure_id"], name: "index_posts_on_structure_id"
  end

  create_table "roles", id: :integer, charset: "utf8", force: :cascade do |t|
    t.string "name"
    t.integer "resource_id"
    t.string "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.index ["resource_id", "resource_type"], name: "index_roles_on_resource_id_and_resource_type"
  end

  create_table "rolizations", id: :integer, charset: "utf8", force: :cascade do |t|
    t.integer "role_id"
    t.integer "resource_id"
    t.string "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean "can_vote", default: true
    t.string "reason"
    t.index ["resource_id", "resource_type"], name: "index_rolizations_on_resource_id_and_resource_type"
    t.index ["role_id"], name: "index_rolizations_on_role_id"
  end

  create_table "structures", id: :integer, charset: "utf8", force: :cascade do |t|
    t.string "name"
    t.string "address_1"
    t.string "address_2"
    t.string "zipcode"
    t.string "town"
    t.string "phone_1"
    t.string "phone_2"
    t.string "type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string "email"
  end

  create_table "uploads", id: :integer, charset: "utf8", force: :cascade do |t|
    t.string "file"
    t.boolean "has_heading"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", id: :integer, charset: "utf8", force: :cascade do |t|
    t.string "firstname"
    t.string "lastname"
    t.string "address_1"
    t.string "address_2"
    t.string "zipcode"
    t.string "town"
    t.string "phone_1"
    t.string "phone_2"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "avatar_file_name"
    t.string "avatar_content_type"
    t.integer "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer "invitation_limit"
    t.integer "invited_by_id"
    t.string "invited_by_type"
    t.integer "invitations_count", default: 0
    t.string "level"
    t.date "birthdate"
    t.boolean "disabled", default: false
    t.string "access_token"
    t.text "biography"
    t.index ["access_token"], name: "index_users_on_access_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["invitation_token"], name: "index_users_on_invitation_token", unique: true
    t.index ["invitations_count"], name: "index_users_on_invitations_count"
    t.index ["invited_by_id", "invited_by_type"], name: "index_users_on_invited_by_id_and_invited_by_type"
    t.index ["invited_by_id"], name: "index_users_on_invited_by_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "voters", id: false, charset: "utf8", force: :cascade do |t|
    t.integer "motion_id"
    t.datetime "voted_at"
    t.string "ip"
    t.integer "resource_id"
    t.string "resource_type"
    t.index ["motion_id"], name: "index_voters_on_motion_id"
    t.index ["resource_id", "resource_type"], name: "index_voters_on_resource_id_and_resource_type"
  end

  create_table "votes", id: false, charset: "utf8", force: :cascade do |t|
    t.integer "motion_id"
    t.string "result"
    t.boolean "is_consultative"
    t.index ["motion_id"], name: "index_votes_on_motion_id"
  end

  create_table "voting_tables", id: :integer, charset: "utf8", force: :cascade do |t|
    t.integer "campaign_id"
    t.string "position"
    t.string "voting"
    t.boolean "as_member"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_voting_tables_on_campaign_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "attachments", "posts"
  add_foreign_key "events", "categories"
  add_foreign_key "events", "structures"
  add_foreign_key "intranets", "structures"
  add_foreign_key "posts", "structures"
  add_foreign_key "voting_tables", "campaigns"
end
