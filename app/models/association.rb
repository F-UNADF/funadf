class Association < Structure
  resourcify

  has_many :roles, foreign_key: :resource_id

end