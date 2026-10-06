class Career < ActiveRecord::Base
  belongs_to :user
  belongs_to :referent, class_name: "User", foreign_key: :referent_id

  belongs_to :church
  belongs_to :assoc, class_name: "Association", foreign_key: :association_id

  delegate :fullname, to: :referent, prefix: true, allow_nil: true
  delegate :name, to: :church, prefix: true, allow_nil: true
  delegate :name, to: :assoc, prefix: true, allow_nil: true
  delegate :name, to: :user, prefix: true, allow_nil: true
end
