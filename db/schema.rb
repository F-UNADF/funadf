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

ActiveRecord::Schema.define(version: 20210708082848) do

  create_table "campaigns", force: :cascade do |t|
    t.integer  "structure_id", limit: 4
    t.string   "name",         limit: 255
    t.text     "description",  limit: 65535
    t.string   "code",         limit: 255
    t.datetime "start_at"
    t.datetime "end_at"
    t.boolean  "opened"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "is_public"
    t.integer  "meeting_id",   limit: 4
    t.boolean  "manual"
    t.string   "state",        limit: 255,   default: "coming"
  end

  add_index "campaigns", ["structure_id"], name: "index_campaigns_on_structure_id", using: :btree

  create_table "intranets", force: :cascade do |t|
    t.string   "subdomain",    limit: 255
    t.integer  "structure_id", limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "intranets", ["structure_id"], name: "index_intranets_on_structure_id", using: :btree

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

# Could not dump table "rolizations" because of following FrozenError
#   can't modify frozen String: "true"

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

# Could not dump table "users" because of following FrozenError
#   can't modify frozen String: "false"

  create_table "voters", id: false, force: :cascade do |t|
    t.integer  "motion_id",     limit: 4
    t.datetime "voted_at"
    t.string   "ip",            limit: 255
    t.integer  "resource_id",   limit: 4
    t.string   "resource_type", limit: 255
  end

  add_index "voters", ["motion_id"], name: "index_voters_on_motion_id", using: :btree
  add_index "voters", ["resource_id", "resource_type"], name: "index_voters_on_resource_id_and_resource_type", using: :btree

  create_table "votes", id: false, force: :cascade do |t|
    t.integer "motion_id",       limit: 4
    t.string  "result",          limit: 255
    t.boolean "is_consultative"
  end

  add_index "votes", ["motion_id"], name: "index_votes_on_motion_id", using: :btree

  create_table "voting_tables", force: :cascade do |t|
    t.integer  "campaign_id", limit: 4
    t.string   "position",    limit: 255
    t.string   "voting",      limit: 255
    t.boolean  "as_member"
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "voting_tables", ["campaign_id"], name: "index_voting_tables_on_campaign_id", using: :btree

  add_foreign_key "intranets", "structures"
  add_foreign_key "voting_tables", "campaigns"
end
