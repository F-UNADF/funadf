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

ActiveRecord::Schema.define(version: 20180305122853) do

  create_table "campaigns", force: true do |t|
    t.integer  "structure_id"
    t.string   "name"
    t.text     "description"
    t.string   "code"
    t.datetime "start_at"
    t.datetime "end_at"
    t.boolean  "opened"
    t.string   "state"
    t.boolean  "public"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "motions", force: true do |t|
    t.integer  "campaign_id"
    t.integer  "order"
    t.string   "name"
    t.string   "kind"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "motions", ["campaign_id"], name: "index_motions_on_campaign_id", using: :btree

  create_table "roles", force: true do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "rolizations", force: true do |t|
    t.integer  "role_id"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "structures", force: true do |t|
    t.string   "name"
    t.string   "address_1"
    t.string   "address_2"
    t.string   "zipcode"
    t.string   "town"
    t.string   "phone_1"
    t.string   "phone_2"
    t.string   "type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email"
  end

  create_table "users", force: true do |t|
    t.string   "firstname"
    t.string   "lastname"
    t.string   "address_1"
    t.string   "address_2"
    t.string   "zipcode"
    t.string   "town"
    t.string   "phone_1"
    t.string   "phone_2"
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "avatar_file_name"
    t.string   "avatar_content_type"
    t.integer  "avatar_file_size"
    t.datetime "avatar_updated_at"
    t.string   "invitation_token"
    t.datetime "invitation_created_at"
    t.datetime "invitation_sent_at"
    t.datetime "invitation_accepted_at"
    t.integer  "invitation_limit"
    t.integer  "invited_by_id"
    t.string   "invited_by_type"
    t.integer  "invitations_count",      default: 0
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["invitation_token"], name: "index_users_on_invitation_token", unique: true, using: :btree
  add_index "users", ["invitations_count"], name: "index_users_on_invitations_count", using: :btree
  add_index "users", ["invited_by_id"], name: "index_users_on_invited_by_id", using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
