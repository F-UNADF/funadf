class Association < Structure

  has_many :responsabilities, ->(career){where('association_id IS NOT NULL')}, class_name: "Career", foreign_key: :association_id

  def staff
    responsabilities.where('end_at IS NULL')
  end

end