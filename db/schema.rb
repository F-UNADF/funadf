# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20200225100411) do

  create_table "campaigns", force: :cascade do |t|
    t.integer  "structure_id", limit: 4
    t.string   "name",         limit: 255
    t.text     "description",  limit: 65535
    t.string   "code",         limit: 255
    t.datetime "start_at"
    t.datetime "end_at"
    t.boolean  "opened"
    t.string   "state",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_public"
    t.integer  "meeting_id",   limit: 4
  end

  add_index "campaigns", ["structure_id"], name: "index_campaigns_on_structure_id", using: :btree

  create_table "electors", force: :cascade do |t|
    t.integer  "resource_id",   limit: 4
    t.string   "resource_type", limit: 255
    t.integer  "structure_id",  limit: 4
    t.boolean  "can_vote",                    default: true
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "note",          limit: 65535
  end

  add_index "electors", ["resource_id", "resource_type"], name: "index_electors_on_resource_id_and_resource_type", using: :btree
  add_index "electors", ["structure_id"], name: "index_electors_on_structure_id", using: :btree

  create_table "meetings", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.date     "begin_at"
    t.date     "end_at"
    t.text     "description", limit: 65535
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "motions", force: :cascade do |t|
    t.integer  "campaign_id", limit: 4
    t.integer  "order",       limit: 4
    t.string   "name",        limit: 255
    t.string   "kind",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "motions", ["campaign_id"], name: "index_motions_on_campaign_id", using: :btree

  create_table "roles", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.integer  "resource_id",   limit: 4
    t.string   "resource_type", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "roles", ["resource_id", "resource_type"], name: "index_roles_on_resource_id_and_resource_type", using: :btree

  create_table "rolizations", force: :cascade do |t|
    t.integer  "role_id",       limit: 4
    t.integer  "resource_id",   limit: 4
    t.string   "resource_type", limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rolizations", ["resource_id", "resource_type"], name: "index_rolizations_on_resource_id_and_resource_type", using: :btree
  add_index "rolizations", ["role_id"], name: "index_rolizations_on_role_id", using: :btree

  create_table "structures", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "address_1",  limit: 255
    t.string   "address_2",  limit: 255
    t.string   "zipcode",    limit: 255
    t.string   "town",       limit: 255
    t.string   "phone_1",    limit: 255
    t.string   "phone_2",    limit: 255
    t.string   "type",       limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",      limit: 255
  end

  create_table "uploads", force: :cascade do |t|
    t.string   "file",        limit: 255
    t.boolean  "has_heading"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string   "firstname",              limit: 255
    t.string   "lastname",               limit: 255
    t.string   "address_1",              limit: 255
    t.string   "address_2",              limit: 255
    t.string   "zipcode",                limit: 255
    t.string   "town",                   limit: 255
    t.string   "phone_1",                limit: 255
    t.string   "phone_2",                limit: 255
    t.string   "email",                  limit: 255, default: "",    null: false
    t.string   "encrypted_password",     limit: 255, default: "",    null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0,     null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at",                                         null: false
    t.datetime "updated_at",                                         null: false
    t.string   "avatar_file_name",       limit: 255
    t.string   "avatar_content_type",    limit: 255
    t.integer  "avatar_file_size",       limit: 4
    t.datetime "avatar_updated_at"
    t.string   "invitation_token",       limit: 255
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit",       limit: 4
    t.integer  "invited_by_id",          limit: 4
    t.string   "invited_by_type",        limit: 255
    t.integer  "invitations_count",      limit: 4,   default: 0
    t.string   "level",                  limit: 255
    t.date     "birthdate"
    t.boolean  "disabled",                           default: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["invitation_token"], name: "index_users_on_invitation_token", unique: true, using: :btree
  add_index "users", ["invitations_count"], name: "index_users_on_invitations_count", using: :btree
  add_index "users", ["invited_by_id", "invited_by_type"], name: "index_users_on_invited_by_id_and_invited_by_type", using: :btree
  add_index "users", ["invited_by_id"], name: "index_users_on_invited_by_id", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

  create_table "voters", id: false, force: :cascade do |t|
    t.integer  "motion_id",     limit: 4
    t.integer  "elector_id",    limit: 4
    t.datetime "voted_at"
    t.string   "ip",            limit: 255
    t.integer  "resource_id",   limit: 4
    t.string   "resource_type", limit: 255
  end

  add_index "voters", ["elector_id"], name: "index_voters_on_elector_id", using: :btree
  add_index "voters", ["motion_id"], name: "index_voters_on_motion_id", using: :btree
  add_index "voters", ["resource_id", "resource_type"], name: "index_voters_on_resource_id_and_resource_type", using: :btree

  create_table "votes", id: false, force: :cascade do |t|
    t.integer "motion_id",       limit: 4
    t.string  "result",          limit: 255
    t.boolean "is_consultative"
  end

  add_index "votes", ["motion_id"], name: "index_votes_on_motion_id", using: :btree

end
