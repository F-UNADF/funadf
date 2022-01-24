class Church < Structure

  has_many :phases, ->(career){where('church_id IS NOT NULL')}, class_name: "Career", foreign_key: :church_id

  def staff
    phases.where('end_at IS NULL')
  end

end